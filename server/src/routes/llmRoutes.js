import express from "express";
import { testGeminiController } from "../controllers/llmController.js";

const router = express.Router();

router.get("/test", testGeminiController);

export default router;
