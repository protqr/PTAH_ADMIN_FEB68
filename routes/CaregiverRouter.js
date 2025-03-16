import express from "express";
import {
  getAllCaregivers,
  getCaregiverById,
  createCaregiver,
  updateCaregiver,
  deleteCaregiver
} from "../controllers/CaregiverController.js";

const router = express.Router();

// เส้นทางสำหรับการดึงข้อมูลผู้ดูแลทั้งหมดและการสร้างข้อมูลใหม่
router.route("/")
  .get(getAllCaregivers)
  .post(createCaregiver);

// เส้นทางสำหรับการดึง, อัปเดต และลบข้อมูลผู้ดูแลตาม id
router.route("/:id")
  .get(getCaregiverById)
  .patch(updateCaregiver)
  .delete(deleteCaregiver);

export default router;
