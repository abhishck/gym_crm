import Payment from "../models/paymentModel.js";
import Member from "../models/memberModel.js";


// 🔹 Add Payment
export const addPayment = async (req, res) => {
  try {
    const { memberId, amount, paymentDate, method } = req.body;

    if (!memberId || !amount) {
      return res.status(400).json({ message: "memberId and amount are required" });
    }

    // Check if member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const payment = new Payment({
      memberId,
      amount,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      method: method || "cash",
    });

    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 Get All Payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("memberId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 Get Payments by Member
export const getPaymentsByMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const payments = await Payment.find({ memberId })
      .sort({ paymentDate: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};