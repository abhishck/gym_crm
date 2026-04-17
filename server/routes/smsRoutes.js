import express from "express";
import { sendSMSController } from "../controllers/smsController.js";

const router = express.Router();

router.post("/send", sendSMSController);

export default router;