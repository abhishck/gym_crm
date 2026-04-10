import express from "express";

import {
  addPayment,
  getPaymentsByMember,
  getAllPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

// Add payment
router.post("/", addPayment);

// Get all payments
router.get("/", getAllPayments);

// Get payments for a specific member
router.get("/:memberId", getPaymentsByMember);

export default router;