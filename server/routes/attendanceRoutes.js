import express from "express";

import {
  markAttendance,
  getAttendanceByMember,
  getTodayAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Mark attendance
router.post("/", markAttendance);

// Get today's attendance
router.get("/today", getTodayAttendance);

// Get attendance for a specific member
router.get("/:memberId", getAttendanceByMember);

export default router;