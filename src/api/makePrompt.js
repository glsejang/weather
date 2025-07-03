import { getWeeklyWeather } from "./weatherInfo"


export function makeWeatherPrompt(city, forecast) {
  const summary = forecast.map((day) => {
    const date = new Date(day.date).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    })
    return `- ${date}: 평균 ${day.avgTemp}°C, ${day.condition}, 습도 ${day.humidity}%, 강수 확률 ${day.rainChance}%`
  }).join('\n')

  return `
이번 주 ${city}의 날씨는 다음과 같습니다:

${summary}

이러한 날씨 조건에서 식물의 물 주는 빈도나 위치 조정을 어떻게 하면 좋을까요?
실외에서 키우는 허브, 다육이, 고무나무 등에 대한 조언을 해주세요.
  `.trim()
}