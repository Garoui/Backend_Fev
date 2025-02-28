const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialisation de l'API Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyAtlCEwZG0pi6vywhLhGnG5Qwit23UwooA");

// Route pour générer du texte avec Gemini
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });//gemini-1.5-pro

    const result = await model.generateContent(prompt);
    const response = result.response.text(); // Récupérer le texte généré

    res.json({ generatedText: response });

  } catch (error) {
    console.error("Erreur API Gemini :", error);
    res.status(500).json({ error: "Erreur lors de la génération du contenu." });
  }
});

module.exports = router;