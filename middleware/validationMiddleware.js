import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customError.js";
import {
  TYPEPOSTURES,
  CHOOSEPOSTURES,
  TYPESTATUS,
  PREFIXDOCTOR,
  GENDER
} from "../utils/constants.js";
import mongoose from "mongoose";
import Patient from "../models/PatientModel.js";
import Posture from "../models/PostureModel.js";
import Doctor from "../models/DoctorModel.js";
import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";


const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no patient")) {
          // แสดง alert เมื่อไม่พบผู้ป่วย
          alert("ไม่พบผู้ป่วย");
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          // แสดง alert เมื่อไม่ได้รับอนุญาตให้เข้าถึงเส้นทางนี้
          alert("ไม่ได้รับอนุญาตให้เข้าถึงเส้นทางนี้");
          throw new UnauthorizedError("not authorized to access this route");
        }
        // แสดง alert เมื่อข้อมูลไม่ถูกต้อง
        alert("ข้อมูลไม่ถูกต้อง");
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validatePatientInput = withValidationErrors([
  body("idPatient")
    .notEmpty()
    .withMessage("โปรดกรอกหมายเลขผู้ป่วยให้ถูกต้อง")
    .custom(async (value) => {
      // Check if idPatient already exists in the database
      const existingPatient = await Patient.findOne({ idPatient: value });
      if (existingPatient) {
        throw new BadRequestError("หมายเลขผู้ป่วยซ้ำ");
      }
    }),
  body("ID_card_number")
    .notEmpty()
    .withMessage("โปรดกรอกหมายเลขบัตรประชาชนให้ถูกต้อง")
    .custom(async (value) => {
      // Check if ID_card_number already exists in the database
      const existingIDCard = await Patient.findOne({ ID_card_number: value });
      if (existingIDCard) {
        throw new BadRequestError("หมายเลขบัตรประชาชนซ้ำ");
      }
    }),
  body("username")
    .notEmpty()
    .withMessage("โปรดกรอกชื่อผู้ใช้")
    .custom(async (value) => {
      // Check if username already exists in the database
      const existingUsername = await Patient.findOne({ username: value });
      if (existingUsername) {
        throw new BadRequestError("ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว");
      }
    }),
  body("email").notEmpty().withMessage("โปรดกรอกอีเมล"),
  body("name").notEmpty().withMessage("โปรดกรอกชื่อผู้ป่วยให้ถูกต้อง"),
  body("surname").notEmpty().withMessage("โปรดกรอกนามสกุลผู้ป่วยให้ถูกต้อง"),
  body("birthday").notEmpty().withMessage("โปรดกรอกวันเกิด"),
  body("tel").notEmpty().withMessage("โปรดกรอกเบอร์โทรผู้ป่วย"),
  body("nationality")
    .notEmpty()
    .withMessage("โปรดกรอกสัญชาติผู้ป่วยให้ถูกต้อง"),
  body("Address").notEmpty().withMessage("โปรดกรอกที่อยู่ผู้ป่วยให้ถูกต้อง"),
  body("sickness").notEmpty().withMessage("โปรดกรอกโรคของผู้ป่วยให้ถูกต้อง"),
  body("gender")
    .notEmpty()
    .isIn(Object.values(GENDER))
    .withMessage("โปรดเลือกเพศผู้ป่วยให้ถูกต้อง"),
  body("userType")
    .notEmpty()
    .isIn(Object.values(TYPEPOSTURES))
    .withMessage("โปรดเลือกชื่อประเภทท่ากายภาพบำบัดให้ถูกต้อง"),
  body("userPosts").notEmpty(),
  // .isIn(Object.values(CHOOSEPOSTURES))
  // .withMessage("โปรดเลือกท่ากายภาพบำบัดให้ถูกต้อง")
  body("userStatus")
    .notEmpty()
    .isIn(Object.values(TYPESTATUS))
    .withMessage("โปรดเลือกสถานะปัจจุบันของคนไข้ให้ถูกต้อง"),
]);

export const validatePostureInput = withValidationErrors([
  body("noPostures")
    .notEmpty()
    .withMessage("โปรดกรอกเลขท่ากายภาพให้ถูกต้อง")
    .custom(async (value) => {
      // Check if noPostures already exists in the database
      const existingPosture = await Posture.findOne({ noPostures: value });
      if (existingPosture) {
        throw new BadRequestError("หมายเลขท่ากายภาพซ้ำ");
      }
    }),
  body("namePostures")
    .notEmpty()
    .withMessage("โปรดกรอกชื่อท่ากายภาพให้ถูกต้อง"),
  body("Description")
    .notEmpty()
    .withMessage("โปรดกรอกรายละเอียดท่ากายภาพให้ถูกต้อง"),
  body("userType")
    .isIn(Object.values(TYPEPOSTURES))
    .withMessage("โปรดเลือกชื่อประเภทท่ากายภาพบำบัดให้ถูกต้อง"),
]);

export const validateDoctorInput = withValidationErrors([
  body("username")
    .notEmpty()
    .withMessage("โปรดกรอกเลขใบประกอบวิชาชีพ")
    .custom(async (value) => {
      // Check if username already exists in the database
      const existingDoctor = await Doctor.findOne({ username: value });
      if (existingDoctor) {
        throw new BadRequestError("เลขใบประกอบวิชาชีพซ้ำ");
      }
    }),
  body("name").notEmpty().withMessage("โปรดกรอกชื่อ"),
  body("surname").notEmpty().withMessage("โปรดกรอกนามสกุล"),
  body("tel").notEmpty().withMessage("โปรดกรอกอีเมล"),
  body("tel").notEmpty().withMessage("โปรดกรอกเบอร์โทรศัพท์"),
  body("nametitle")
    .isIn(Object.values(PREFIXDOCTOR))
    .withMessage("โปรดเลือกคำนำหน้าชื่อให้ถูกต้อง"),
]);

export const validatePostInput = withValidationErrors([
  body("title").notEmpty().withMessage("โปรดกรอกชื่อหัวข้อเรื่อง"),
  body("content").notEmpty().withMessage("โปรดกรอกเนื้อเรื่อง"),
  body("tag").notEmpty().withMessage("โปรดใส่แท็ก"),
  body("postedBy").notEmpty().withMessage("โปรดใส่ชื่อผู้โพสต์"),
  body("comments").notEmpty().withMessage("คอมเมนท์"),
]);


export const validateIdParam = withValidationErrors([
  param("_id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const patient = await Patient.findById(value);
    if (!patient) throw new NotFoundError(`no patient with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === patient.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateIdParam2 = withValidationErrors([
  param("_id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const posture = await Posture.findById(value);
    if (!posture) throw new NotFoundError(`no posture with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === posture.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateIdParam3 = withValidationErrors([
  param("_id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const doctor = await Doctor.findById(value);
    if (!doctor) throw new NotFoundError(`no doctor with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === doctor.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateIdParam4 = withValidationErrors([
  param("_id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const admin = await User.findById(value);
    if (!admin) throw new NotFoundError(`no admin with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === admin.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateIdParam5 = withValidationErrors([
  param("_id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const post = await Post.findById(value);
    if (!post) throw new NotFoundError(`no post with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === post.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateRegisterInput = withValidationErrors([
  // โค้ด validateRegisterInput นี่เราไม่ได้แก้ไขใด ๆ
]);

export const validateLoginInput = withValidationErrors([
  // โค้ด validateLoginInput นี่เราไม่ได้แก้ไขใด ๆ
]);

export const validateUpdateUserInput = withValidationErrors([
  // โค้ด validateUpdateUserInput นี่เราไม่ได้แก้ไขใด ๆ
]);
