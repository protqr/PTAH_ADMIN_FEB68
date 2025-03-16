import mongoose from "mongoose";
import { RELATIONS, HAVECAREGIVER } from "../utils/constants.js";

const CaregiverSchema = new mongoose.Schema(
  {
    // อ้างอิงไอดีของผู้ใช้งาน (User) ที่เป็นข้อมูลผู้ดูแล
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // อ้างอิงไอดีของคนไข้ (Patient) ที่มีผู้ดูแลนี้
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    // กำหนดสถานะว่ามีผู้ดูแลหรือไม่ (อาจใช้ enum ที่คุณมีอยู่แล้ว)
    youhaveCaregiver: {
      type: String,
      enum: Object.values(HAVECAREGIVER),
      default: null,
    },
    // ข้อมูลความสัมพันธ์ของผู้ดูแลกับคนไข้
    caregiverRelations: {
      type: String,
      enum: Object.values(RELATIONS),
      required: true,
    },
    // กรณีเลือก "อื่นๆ" ให้กรอกข้อมูลเพิ่มเติม
    otherRelations: {
      type: String,
      required: function () {
        return this.caregiverRelations === RELATIONS.OTHER;
      },
    },
    // หากต้องการเก็บข้อมูลเพิ่มเติม เช่น ชื่อ เบอร์โทรของผู้ดูแล
    name: String,
    lastname: String,
    tel: String,
  },
  {
    collection: "Caregiver",
    timestamps: true,
  }
);

export default mongoose.model("Caregiver", CaregiverSchema);
