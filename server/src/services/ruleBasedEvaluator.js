import { Evaluator } from "./evaluator.js";

export class RuleBasedEvaluator extends Evaluator {
    constructor() {
        super();
        this.type = "RULE_BASED";
    }

    async evaluate(problem, submission, rubric) {

        const criteria = rubric.map((criterion) => {

            let score = 1;
            let evidence = "";
            let concern = "";
            let suggestion = "";

            if (criterion.name === "Requirement Understanding") {
                score = submission.approach?.trim() ? 3 : 1;

                evidence = submission.approach?.trim()
                    ? "The learner provided an approach."
                    : "No approach was provided.";

                concern = score < 3
                    ? "The design approach is missing."
                    : "The approach may need more detail.";

                suggestion =
                    "Explain how the proposed design addresses the important requirements.";
            }

            else if (criterion.name === "Class Responsibilities") {
                score = submission.classes?.trim() ? 3 : 1;

                evidence = submission.classes?.trim()
                    ? "The learner identified classes."
                    : "No classes were provided.";

                concern =
                    "Responsibilities should be reviewed for cohesion and separation.";

                suggestion =
                    "Explain the responsibility of each important class.";
            }

            else if (criterion.name === "Coupling & Cohesion") {
                score = submission.relationships?.trim() ? 3 : 1;

                evidence = submission.relationships?.trim()
                    ? "The learner described relationships."
                    : "No relationships were provided.";

                concern =
                    "The relationships need deeper design justification.";

                suggestion =
                    "Explain why the classes depend on each other and avoid unnecessary coupling.";
            }

            else {
                score = 3;

                evidence =
                    "This criterion requires deeper design analysis.";

                concern =
                    "Rule-based evaluation cannot fully assess this criterion.";

                suggestion =
                    "Provide a clearer explanation of the design decision.";
            }

            return {
                name: criterion.name,
                score,
                evidence,
                concern,
                suggestion,
                confidence: "low"
            };
        });

        return {
            criteria,
            overallFeedback:
                "This is a preliminary rule-based evaluation. A deeper design review is recommended.",
            strengths: [
                "The learner provided a structured solution."
            ],
            improvements: [
                "Provide more reasoning behind design decisions.",
                "Explain trade-offs and extensibility."
            ]
        };
    }
}