import express from "express";

import { evaluateAttemptController} from "../controllers/evaluationController.js";

import {
    createAttempt,
    getAttempts,
    getAttemptById,
    saveDraftSubmission,
    submitAttempt
} from "../controllers/attemptController.js";

const router = express.Router();

router.post("/", createAttempt);
router.get("/", getAttempts);
router.get("/:id", getAttemptById);
router.put("/:id", saveDraftSubmission);
router.post("/:id/submit", submitAttempt);
router.post("/:id/evaluate", evaluateAttemptController);

export default router;
