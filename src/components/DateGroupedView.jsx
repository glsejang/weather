import { useState } from 'react';
import { groupingDate } from '../api/groupingDate';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';

export function DateGroupedView({ data, forecast }) {
  const grouped = groupingDate(data);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const conditionKoMap = {
    "Sunny": "맑음",
    "Partly Cloudy": "부분 흐림",
    "Patchy rain nearby": "곳에 따라 비",
    "Moderate rain": "보통 비",
    "Light rain": "약한 비",
    "Light drizzle": "이슬비",
    "Overcast": "흐림",
    "Cloudy": "흐림",
    "Thunderstorm": "뇌우",
    "Clear": "쾌청",
  };

  const weatherImageMap = {
    "맑음": "/weather/img/sunny.jpg",
    "부분 흐림": "/weather/img/partly-cloudy.jpg",
    "곳에 따라 비": "/weather/img/patchy-rain-nearby.jpg",
    "보통 비": "/weather/img/rain.jpg",
    "약한 비": "/weather/img/Light-rain.jpg",
    "이슬비": "/weather/img/rain.jpg",
    "흐림": "/weather/img/cloudy.jpg",
    "뇌우": "/weather/img/thunderstorm.jpg",
    "쾌청": "/weather/img/clear.jpg",
    "날씨 정보 없음": "/weather/img/default.jpg",
  };

  const weather = forecast.reduce((acc, cur) => {
    const dateKey = cur.date?.slice(0, 10);
    if (dateKey) {
      const conditionEn = cur.condition?.trim() || '날씨 정보 없음';
      const conditionKo = conditionKoMap[conditionEn] || conditionEn;
      const image = weatherImageMap[conditionKo] || weatherImageMap['날씨 정보 없음'];
      acc[dateKey] = {
        conditionKo,
        image,
        avgTemp: cur.avgTemp,
        humidity: cur.humidity,
        rainChance: cur.rainChance,
        icon: cur.icon,
      };
    }
    return acc;
  }, {});

  return (
    <div>
      {grouped.map((group, idx) => {
        const isExpanded = expandedIndex === idx;
        const weatherData = weather[group.date] || {};

        return (
          <Card
            key={idx}
            className=" cardblock"
            style={{
              marginBottom: '5px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => setExpandedIndex(isExpanded ? null : idx)}
          >
            {/* 이미지 헤더 */}
            <div style={{ position: 'relative' }}>
              <Card.Img
                src={weatherData.image}
                alt="날씨 이미지"
                style={{ height: '90px', objectFit: 'cover', opacity: 0.7 }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  padding: '0.5rem 1rem',
                }}
              >
                <Card.Title className='card_title' style={{ margin: 0 }}>
                  <span>{group.date}</span>
                  {weatherData.conditionKo && (
                    <>
                      <span> - {weatherData.conditionKo}</span>
                      <img
                        src={`https:${weatherData.icon}`}
                        alt={weatherData.conditionKo}
                        style={{ width: 20, height: 20, marginLeft: 8 }}
                      />
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      🌡 {weatherData.avgTemp}℃ &nbsp; 💧 {weatherData.humidity}% &nbsp; ☔ {weatherData.rainChance}%
                    </div>
                    </>
                  )}
                </Card.Title>
              </div>
            </div>

            {/* 확장 영역 */}
            {isExpanded && (
              <div style={{ padding: '1rem' }}>
                
                <ListGroup variant="flush">
                  {group.tasks.map((task, i) => (
                    <ListGroup.Item key={i} style={{ backgroundColor: 'rgba(26, 26, 26, 0.1)', color: '#fff' }}>
                      <strong>{task.plantName}</strong>
                      <br />
                      {task.todos.map((todo, j) => (
                        <div key={j} style={{ fontSize: '0.9rem' }}>
                          {todo}
                        </div>
                      ))}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}