import { getWeeklyWeather } from "./weatherInfo"


export function makeWeatherPrompt(city, forecast, plants) {
  const summary = forecast.map((day) => {
    const date = new Date(day.date).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    })
    return `- ${date}: 평균 ${day.avgTemp}도, ${day.condition}, 습도 ${day.humidity}%, 강수 확률 ${day.rainChance}%`
  }).join('\n')

  const plantList = plants.join(', ');

  return `
  이번 주 ${city}의 날씨는 다음과 같습니다:
  ${summary}
  제가 키우는 식물은 ${plantList} 입니다.  
  이러한 날씨 조건에서 식물별로 하루 단위로 해야 할 일을 다음 형식으로 정리해서 알려주세요.

  - 식물 이름:
    - 날짜:
      - 해야 할 일 (1~2줄 요약)
      - 주의사항 (있다면)

  예시:
  - 장미:
    - 7월 3일:
      - 오전에 물을 주세요.
      - 습도가 높으니 통풍이 잘 되는 곳에 두세요.
    - 7월 4일:
      - 특별한 조치는 필요 없습니다.

  형식에 맞춰 주세요. 불필요한 설명은 생략하고, To-do 형식으로만 정리해주세요.
  `.trim()
}

