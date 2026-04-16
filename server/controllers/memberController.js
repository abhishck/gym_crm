import Member from "../models/memberModel.js";

// 🔹 Create Member
export const createMember = async (req, res) => {
  try {
    console.log(req.body);
    const { name, phone, joinDate, planDuration } = req.body;

    console.log("Incoming data:", req.body); // 🔥 DEBUG

    // Validate
    if (!name || !phone || !planDuration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert planDuration to number ✅
    const duration = Number(planDuration);

    if (isNaN(duration)) {
      return res.status(400).json({ message: "Invalid plan duration" });
    }

    // Handle join date safely
    const startDate = joinDate ? new Date(joinDate) : new Date();

    if (isNaN(startDate)) {
      return res.status(400).json({ message: "Invalid join date" });
    }

    // Calculate expiry
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + duration);

    const status = expiryDate > new Date() ? "active" : "expired";

    const member = new Member({
      name,
      phone,
      joinDate: startDate,
      planDuration: duration,
      expiryDate,
      status,
    });

    const savedMember = await member.save();

    res.status(201).json(savedMember);
  } catch (error) {
    console.error("ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Members
export const getAllMembers = async (req, res) => {
  try {
   const members = await Member.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Single Member
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Member
export const updateMember = async (req, res) => {
  try {
    const { name, phone, joinDate, planDuration } = req.body;

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update fields if provided
    if (name) member.name = name;
    if (phone) member.phone = phone;
    if (joinDate) member.joinDate = new Date(joinDate);

    // If planDuration changes → recalculate expiry
    if (planDuration) {
      member.planDuration = planDuration;

      const newExpiry = new Date(member.joinDate);
      newExpiry.setDate(newExpiry.getDate() + planDuration);

      member.expiryDate = newExpiry;
    }

    const updatedMember = await member.save();

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Member
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // ✅ Soft delete instead of removing
    member.isDeleted = true;
    await member.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Expired Members
export const getExpiredMembers = async (req, res) => {
  try {
    const today = new Date();

    const expiredMembers = await Member.find({
      expiryDate: { $lt: today },
    });

    res.status(200).json(expiredMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
