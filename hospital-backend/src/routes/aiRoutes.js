const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { verifyToken } = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ── SIMPLE IN-MEMORY RATE LIMIT ─────────────────────────────────
   Prevents a single user from spamming the AI endpoint.
   Allows max 5 requests per minute per user.
──────────────────────────────────────────────────────────────── */
const rateLimitMap = new Map();

const rateLimit = (req, res, next) => {
  const userId = req.user.id;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  if (!rateLimitMap.has(userId)) {
    rateLimitMap.set(userId, { count: 1, startTime: now });
    return next();
  }

  const userData = rateLimitMap.get(userId);

  // Reset window if time has passed
  if (now - userData.startTime > windowMs) {
    rateLimitMap.set(userId, { count: 1, startTime: now });
    return next();
  }

  // Block if over limit
  if (userData.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment before trying again.',
    });
  }

  userData.count++;
  next();
};


/**
 * POST /api/ai/triage
 * Analyze symptoms and suggest the correct hospital department
 */
router.post('/triage', verifyToken, rateLimit, async (req, res) => {
  try {
    const { symptoms } = req.body;

    // 1. Validate input
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Symptoms field is required.',
      });
    }

    const cleaned = symptoms.trim();

    if (cleaned.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please describe your symptoms in more detail (at least 10 characters).',
      });
    }

    if (cleaned.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Symptom description is too long. Please keep it under 1000 characters.',
      });
    }

    // 2. Build the AI model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temp = more consistent, less random responses
      },
    });

    // 3. Build a strict, detailed prompt
    const prompt = `
      You are a professional hospital triage nurse at St. Joseph's Catholic Hospital, Monrovia, Liberia.
      A patient has described their symptoms. Analyze them and respond ONLY with a JSON object.

      Patient Symptoms: "${cleaned}"

      Respond with this exact JSON structure:
      {
        "urgency": "Emergency" | "Urgent" | "Routine",
        "department": "The most appropriate hospital department (e.g. Cardiology, Emergency, General Practice, Pediatrics, Orthopedics, Neurology, Obstetrics, ENT, Dermatology)",
        "advice": "2 sentences max. What the patient should do right now.",
        "redFlags": ["list", "of", "warning signs to watch for"],
        "disclaimer": "Remind the patient this is not a medical diagnosis and they must see a real doctor."
      }

      Urgency rules:
      - "Emergency": life-threatening symptoms (chest pain, difficulty breathing, stroke signs, severe bleeding, loss of consciousness)
      - "Urgent": needs attention within 24 hours (high fever, moderate pain, infection signs)
      - "Routine": non-urgent, can wait for a scheduled appointment

      Return only valid JSON. No extra text, no markdown, no code blocks.
    `;

    // 4. Call Gemini
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 5. Parse AI response safely
    let triageResult;
    try {
      // Strip any accidental markdown code fences just in case
      const cleanJson = text.replace(/```json|```/g, '').trim();
      triageResult = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('AI JSON parse failed. Raw output:', text);
      return res.status(500).json({
        success: false,
        message: 'The AI returned an unexpected response. Please try again.',
      });
    }

    // 6. Validate the AI actually returned the expected fields
    const requiredFields = ['urgency', 'department', 'advice', 'disclaimer'];
    const missingFields = requiredFields.filter(f => !triageResult[f]);

    if (missingFields.length > 0) {
      console.error('AI response missing fields:', missingFields, triageResult);
      return res.status(500).json({
        success: false,
        message: 'Incomplete AI response. Please try again.',
      });
    }

    // 7. Return to frontend
    res.json({
      success: true,
      triage: {
        urgency:    triageResult.urgency,
        department: triageResult.department,
        advice:     triageResult.advice,
        redFlags:   triageResult.redFlags || [],
        disclaimer: triageResult.disclaimer,
      },
    });

  } catch (error) {
    // Handle Gemini API-specific errors
    if (error.message?.includes('API_KEY')) {
      console.error('Gemini API Key error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error. Contact support.',
      });
    }

    if (error.message?.includes('SAFETY')) {
      return res.status(400).json({
        success: false,
        message: 'Your input was flagged by our safety filter. Please rephrase your symptoms.',
      });
    }

    console.error('Gemini API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Triage AI is currently offline. Please visit the hospital directly.',
    });
  }
});


/**
 * GET /api/ai/triage/test
 * Quick sanity check — confirms the AI is online
 * Remove this route in production
 */
router.get('/test', verifyToken, async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Reply with only the word: online');
    const text = result.response.text().trim().toLowerCase();

    res.json({
      success: true,
      status: text.includes('online') ? 'Gemini AI is online ✓' : 'Unexpected response: ' + text,
    });
  } catch (error) {
    res.status(500).json({ success: false, status: 'Gemini AI is offline', error: error.message });
  }
});


module.exports = router;