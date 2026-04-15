import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    joinDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    planDuration: {
      type: Number, // in days (e.g., 30, 90, 180)
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Auto-update status before saving


const Member = mongoose.model("Member", memberSchema);

export default Member;