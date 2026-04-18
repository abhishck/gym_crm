import { sendSMS } from "../services/smsService.js";
import Member from "../models/memberModel.js";

export const sendSMSController = async (req, res) => {
  try {
    console.log("📥 Body:", req.body);

    const { memberId, phone, message } = req.body;

    let number = phone;

    if (memberId) {
      const member = await Member.findById(memberId);

      console.log("👤 Member:", member);

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      // 🔥 try all possible fields safely
      number =
        member.phone ||
        member.mobile ||
        member.phoneNumber ||
        member.contact;

      console.log("📞 Extracted Number:", number);
    }

    if (!number) {
      return res.status(400).json({
        message: "Phone number not found in member",
      });
    }

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const result = await sendSMS(number, message);

    console.log("✅ SMS Result:", result);

    res.status(200).json({
      success: true,
      message: "SMS sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("🔥 Controller Error:", error);

    res.status(500).json({
      message: error.message || "SMS sending failed",
    });
  }
};