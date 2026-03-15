require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelsToTest = [
  'gemini-2.0-flash',
  'models/gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'models/gemini-2.0-flash-001',
  'gemini-2.5-flash',
  'models/gemini-2.5-flash',
  'gemini-flash-latest',
  'models/gemini-flash-latest',
];

async function testModels() {
  for (const modelName of modelsToTest) {
    try {
      const model  = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('say: online');
      const text   = result.response.text().trim();
      console.log(`✓ WORKS: ${modelName} → ${text}`);
      break; // stop at first working model
    } catch (e) {
      console.log(`✗ FAILS: ${modelName} → ${e.message.slice(0,80)}`);
    }
  }
}

testModels();