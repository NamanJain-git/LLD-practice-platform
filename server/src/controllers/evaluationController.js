import { evaluateAttempt } from "../services/evaluationService.js";
import { GeminiEvaluator } from "../services/geminiEvaluator.js";

export const evaluateAttemptController = async (req, res) => {
    try {
        const { id: attemptId } = req.params;

        const evaluator = new GeminiEvaluator();

        const evaluation = await evaluateAttempt(
            attemptId,
            evaluator
        );

        res.status(200).json({
            message: "Evaluation completed successfully",
            evaluation
        });
    } catch (error) {
        console.error(
            "Error evaluating attempt:",
            error.message
        );

        res.status(500).json({
            message:
                error.message || "Evaluation failed"
        });
    }
};