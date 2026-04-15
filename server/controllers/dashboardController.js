import Member from "../models/memberModel.js";
import Payment from "../models/paymentModel.js";
import Attendance from "../models/attandanceModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // 🔹 Dates
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next5Days = new Date();
    next5Days.setDate(today.getDate() + 5);

    // 🔹 Member Stats
    const totalMembers = await Member.countDocuments();

    const activeMembers = await Member.countDocuments({
      expiryDate: { $gte: today },
    });

    const expiredMembers = await Member.countDocuments({
      expiryDate: { $lt: today },
    });

    // 🔹 Attendance Today
    const todayAttendance = await Attendance.countDocuments({
      date: today,
    });

    // 🔹 Monthly Revenue
    const monthlyRevenueAgg = await Payment.aggregate([
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

    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

    // 🔹 Yearly Revenue
    const yearlyRevenueAgg = await Payment.aggregate([
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

    const yearlyRevenue = yearlyRevenueAgg[0]?.total || 0;

    // 🔹 Expiring Soon Members
    const expiringSoon = await Member.find({
      expiryDate: { $gte: today, $lte: next5Days },
    }).select("name phone expiryDate");

    res.status(200).json({
      totalMembers,
      activeMembers,
      expiredMembers,
      todayAttendance,
      monthlyRevenue,
      yearlyRevenue,
      expiringSoon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};