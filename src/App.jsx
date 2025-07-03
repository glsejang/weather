import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { getWeeklyWeather } from './api/weatherInfo'
import { makeWeatherPrompt } from './api/makePrompt'
import { askGemini, parseTodoResponse   } from './api/ask'
import { cityNameMap } from './api/cityNameMap';
import { SavedInfo } from './components/savedInfo'

import RegionSelector from './components/RegionSelector'
import PlantInput from './components/PlantInput'
import { TodoCard } from './components/ToDoCard'
import { DateGroupedView } from './components/DateGroupedView'

import db from './api/db';



import './App.scss'
function App() {

  const [sort, setSort] = useState('날짜')
  const[forecast, setForecast] = useState([])

  const [selectedDo, setSelectedDo] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [plants, setPlants] = useState(['장미', '로즈마리']);

  const [todoCard, setTodoCard] = useState([]); // 구조화된 데이터

  const addPlant = (plantName) => {
  setPlants([...plants, plantName]);
};

  useEffect(() => {
    async function fetchTodos() {
      const todos = await db.todos.toArray();
      if (todos.length > 0) setTodoCard(todos);
    }
    fetchTodos();
  }, []);

  console.log(todoCard)


  useEffect(() => {
    async function saveTodos() {
      await db.todos.clear();
      for (const todo of todoCard) {
        await db.todos.put(todo);
      }
    }
    if (todoCard.length > 0) {
      saveTodos();
    }
  }, [todoCard]);
  const handleSaveTodos = async () => {
    if (todoCard.length === 0) return;

    await db.todos.clear();  // 기존 데이터 초기화 (원한다면)
    for (const todo of todoCard) {
      await db.todos.put(todo);
    }
    // 저장 후 상태 직접 갱신
    const savedTodos = await db.todos.toArray();
    setTodoCard(savedTodos);
  };




  const fetchTodosFromGemini = async () => {
    if (!selectedCity) {
      alert("지역을 선택해주세요.");
      return;
    }

    const cityInEnglish = cityNameMap[selectedCity] || selectedCity;

    try {
      const weatherData = await getWeeklyWeather(cityInEnglish);
      setForecast(weatherData);

      const prompt = makeWeatherPrompt(cityInEnglish, weatherData, plants);
      console.log("[Prompt]", prompt);

      const responseText = await askGemini(prompt);
      const parsed = parseTodoResponse(responseText);

      setTodoCard(parsed); // 상태 저장 → useEffect 통해 db에 저장됨
    } catch (error) {
      console.error("Gemini 또는 날씨 API 호출 실패:", error);
    }
  };
    
  useEffect(() => {
  async function fetchRegion() {
    const region = await db.region.get('selected');
    if (region) {
      setSelectedDo(region.do);
      setSelectedCity(region.city);
    }
    }
    fetchRegion();
  }, []);

  useEffect(() => {
    if (selectedDo && selectedCity) {
      db.region.put({ do: selectedDo, city: selectedCity }, 'selected');
    }
  }, [selectedDo, selectedCity]);


    useEffect(() => {
      async function fetchPlants() {
        const storedPlants = await db.plants.toArray();
        if (storedPlants.length > 0) {
          setPlants(storedPlants.map(p => p.name));
        }
      }
      fetchPlants();
    }, []);

    useEffect(() => {
      db.plants.clear();
      plants.forEach(name => {
        db.plants.add({ name });
      });
    }, [plants]);

    const handleCreateAndSave = async () => {
      await fetchTodosFromGemini();
      await handleSaveTodos();
    };



  return (
    <>
      <div className='wrap'>
        <div className='info'>          
          <RegionSelector
            selectedDo={selectedDo}
            setSelectedDo={setSelectedDo}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
          <PlantInput addPlant={addPlant} />

          <SavedInfo />
          <button onClick={handleCreateAndSave}>할 일 생성하기</button>
        </div>



        <div className='todo'>
          <button className='sortbtn' onClick={()=>{ setSort('날짜')}}>날짜 별</button>

          <button className='sortbtn' onClick={()=>{ setSort('식물')}}>식물 별</button>

          {sort === '날짜' ? (
              <DateGroupedView data={todoCard} />
            ) : (
              todoCard.map((plant, idx) => (
                <TodoCard key={idx} todoCard={plant} />
              ))
            )}
          

          {sort === '식물' && todoCard.length > 0 &&
            todoCard.map((plant, idx) => (
              <TodoCard key={idx} todoCard={plant} />
            ))
}
          

          
        </div>


      </div>
      
    </>
  )
}

export default App
