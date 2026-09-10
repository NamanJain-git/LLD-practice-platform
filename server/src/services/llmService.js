import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const testGemini = async () => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: "Explain what a class is in object-oriented programming in one sentence."
        });

        return response.text;

    } catch (error) {
        console.error("Gemini API error:", error.message);
        throw error;
    }
};

export const evaluateWithGemini = async (problem, submission, rubric) => {
    try {
        const rubricText = rubric
            .map(
                (criterion, index) =>
                    `${index + 1}. ${criterion.name}: ${criterion.description}`
            )
            .join("\n");

        const prompt = `
You are an experienced software engineer conducting an LLD design review.

Your task is to evaluate a learner's Low-Level Design solution.

IMPORTANT EVALUATION RULES:

1. There can be multiple valid LLD solutions.
2. Do NOT compare the learner's solution against one canonical implementation.
3. Evaluate the design based on the problem requirements and sound software engineering principles.
4. Give evidence from the learner's actual submission.
5. Do not invent classes, relationships, requirements, or decisions that the learner did not provide.
6. Be constructive and specific.
7. Scores must be integers from 1 to 5.
8. A score of 3 means acceptable/basic.
9. A score of 4 means strong.
10. A score of 5 means excellent.
11. A score of 1 or 2 should be used when there are meaningful weaknesses.
12. If information is missing, mention that as a concern instead of assuming it exists.
13. Evaluate the learner's reasoning, not just whether they mentioned design patterns.

LLD PROBLEM:

Title:
${problem.title}

Description:
${problem.description}

Requirements:
${problem.requirements.map((r) => `- ${r}`).join("\n")}

Constraints:
${problem.constraints?.length
                ? problem.constraints.map((c) => `- ${c}`).join("\n")
                : "None specified"
            }

EVALUATION RUBRIC:

${rubricText}

LEARNER SUBMISSION:

Approach:
${submission.approach || "Not provided"}

Classes:
${submission.classes || "Not provided"}

Relationships:
${submission.relationships || "Not provided"}

Abstractions:
${submission.abstractions || "Not provided"}

Patterns:
${submission.patterns || "Not provided"}

Assumptions:
${submission.assumptions || "Not provided"}

Edge Cases:
${submission.edgeCases || "Not provided"}

For every rubric criterion, provide:

- name
- score from 1 to 5
- evidence based on the learner's submission
- concern
- suggestion
- confidence: low, medium, or high

Also provide:

- overallFeedback
- strengths: array of strings
- improvements: array of strings

Return ONLY valid JSON.

Do not use markdown.
Do not wrap the JSON in code fences.

The JSON must follow this exact structure:

{
  "criteria": [
    {
      "name": "Criterion name",
      "score": 1,
      "evidence": "Evidence from submission",
      "concern": "Specific concern",
      "suggestion": "Specific improvement suggestion",
      "confidence": "low"
    }
  ],
  "overallFeedback": "Overall evaluation",
  "strengths": [
    "Strength 1"
  ],
  "improvements": [
    "Improvement 1"
  ]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const result = JSON.parse(response.text);

        return result;
    } catch (error) {
        console.error(
            "Gemini evaluation error:",
            error.message
        );

        throw error;
    }
};