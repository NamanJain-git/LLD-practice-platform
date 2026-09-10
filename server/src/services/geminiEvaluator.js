import { Evaluator } from "./evaluator.js";
import { evaluateWithGemini } from "./llmService.js";

export class GeminiEvaluator extends Evaluator {
    constructor() {
        super();
        this.type = "LLM";
    }

    async evaluate(problem, submission, rubric) {
        return await evaluateWithGemini(
            problem,
            submission,
            rubric
        );
    }
}