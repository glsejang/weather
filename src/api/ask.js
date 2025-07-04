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

    // 1. 날짜 먼저 체크
    if (trimmed.startsWith('- ') && trimmed.match(/^\- \d{1,2}월 \d{1,2}일:/)) {
      if (!currentPlant) continue;
      const date = trimmed.replace('- ', '').replace(':', '').trim();
      const taskObj = { date, todos: [] };
      currentPlant.tasks.push(taskObj);
      currentDate = taskObj;
    
    // 2. 식물 이름
    } else if (trimmed.startsWith('- ') && trimmed.endsWith(':')) {
      const name = trimmed.replace('- ', '').replace(':', '').trim();
      currentPlant = { name, tasks: [] };
      result.push(currentPlant);
      currentDate = null;

    // 3. 실제 할 일
    } else if (trimmed.startsWith('-')) {
      if (!currentDate) continue;
      const todo = trimmed.replace('- ', '').trim();
      currentDate.todos.push(todo);
    }
  }

  return result;
}

