import express from "express";

import {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getExpiredMembers,
} from "../controllers/memberController.js";

const router = express.Router();

// Create new member
router.post("/", createMember);

// Get all members
router.get("/", getAllMembers);

// Get expired members
router.get("/expired", getExpiredMembers);

// Get single member
router.get("/:id", getMemberById);

// Update member
router.put("/:id", updateMember);

// Delete member
router.delete("/:id", deleteMember);

export default router;