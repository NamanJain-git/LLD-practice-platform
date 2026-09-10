import express from "express";
import { evaluateAttemptController } from "../controllers/evaluationController.js";

const router = express.Router();

router.post("/:id/evaluate", evaluateAttemptController);

export default router;