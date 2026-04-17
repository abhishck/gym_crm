import Payment from "../models/paymentModel.js";
import Member from "../models/memberModel.js";


// 🔹 Add Payment

export const addPayment = async (req, res) => {
  try {
    const { memberId, amount, method } = req.body;

    if (!memberId || !amount || !method) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 💾 Save payment
    const payment = new Payment({
      memberId,
      amount,
      method,
      paymentDate: new Date(),
    });

    await payment.save();

    // 🔥 MEMBERSHIP LOGIC (FIXED)

    const today = new Date();

    // Normalize dates (remove time)
    const todayOnly = new Date(today.setHours(0, 0, 0, 0));
    const expiry = member.expiryDate
      ? new Date(member.expiryDate)
      : null;

    const expiryOnly = expiry
      ? new Date(expiry.setHours(0, 0, 0, 0))
      : null;

    let startDate;

    if (expiryOnly && expiryOnly >= todayOnly) {
      // ✅ Active → extend
      startDate = new Date(expiryOnly);
    } else {
      // ✅ Expired → start fresh
      startDate = new Date(todayOnly);
    }

    // 🔥 Use member planDuration (fallback 30)
    const duration = member.planDuration || 30;

    const newExpiry = new Date(startDate);
    newExpiry.setDate(newExpiry.getDate() + duration);

    // ✅ Update member
    member.expiryDate = newExpiry;
    member.status = "active";

    await member.save();

    res.status(201).json({
      message: "Payment added & membership updated",
      payment,
      member,
    });

  } catch (error) {
    console.error("ADD PAYMENT ERROR:", error);
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

// 🔹 Delete Payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Payment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({
      message: "Payment deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

    const payment = await Payment.findById(id).populate("memberId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json(payment);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 🔹 Get Revenue Stats (Monthly + Yearly)
export const getRevenueStats = async (req, res) => {
  try {
    const now = new Date();

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Start of year
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 🔸 Monthly Revenue
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // 🔸 Yearly Revenue
    const yearlyRevenue = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      yearlyRevenue: yearlyRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};