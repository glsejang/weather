import axios from "axios";
import { GoogleGenAI } from "@google/genai";



export async function askGemini(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const ai = new GoogleGenAI({
    apiKey  // 위에서 가져온 키를 직접 전달
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}









// export async function askGPT(prompt) {

//   const res = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${key}`,  // 여기에 API 키 넣기
//     },
//     body: JSON.stringify({
//       model: "gpt-3.5-turbo",  // 혹은 원하는 모델명
//       messages: [
//         { role: "user", content: prompt }
//       ],
//       max_tokens: 1000,
//       temperature: 0.7,
//     }),
//   });
//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(`OpenAI API Error ${res.status}: ${errorText}`);
//   }

//   const data = await response.json();
//   return data.choices[0].message.content;
// }

