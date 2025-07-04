import { groupingDate } from '../api/groupingDate';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';

export function DateGroupedView({ data, forecast }) {
  const grouped = groupingDate(data);


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
    // 필요 시 계속 추가 가능
  };

  const weatherImageMap = {
  "맑음": "/weather/img/sunny.jpg",
  "부분 흐림": "/weather/img/partly-cloudy.jpg",
  "곳에 따라 비": "/weather/img/rain.jpg",
  "보통 비": "/weather/img/rain.jpg",
  "약한 비": "/weather/img/rain.jpg",
  "이슬비": "/weather/img/drizzle.jpg",
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
    acc[dateKey] = { conditionKo, image };
  }
  return acc;
}, {});

console.log("grouped:", grouped.map(g => g.date));
 console.log("weather map:", weather)

  return (
    <div >
      {grouped.map((group, idx) => (
        
        
        <Card  key={idx} className="bg-dark text-white mb-3 dateCard" style={{minWidth:'400px'}}>
          <Card.Img 
            src={weather[group.date]?.image || './img/default.jpg'} 
            alt="Card image" 
            style={{height: '130px'}} />
          <Card.ImgOverlay style={{ backgroundColor: 'rgba(0,0,0,0.4)', overflowY: 'hidden', maxHeight: '120px' }}>
            <Card.Title>
              <span style={{fontSize:'1rem'}}>{group.date}</span>
              <span style={{fontSize:'1rem'}}>{weather[group.date] && ` - ${weather[group.date].conditionKo}`}</span>
            </Card.Title>
            <Card.Text >
              <ListGroup variant="flush">
                {group.tasks.map((task, i) => (
                  <ListGroup.Item className='todoText' key={i}>
                    <span style={{ fontSize:'1rem' }}>{task.plantName}:</span><br/>
                    {task.todos.map((todo, idx) => (
                      <span key={idx} style={{ display: 'block', fontSize:'0.8rem' }}>{todo}</span>
                    ))}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Text>
          </Card.ImgOverlay>
        </Card>
      ))}
    </div>

      




  );
}