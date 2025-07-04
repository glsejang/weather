import { GoogleGenerativeAI } from "@google/generative-ai"; 



export async function askGemini(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("[Debug] prompt content:", prompt);
    console.log("[Debug] prompt type:", typeof prompt);
    console.log("[Debug] prompt length:", prompt?.length);



  const ai = new GoogleGenerativeAI(apiKey); 

  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const result = await model.generateContent({
    contents: [
      {
        role: "user", 
        parts: [
          { text: prompt }
        ]
      }
    ]
  });

  const responseText = result.response.candidates[0].content.parts[0].text;
  console.log(responseText)
  const parsed = parseTodoResponse(responseText);
  console.log(parsed)


  return responseText; 
}

export function parseTodoResponse(responseText) {
  const lines = responseText.split('\n');
  const result = [];

  let currentPlant = null;
  let currentDate = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // 날짜: - 7월 10일: 또는 - 2024-07-10:
    if (trimmed.startsWith('- ') && (/\- \d{1,2}월 \d{1,2}일:/.test(trimmed) || /\- \d{4}-\d{2}-\d{2}:/.test(trimmed))) {
      if (!currentPlant) continue;

      let isoDate = null;

      if (/\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        // ISO 날짜 추출
        isoDate = trimmed.match(/\d{4}-\d{2}-\d{2}/)[0];
      } else {
        // 한국어 날짜 처리
        const dateStr = trimmed.replace('- ', '').replace(':', '').trim(); // "7월 10일"
        const [_, month, day] = dateStr.match(/(\d{1,2})월\s*(\d{1,2})일/) || [];
        const year = new Date().getFullYear();
        isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }

      const taskObj = { date: isoDate, todos: [] };
      currentPlant.tasks.push(taskObj);
      currentDate = taskObj;

    // 식물명: - 장미:
    } else if (trimmed.startsWith('- ') && trimmed.endsWith(':')) {
      const name = trimmed.slice(2, -1).trim();
      currentPlant = { name, tasks: [] };
      result.push(currentPlant);
      currentDate = null;

    // 할 일: - 오전에 물 주세요.
    } else if (trimmed.startsWith('- ')) {
      if (!currentDate) continue;
      const todo = trimmed.slice(2).trim();
      currentDate.todos.push(todo);
    }
  }

  return result;
}

