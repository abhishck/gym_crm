import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// Dashboard API
router.get("/", getDashboardStats);

export default router;