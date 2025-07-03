import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { getWeeklyWeather } from './api/weatherInfo'
import { makeWeatherPrompt } from './api/makePrompt'
import { askGemini, parseTodoResponse   } from './api/ask'
import { cityNameMap } from './api/cityNameMap';

import RegionSelector from './components/RegionSelector'
import PlantInput from './components/PlantInput'
import { TodoCard } from './components/ToDoCard'

import db from './api/db';



import './App.scss'
function App() {


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





    useEffect(() => {
    if (!selectedCity) return; 


    const cityInEnglish = cityNameMap[selectedCity] || selectedCity;

    getWeeklyWeather(cityInEnglish)
      .then(data => {
        setForecast(data);
        const prompt = makeWeatherPrompt(cityInEnglish, data, plants);
        console.log(prompt);
        askGemini(prompt).then(responseText => {
          const parsed = parseTodoResponse(responseText)
          setTodoCard(parsed); // 상태 저장
        });
      });
  }, [selectedCity, plants]);


  return (
    <>
      <div className='wrap'>
        
        <RegionSelector
          selectedDo={selectedDo}
          setSelectedDo={setSelectedDo}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
        <PlantInput addPlant={addPlant} />

        {todoCard.length > 0 && todoCard.map((plant, idx) => (
          <TodoCard key={idx} todoCard={plant} />
        ))}

      </div>
      
    </>
  )
}

export default App
