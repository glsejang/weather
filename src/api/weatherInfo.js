import axios from 'axios'



export async function getWeeklyWeather(city) {
   const WEATHERAPI_KEY = import.meta.env.WEATHERAPI_KEY;


    const res = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
    params: {
      key: WEATHERAPI_KEY,
      q: city,
      days: 7,
      aqi: 'no',
      alerts: 'no',
    },
  })
  return res.data.forecast.forecastday.map((day) => ({
    date: day.date,
    avgTemp: day.day.avgtemp_c,
    condition: day.day.condition.text,
    icon: day.day.condition.icon,
    humidity: day.day.avghumidity,
    rainChance: day.day.daily_chance_of_rain,
    willItRain: day.day.daily_will_it_rain,
  }))
}

