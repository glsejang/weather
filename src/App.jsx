import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { getWeeklyWeather } from './api/weatherInfo'
import { makeWeatherPrompt } from './api/makePrompt'
import { askGemini } from './api/ask'
import { cityNameMap } from './api/cityNameMap';

import RegionSelector from './components/RegionSelector'
import PlantInput from './components/PlantInput'


import './App.scss'
``
function App() {


  const[forecast, setForecast] = useState([])

  const [selectedDo, setSelectedDo] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [plants, setPlants] = useState([]);
  const addPlant = (plant) => {
    setPlants([...plants, plant]);
  };


    useEffect(() => {
    if (!selectedCity) return; 
    askGemini()

    const cityInEnglish = cityNameMap[selectedCity] || selectedCity;
    console.log('API에 넘길 영어 도시명:', cityInEnglish);  // 여기서 확인

    getWeeklyWeather(cityInEnglish)
      .then(data => {
        setForecast(data);
        const prompt = makeWeatherPrompt(cityInEnglish, data);
        console.log(prompt);
        askGemini(prompt).then(response => {
        });
      });
  }, [selectedCity]);


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
      </div>
      
    </>
  )
}

export default App
