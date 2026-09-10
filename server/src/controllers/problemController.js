import Problem from "../models/Problem.js";

export const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find().sort({ createdAt: -1 });

        res.status(200).json(problems);
    } catch (error) {
        console.error("Error fetching problems:", error.message);

        res.status(500).json({
            message: "Failed to fetch problems"
        });
    }
};

export const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        res.status(200).json(problem);
    } catch (error) {
        console.error("Error fetching problem:", error.message);

        res.status(500).json({
            message: "Failed to fetch problem"
        });
    }
};