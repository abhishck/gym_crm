import Attendance from "../models/attandanceModel.js";
import Member from "../models/memberModel.js";


// 🔹 Helper: Get start of today (important)
const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};



// 🔹 Mark Attendance
export const markAttendance = async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    // Check if member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const today = getTodayDate();

    // Check if already marked
    const existing = await Attendance.findOne({
      memberId,
      date: today,
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for today",
      });
    }

    const attendance = new Attendance({
      memberId,
      date: today,
    });

    const savedAttendance = await attendance.save();

    res.status(201).json(savedAttendance);
  } catch (error) {
    // Handle duplicate index error (extra safety)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already marked for today",
      });
    }

    res.status(500).json({ message: error.message });
  }
};



// 🔹 Get Today's Attendance
export const getTodayAttendance = async (req, res) => {
  try {
    const today = getTodayDate();

    const attendance = await Attendance.find({ date: today })
      .populate("memberId", "name phone");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔹 Get Attendance by Member
export const getAttendanceByMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const attendance = await Attendance.find({ memberId })
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};