const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { verifyToken } = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @route   POST /api/ai/triage
 * @desc    Analyze symptoms and suggest hospital department
 * @access  Protected (Requires Login)
 */
router.post('/triage', verifyToken, async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || symptoms.length < 10) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a more detailed description of your symptoms." 
            });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // 🚀 Force the model to only output JSON
            generationConfig: { responseMimeType: "application/json" } 
        });

        const prompt = `
            Act as a professional Triage Nurse. 
            Patient Symptoms: "${symptoms}".
            
            Return a JSON object with:
            {
              "urgency": "Emergency" | "Urgent" | "Routine",
              "department": "string",
              "advice": "string (max 2 sentences)",
              "disclaimer": "string"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // 🛡️ Safety: Wrap in try-catch to prevent crashing on malformed AI output
        try {
            const triageResult = JSON.parse(text);
            res.json({ success: true, triage: triageResult });
        } catch (parseError) {
            console.error("AI JSON Parsing Error:", text);
            res.status(500).json({ success: false, message: "Error processing AI diagnosis." });
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ success: false, message: "Triage AI is currently offline." });
    }
});

module.exports = router;