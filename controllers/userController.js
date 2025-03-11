import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Patient from "../models/PatientModel.js";
import Users from "../models/UsersModel.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const patient = await Patient.countDocuments();
  res.status(StatusCodes.OK).json({ users, patient });
};

export const updateUser = async (req, res) => {
  const obj = { ...req.body };
  delete obj.password;
  console.log(obj);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.userId,
    req.body,
    obj
  );
  res.status(StatusCodes.OK).json({ msg: "user updated" });
};

//
// export const getAllAdmin = async (req, res) => {
//   const users = await User.find({});
//   res.status(StatusCodes.OK).json({ users });
// };

export const getAllAdmin = async (req, res) => {
  const { search, sort, isDeleted } = req.query;
  console.log(isDeleted);

  const queryObject = {};
  if (typeof isDeleted !== "undefined") {
    queryObject.isDeleted = isDeleted === "true";
  } else {
    queryObject.isDeleted = { $nin: [true] };
  }
  if (search) {
    queryObject.$or = [{ name: { $regex: search, $options: "i" } }];
  }

const sortOptions = {
  ใหม่ที่สุด: "-createdAt",
  เก่าที่สุด: "createdAt",
  "เรียงจาก ก-ฮ": "-name",
  "เรียงจาก ฮ-ก": "name",
};

  const sortKey = sortOptions[sort] || sortOptions.ใหม่ที่สุด;

  // แบ่งหน้า

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit); // ลบ { createdBy: req.user.userId } เพื่อค้นหาข้อมูลทั้งหมด
  const totalUsers = await User.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalUsers / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalUsers, numOfPages, currentPage: page, users });
};

export const createAdmin = async (req, res) => {
  const { _id } = req.body;

  const existingAdmin = await User.findOne({ _id });
  if (existingAdmin) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "id already exists" });
  }
  // If noPostures does not exist, proceed to create new posture
  req.body.createdBy = req.user.userId;
  const adminuser = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ adminuser });
};

export const getAdmin = async (req, res) => {
  const user = await User.findById(req.params._id);
  if (!user) throw new NotFoundError(`no admin with id : ${_id}`);
  res.status(StatusCodes.OK).json({ user });
};

export const updateAdmin = async (req, res) => {
  const updatedAdmin = await User.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
  });

  if (!updatedAdmin)
    throw new NotFoundError(`no user with id : ${req.params._id}`);

  res.status(StatusCodes.OK).json({ user: updatedAdmin });
};

// export const deleteAdmin = async (req, res) => {
//   const removedAdmin = await User.findByIdAndDelete(req.params._id);
//   console.log(req.params._id);

//   if (!removedAdmin) throw new NotFoundError(`no user with id : ${_id}`);
//   res.status(StatusCodes.OK).json({ user: removedAdmin });
// };

export const deleteAdmin = async (req, res) => {
  const { _id } = req.params;

  try {
    const updatedAdmin = await User.findByIdAndUpdate(
      _id,
      { isDeleted: true, deletedAt: new Date(), },
      { new: true }
    );

    if (!updatedAdmin) {
      throw new NotFoundError(`no admin with id : ${_id}`);
    }

    res.status(StatusCodes.OK).json({ admin: updatedAdmin });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const getPhysicalTherapyUsers = async (req, res) => {
  try {
    // ดึงเฉพาะผู้ใช้ที่มี physicalTherapy = true
    const users = await Users.find({ physicalTherapy: true });
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};