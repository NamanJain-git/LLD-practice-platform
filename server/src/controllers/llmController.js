import { testGemini } from "../services/llmService.js";

export const testGeminiController = async (req, res) => {
    try {
        const result = await testGemini();

        res.status(200).json({
            message: "Gemini API is working",
            result
        });

    } catch (error) {
        console.error("Gemini test failed:", error.message);

        res.status(500).json({
            message: "Gemini API test failed",
            error: error.message
        });
    }
};
