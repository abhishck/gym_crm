import express from "express";
import { getRevenueStats } from "../controllers/paymentController.js";



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

// Add this ABOVE "/:memberId"
router.get("/revenue", getRevenueStats);

// Get payments for a specific member
router.get("/:memberId", getPaymentsByMember);

export default router;