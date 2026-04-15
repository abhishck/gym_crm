import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js";
import cors from "cors"

import memberRoutes from "./routes/memberRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
dbConnection();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

// Routes
app.use("/api/members", memberRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Gym CRM API 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});