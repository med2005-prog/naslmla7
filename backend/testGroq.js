import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "salam" }],
      model: "llama-3.3-70b-versatile",
    });
    console.log(chatCompletion.choices[0].message.content);
  } catch(e) {
    console.error("error:", e);
  }
}
test();
