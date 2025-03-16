import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import admin from "firebase-admin";
import morgan from "morgan";

// Routers
import PatientRouter from "./routes/PatientRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import PostureRouter from "./routes/PostureRouter.js";
import DoctorRouter from "./routes/DoctorRouter.js";
import PostRouter from "./routes/PostRouter.js";
import FileRouter from "./routes/FileRouter.js";
import NotificationRouter from "./routes/NotificationRouter.js";
import missionRoutes from "./routes/MissionRouter.js";
import CaregiverRouter from "./routes/CaregiverRouter.js";


// Middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

// Controller
import { checkNotifications } from "./controllers/NotificationController.js";

// สร้าง Express App
const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ เปิด CORS ให้เชื่อมต่อจาก Frontend
app.use(cors({
  origin: '*', 
  methods: ["GET", "POST"]
}));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ สร้าง HTTP Server
const server = http.createServer(app);

// ✅ กำหนดค่า Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ["GET", "POST"]
  }
});

// ✅ ตรวจสอบว่า Client เชื่อมต่อหรือไม่
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("comment", (comments) => {
    console.log("📩 Received comments:", comments);
    io.emit("new-comment", comments);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Firebase
admin.initializeApp({
  credential: admin.credential.cert("./firebase-service-account.json"),
});

// API Routes
app.get("/", (req, res) => res.send("Hello World"));
app.get("/api/v1/test", (req, res) => res.json({ msg: "test route" }));

app.use("/api/v1/allusers", authenticateUser, PatientRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/postures", authenticateUser, PostureRouter);
app.use("/api/v1/MPersonnel", authenticateUser, DoctorRouter);
app.use("/api/v1/posts", authenticateUser, PostRouter);
app.use("/api/v1/files", authenticateUser, FileRouter);
app.use("/api/v1/notifications", authenticateUser, NotificationRouter);
app.use("/api/v1/missions", authenticateUser, missionRoutes);
app.use("/api/v1/caregiver",authenticateUser, CaregiverRouter);

// ไม่พบข้อมูล
app.use("*", (req, res) => res.status(404).json({ msg: "Not Found" }));

// Middleware สำหรับ Error Handling
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

// ✅ ใช้ `server.listen()` แทน `app.listen()`
try {
  await mongoose.connect(process.env.MONGO_URL);
  server.listen(port, () => {
    console.log(`🚀 Server running on PORT ${port}`);
  });

  cron.schedule("* * * * *", () => {
    console.log("✅ Checking notifications...");
  });

} catch (error) {
  console.error("🔥 Error starting server:", error);
  process.exit(1);
}
