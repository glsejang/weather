import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Button, Card, Container, Accordion, ButtonGroup   } from 'react-bootstrap';


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

  const [loading, setLoading] = useState(false);

  const [selectedDo, setSelectedDo] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showPlants, setShowPlants] = useState(false);

  const [plants, setPlants] = useState([]);

  const [todoCard, setTodoCard] = useState([]); // 구조화된 데이터

const addPlant = async (plantName) => {
  const trimmed = plantName.trim();
  if (!trimmed) return;

  const alreadyExists = plants.some(name => name.toLowerCase() === trimmed.toLowerCase());
  if (alreadyExists) return;

  setPlants(prev => [...prev, trimmed]);

  try {
    await db.plants.put({ name: trimmed }); // 중복이면 덮어쓰기
  } catch (err) {
    console.error('식물 저장 실패:', err);
  }
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

    if (loading) return; // 중복 클릭 방지

    const cityInEnglish = cityNameMap[selectedCity] || selectedCity;

    try {
      setLoading(true);

      const weatherData = await getWeeklyWeather(cityInEnglish);
      setForecast(weatherData);

      const prompt = makeWeatherPrompt(cityInEnglish, weatherData, plants);

      const responseText = await askGemini(prompt);
      const parsed = parseTodoResponse(responseText);

      setTodoCard(parsed);

      // todoCard가 갱신된 후 DB에 저장
      await db.todos.clear();
      for (const todo of parsed) {
        await db.todos.put(todo);
      }
    } catch (error) {
      console.error("Gemini 또는 날씨 API 호출 실패:", error);
    } finally {
      setLoading(false);
    }
  };

const handleCreateAndSave = async () => {
  if (loading) return;
  await fetchTodosFromGemini();
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
      const uniqueNames = [...new Set(storedPlants.map(p => p.name))];
      setPlants(uniqueNames);
    }
    fetchPlants();
  }, []);

    




  return (
    <>
      <div className='wrap'>
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>로딩 중입니다...</p>
          </div>
        )}


        
        
        <div className='info'> 

          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>정보 입력#1</Accordion.Header>
              <Accordion.Body>
                <RegionSelector
                  selectedDo={selectedDo}
                  setSelectedDo={setSelectedDo}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  />
                <PlantInput addPlant={addPlant} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>저장 내용 #2</Accordion.Header>
              <Accordion.Body>
                <SavedInfo />

                
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>


          
        </div>
        <div className="d-grid gap-2">
          <Button variant="primary"  onClick={handleCreateAndSave}>할 일 생성하기</Button>
        </div>
  
        <div className='todo'>

          <ButtonGroup aria-label="Basic example" className="w-100">

            <Button variant="secondary" className='sortbtn' onClick={()=>{ setSort('날짜')}}>날짜 별</Button>

            <Button variant="secondary" className='sortbtn' onClick={()=>{ setSort('식물')}}>식물 별</Button>


          </ButtonGroup>
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
