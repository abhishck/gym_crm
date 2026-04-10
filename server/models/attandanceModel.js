import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    status: {
      type: String,
    enum: ["present", "absent"],
      default: "present",
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Prevent duplicate attendance (one per day per member)
attendanceSchema.index(
  { memberId: 1, date: 1 },
  { unique: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;