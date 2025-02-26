const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const subjectsConfigs = {
    Mathematics: {
        prompt: "You are an expert mathematics tutor. Answer the following math question concisely but thoroughly. Explain concepts and show steps clearly. If the question involves calculations, show the solution process. but do not use latex",
        model: "gemini-2.0-flash"
    },
    Physics: {
        prompt: "You are an expert physics tutor. Answer the following physics question with clear explanations. Include relevant formulas and explain how to apply them. If calculations are needed, show the steps.",
        model: "gemini-2.0-flash"
    },
    "Computer Science": {
        prompt: "You are an expert computer science tutor. Answer the following question about computer science. If it's about programming, include code examples if appropriate. Explain concepts clearly and provide practical examples.",
        model: "gemini-2.0-flash"
    },
    English: {
        prompt: "You are an expert English language and literature tutor. Answer the following question about English language, literature, writing, or grammar. Provide clear explanations with relevant examples.",
        model: "gemini-2.0-flash"
    }
};

const askQuestion = async (req, res) =>{
    try {
        const { subject, question } = req.body;

        if(!question || !subject){
            return res.status(400).json({ error: "Please provide a question and subject" });
        }

        const config = subjectsConfigs[subject];
        if(!config){
            return res.status(400).json({ error: "Invalid subject" });
        }

        const model = genAI.getGenerativeModel({model: config.model});
        const fullPrompt = `${config.prompt}\nQuestion: ${question}`;
        const result = await model.generateContent(fullPrompt);
        const text = await result.response.text();

        res.status(200).json({ answer: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

module.exports = {
    askQuestion
};