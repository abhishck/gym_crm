import { sendSMS } from "../services/smsService.js";
import Member from "../models/Member.js"; // if needed

export const sendSMSController = async (req, res) => {
  try {
    const { memberId, phone, message } = req.body;

    let number = phone;

    // optional: fetch number from DB
    if (memberId) {
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      number = member.phone;
    }

    if (!number || !message) {
      return res.status(400).json({ message: "Phone and message required" });
    }

    const result = await sendSMS(number, message);

    res.status(200).json({
      success: true,
      message: "SMS sent successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "SMS sending failed",
    });
  }
};