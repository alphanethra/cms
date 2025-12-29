import express from "express";
import { chatbotReply } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/chat", chatbotReply);

export default router;