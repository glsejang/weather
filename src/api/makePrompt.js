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
  **너는 식물 관리 전문가이자 숙련된 식물학자야.** 
  너는 사용자에게 ${city}의 주간 날씨 정보를 바탕으로, 
  키우고 있는 ${plantList} 각 식물에 대한 최적의 관리 계획을 제공해야 해. 
  너의 목표는 사용자의 식물이 건강하게 자랄 수 있도록 정확하고 실용적인 조언을 주는 거야.

  ${summary}

  현재 키우고 있는 식물 목록입니다:
  ${plantList}

  위 날씨 요약과 각 식물의 **일반적인 관리법(물 주기 빈도, 햇빛 요구량, 적정 온도, 습도 등)**을 고려하여, 
  식물별 날짜별 할 일을 아래 형식으로 작성해주세요. 할 일과 주의사항은 각각 1~2줄로 간결하게 작성해주세요. 
  특별한 관리 지침이 필요 없는 날에는 할 일은 "할 일 없음"으로, 주의사항은 "날씨가 좋네요"와 같이 작성해주세요.
  지금은 25년 입니다.

  형식:
  - 식물명:
    -YYYY-MM-DD:
      - 할 일
      - 주의사항

  예시:
  - 장미:
    - 2025-07-05:
      - 오전에 물 주세요.
      - 통풍에 주의하세요.
    - 2025-07-04:
      - 할 일 없음
      - 날씨가 좋네요
  `.trim()
  }

