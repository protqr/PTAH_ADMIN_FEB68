import mongoose from "mongoose";
import {
  TYPEPOSTURES,
  TYPESTATUS,
  GENDER,
  RELATIONS,
  HAVECAREGIVER,
} from "../utils/constants.js";

const PatientSchema = new mongoose.Schema(
  {
    idPatient: String, // หมายเลขผู้ป่วย
    username: { type: String, required: true, unique: true },
    ID_card_number: { type: String, required: true, unique: true },
    password: String,
    email: { type: String, sparse: true },
    name: String, // ชื่อผู้ป่วย
    surname: String, // นามสกุลผู้ป่วย
    gender: {
      type: String,
      enum: Object.values(GENDER),
      default: GENDER.GENDER_01,
    },
    birthday: Date,
    tel: String, // เบอร์โทรผู้ป่วย
    nationality: String, // สัญชาติ
    Address: String, // ที่อยู่
    userType: {
      type: String,
      default: null,
    },
    sickness: String, // อาการของผู้ป่วย
    userPosts: String, // ท่ากายภาพบำบัดที่เลือก
    userStatus: {
      type: String,
      enum: Object.values(TYPESTATUS),
      default: TYPESTATUS.TYPE_ST1,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User", // ผู้ใช้งานที่สร้างข้อมูลนี้
    },
    isDeleted: {
      type: Boolean,
      default: false, // ระบุว่าลบข้อมูลแล้วหรือไม่
    },
    deletedAt: {
      type: Date,
      default: null,
      // กำหนด TTL index ที่จะลบเอกสารหลัง 30 วัน (2592000 วินาที)
      index: {
        expireAfterSeconds: 2592000, // 30 days
        partialFilterExpression: { isDeleted: true },
      },
    },
    // deletedAt: { type: Date, default: null },
    // deleteExpiry: { type: Date, default: null },
    AdddataFirst: { type: Boolean, default: true },
    physicalTherapy: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },

    // ข้อมูลผู้ดูแล
    youhaveCaregiver: {
      type: String,
      enum: Object.values(HAVECAREGIVER),
      default: null,
    },
    nameCaregiver: String, // ชื่อผู้ดูแล
    lastnameCaregiver: String, // นามสกุลผู้ดูแล
    telCaregiver: String, // เบอร์โทรผู้ดูแล
    caregiverRelations: {
      type: String,
      enum: Object.values(RELATIONS), // กำหนดเป็นค่าที่เลือกจาก radio button
      required: true,
    },
    otherRelations: {
      type: String,
      required: function () {
        return this.relations === RELATIONS.OTHER; // ต้องกรอกข้อมูลเมื่อเลือก 'อื่นๆ'
      },
    },
  },
  {
    collection: "User",
    timestamps: true,
  } // กำหนดให้บันทึกวันที่สร้างและแก้ไขข้อมูล
);

export default mongoose.model("Patient", PatientSchema);
