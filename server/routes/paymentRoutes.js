import express from "express";
import { deletePayment, getPaymentById, getRevenueStats } from "../controllers/paymentController.js";



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

router.delete("/:id", deletePayment);

// get single payment for viewing
router.get("/single/:id", getPaymentById);

export default router;