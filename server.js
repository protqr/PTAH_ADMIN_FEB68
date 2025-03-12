import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
app.use(express.json());
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import admin from "firebase-admin";

// routers
import PatientRouter from './routes/PatientRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import PostureRouter from './routes/PostureRouter.js';
import DoctorRouter from './routes/DoctorRouter.js';
import PostRouter from "./routes/PostRouter.js";
import FileRouter from "./routes/FileRouter.js";
import NotificationRouter from "./routes/NotificationRouter.js";
import missionRoutes from "./routes/MissionRouter.js";

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

// controller
import { checkNotifications } from './controllers/NotificationController.js';

// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(path.resolve(__dirname, './public')));

// cloudinary
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Firebase
admin.initializeApp({
  credential: admin.credential.cert("./firebase-service-account.json"),
});

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use('/api/v1/allusers', authenticateUser, PatientRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/postures', authenticateUser, PostureRouter);
app.use('/api/v1/MPersonnel', authenticateUser, DoctorRouter);
app.use("/api/v1/posts", authenticateUser, PostRouter);
app.use("/api/v1/files", authenticateUser, FileRouter);
app.use("/api/v1/notifications", authenticateUser, NotificationRouter);
app.use("/api/v1/missions", missionRoutes);

// ไม่พบข้อมูล
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Not Found' });
});

// error
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });

  // Schedule the cron job to run every minute
  cron.schedule("* * * * *", () => {
    checkNotifications(); 
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
