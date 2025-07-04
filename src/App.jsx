import { useEffect, useState } from 'react';
import { Button, Accordion, ButtonGroup } from 'react-bootstrap';

import { getWeeklyWeather } from './api/weatherInfo';
import { makeWeatherPrompt } from './api/makePrompt';
import { askGemini, parseTodoResponse } from './api/ask';
import { cityNameMap } from './api/cityNameMap';
import { SavedInfo } from './components/savedInfo';

import RegionSelector from './components/RegionSelector';
import PlantInput from './components/PlantInput';
import { TodoCard } from './components/ToDoCard';
import { DateGroupedView } from './components/DateGroupedView';

import db from './api/db';
import './App.scss';

function App() {
  const [sort, setSort] = useState('날짜');
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDo, setSelectedDo] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [plants, setPlants] = useState([]);
  const [todoCard, setTodoCard] = useState([]);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // ✅ 식물 추가
  const addPlant = async (plantName) => {
    const trimmed = plantName.trim();
    if (!trimmed || plants.includes(trimmed)) return;

    setPlants(prev => [...prev, trimmed]);
    try {
      await db.plants.put({ name: trimmed });
    } catch (err) {
      console.error('식물 저장 실패:', err);
    }
  };

  // ✅ 지역 불러오기
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

  // ✅ 지역 저장
  useEffect(() => {
    if (selectedDo && selectedCity) {
      db.region.put({ do: selectedDo, city: selectedCity }, 'selected');
    }
  }, [selectedDo, selectedCity]);

  // ✅ 식물 불러오기
  useEffect(() => {
    async function fetchPlants() {
      const storedPlants = await db.plants.toArray();
      const names = [...new Set(storedPlants.map(p => p.name))];
      setPlants(names);
    }
    fetchPlants();
  }, []);

  // ✅ 할 일 불러오기
  useEffect(() => {
    async function fetchTodos() {
      const todos = await db.todos.toArray();
      if (todos.length > 0) {
        setTodoCard(todos);
      }
      setIsInitialLoad(false);
    }
    fetchTodos();
  }, []);

  // ✅ 할 일 자동 저장 (초기 로딩 후부터만)
  useEffect(() => {
    if (isInitialLoad) return;
    async function saveTodos() {
      await db.todos.clear();
      for (const todo of todoCard) {
        await db.todos.put(todo);
      }
    }
    if (todoCard.length > 0) {
      saveTodos();
    }
  }, [todoCard, isInitialLoad]);

  // ✅ 날씨 불러오기
  useEffect(() => {
    async function loadForecast() {
      const saved = await db.forecast.toArray();
      if (saved.length > 0) {
        setForecast(saved);
      }
    }
    loadForecast();
  }, []);

  // ✅ Gemini 호출 및 DB 저장
  const fetchTodosFromGemini = async () => {
    if (!selectedCity || loading) return;
    const cityInEnglish = cityNameMap[selectedCity] || selectedCity;

    try {
      setLoading(true);

      const weatherData = await getWeeklyWeather(cityInEnglish);
      await db.forecast.clear();
      for (const day of weatherData) await db.forecast.put(day);
      setForecast(weatherData);

      const prompt = makeWeatherPrompt(cityInEnglish, weatherData, plants);
      const responseText = await askGemini(prompt);

      const parsed = parseTodoResponse(responseText);
      console.log('parsed:', parsed);

      setTodoCard(parsed); // 저장은 useEffect에서 처리됨

    } catch (err) {
      console.error('Gemini 호출 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>로딩 중입니다...</p>
        </div>
      )}

      <div className="info">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>지역 / 식물 입력</Accordion.Header>
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
            <Accordion.Header>저장 내용 보기</Accordion.Header>
            <Accordion.Body>
              <SavedInfo />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="d-grid gap-2">
        <Button variant="primary" onClick={fetchTodosFromGemini}>
          할 일 생성하기
        </Button>
      </div>

      <div className="todo">
        <ButtonGroup className="w-100">
          <Button variant="secondary" className="sortbtn" onClick={() => setSort('날짜')}>
            날짜 별
          </Button>
          <Button variant="secondary" className="sortbtn" onClick={() => setSort('식물')}>
            식물 별
          </Button>
        </ButtonGroup>

        {sort === '날짜' ? (
          <DateGroupedView data={todoCard} forecast={forecast} />
        ) : (
          todoCard.map((plant, idx) => <TodoCard key={idx} todoCard={plant} />)
        )}
      </div>
    </div>
  );
}

export default App;