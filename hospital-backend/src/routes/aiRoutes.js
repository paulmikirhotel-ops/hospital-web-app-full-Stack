const express = require('express');
const router  = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { optionalToken } = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ CONFIRMED WORKING MODEL
const MODEL = 'gemini-2.5-flash';

/* ── RATE LIMIT ── */
const rateLimitMap = new Map();

const rateLimit = (req, res, next) => {
  const key      = req.user?.id || req.ip;
  const now      = Date.now();
  const windowMs = 60 * 1000;
  const maxReqs  = 10;

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    return next();
  }
  const entry = rateLimitMap.get(key);
  if (now - entry.startTime > windowMs) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    return next();
  }
  if (entry.count >= maxReqs) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment.',
    });
  }
  entry.count++;
  next();
};

/* ─────────────────────────────────────────────
   POST /api/ai/triage
───────────────────────────────────────────── */
router.post('/triage', optionalToken, rateLimit, async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ success: false, message: 'Symptoms field is required.' });
    }

    const cleaned = symptoms.trim();

    if (cleaned.length < 10) {
      return res.status(400).json({ success: false, message: 'Please describe your symptoms in more detail (at least 10 characters).' });
    }
    if (cleaned.length > 1000) {
      return res.status(400).json({ success: false, message: 'Symptom description too long. Keep it under 1000 characters.' });
    }

    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        temperature:      0.2,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
      You are a professional hospital triage nurse at St. Joseph's Catholic Hospital, Monrovia, Liberia.
      A patient has described their symptoms. Analyze them carefully and respond ONLY with a JSON object.

      Patient Symptoms: "${cleaned}"

      Respond with this exact JSON structure:
      {
        "urgency": "Emergency",
        "department": "The most appropriate hospital department",
        "advice": "2 sentences max. What the patient should do right now.",
        "redFlags": ["warning sign 1", "warning sign 2", "warning sign 3"],
        "disclaimer": "Remind the patient this is not a medical diagnosis and they must see a real doctor."
      }

      The urgency field must be exactly one of these three values:
      - "Emergency" — life-threatening symptoms (chest pain, difficulty breathing, stroke signs, severe bleeding, loss of consciousness, high fever above 39C, seizures)
      - "Urgent" — needs attention within 24 hours (moderate fever, moderate pain, infection signs, persistent vomiting, worsening symptoms)
      - "Routine" — non-urgent, can wait for a scheduled appointment

      The department field should be one of:
      Emergency, General Practice, Cardiology, Neurology, Pediatrics, Orthopedics,
      Gynecology, Dermatology, Psychiatry, Oncology, Radiology, Surgery, ENT,
      Internal Medicine, Maternity

      Return ONLY valid JSON. No markdown, no code blocks, no extra text.
    `;

    const result    = await model.generateContent(prompt);
    const text      = result.response.text();
    const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    let triageResult;
    try {
      triageResult = JSON.parse(cleanJson);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try { triageResult = JSON.parse(jsonMatch[0]); }
        catch { return res.status(500).json({ success: false, message: 'AI returned an unexpected response. Please try again.' }); }
      } else {
        return res.status(500).json({ success: false, message: 'AI returned an unexpected response. Please try again.' });
      }
    }

    const required = ['urgency', 'department', 'advice', 'disclaimer'];
    const missing  = required.filter(f => !triageResult[f]);
    if (missing.length > 0) {
      return res.status(500).json({ success: false, message: 'Incomplete AI response. Please try again.' });
    }

    const validUrgencies = ['Emergency', 'Urgent', 'Routine'];
    if (!validUrgencies.includes(triageResult.urgency)) {
      triageResult.urgency = 'Routine';
    }

    res.json({
      success: true,
      triage: {
        urgency:    triageResult.urgency,
        department: triageResult.department,
        advice:     triageResult.advice,
        redFlags:   Array.isArray(triageResult.redFlags) ? triageResult.redFlags : [],
        disclaimer: triageResult.disclaimer,
      },
    });

  } catch (error) {
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return res.status(500).json({ success: false, message: 'AI service configuration error. Contact support.' });
    }
    if (error.message?.includes('SAFETY') || error.message?.includes('safety')) {
      return res.status(400).json({ success: false, message: 'Input flagged by safety filter. Please rephrase.' });
    }
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({ success: false, message: 'AI service is busy. Please try again in a moment.' });
    }
    console.error('Gemini triage error:', error.message);
    res.status(500).json({ success: false, message: 'Triage AI is currently offline. Please visit the hospital directly.' });
  }
});

/* ─────────────────────────────────────────────
   POST /api/ai/chat
───────────────────────────────────────────── */
router.post('/chat', optionalToken, rateLimit, async (req, res) => {
  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
    });

    const systemPrompt = system ||
      `You are a helpful medical information assistant at Saint Joseph's Catholic Hospital
       in Monrovia, Liberia. Be warm and concise (under 100 words per reply).
       Never diagnose or prescribe medications.
       Always recommend seeing a real doctor for personal medical advice.`;

    const rawHistory  = messages.slice(0, -1);
    const lastMessage = messages[messages.length - 1];

    const history  = [];
    let   lastRole = null;

    for (const m of rawHistory) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      if (role === lastRole) continue;
      history.push({ role, parts: [{ text: m.content }] });
      lastRole = role;
    }

    const chatHistory = history.length > 0 && history[0].role === 'user' ? history : [];

    const chat = model.startChat({
      history:           chatHistory,
      systemInstruction: systemPrompt,
    });

    const messageToSend = chatHistory.length === 0
      ? `${systemPrompt}\n\nUser question: ${lastMessage.content}`
      : lastMessage.content;

    const result = await chat.sendMessage(messageToSend);
    const reply  = result.response.text();

    res.json({ success: true, reply });

  } catch (error) {
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return res.status(500).json({ success: false, message: 'AI configuration error.' });
    }
    if (error.message?.includes('SAFETY') || error.message?.includes('safety')) {
      return res.status(400).json({ success: false, message: 'Message flagged by safety filter.' });
    }
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return res.status(429).json({ success: false, message: 'AI is busy. Please try again.' });
    }
    console.error('Gemini chat error:', error.message);
    res.status(500).json({ success: false, message: 'AI assistant is temporarily offline.' });
  }
});

/* ─────────────────────────────────────────────
   GET /api/ai/test
───────────────────────────────────────────── */
router.get('/test', async (req, res) => {
  try {
    const model  = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent('Reply with only the single word: online');
    const text   = result.response.text().trim().toLowerCase();

    res.json({
      success: true,
      status:  text.includes('online') ? 'Gemini AI is online ✓' : `Unexpected: ${text}`,
      model:   MODEL,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status:  'Gemini AI is offline',
      error:   error.message,
      model:   MODEL,
    });
  }
});

module.exports = router;