import { StatusCodes } from "http-status-codes";
import Doctor from "../models/DoctorModel.js";
import { NotFoundError } from "../errors/customError.js";

// export const getAllDoctor = async (req, res) => {
//   const MPersonnel = await Doctor.find({});
//   res.status(StatusCodes.OK).json({ MPersonnel });
// };

export const getAllDoctor = async (req, res) => {
  const { search, nametitle, sort, isDeleted } = req.query;
  console.log(isDeleted);

  const queryObject = {};
  if (typeof isDeleted !== "undefined") {
    queryObject.isDeleted = isDeleted === "true";
  } else {
    queryObject.isDeleted = { $nin: [true] };
  }
  if (search) {
    queryObject.$or = [{ name: { $regex: search, $options: "i" } }];
    queryObject.$or = [{ surname: { $regex: search, $options: "i" } }];
  }

  if (nametitle && nametitle !== "ทั้งหมด") {
    queryObject.nametitle = nametitle;
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

  const MPersonnel = await Doctor.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit); // ลบ { createdBy: req.user.userId } เพื่อค้นหาข้อมูลทั้งหมด
  const totalMPersonnel = await Doctor.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalMPersonnel / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalMPersonnel, numOfPages, currentPage: page, MPersonnel });
};

export const createDoctor = async (req, res) => {
  const { username } = req.body;

  const existingDoctor = await Doctor.findOne({ username });
  if (existingDoctor) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "username already exists" });
  }
  // If username does not exist, proceed to create new doctor
  req.body.createdBy = req.user.userId;
  const doctoruser = await Doctor.create(req.body);
  res.status(StatusCodes.CREATED).json({ doctoruser });
};

export const getDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params._id);
  if (!doctor) throw new NotFoundError(`no doctor with id : ${_id}`);
  res.status(StatusCodes.OK).json({ doctor });
};

export const updateDoctor = async (req, res) => {
  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.params._id,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedDoctor)
    throw new NotFoundError(`no doctor with id : ${req.params._id}`);

  res.status(StatusCodes.OK).json({ doctor: updatedDoctor });
};

// export const deleteDoctor = async (req, res) => {
//   const removedDoctor = await Doctor.findByIdAndDelete(req.params._id);

//   if (!removedDoctor) throw new NotFoundError(`no doctor with id : ${_id}`);
//   res.status(StatusCodes.OK).json({ doctor: removedDoctor });
// };

export const deleteDoctor = async (req, res) => {
  const { _id } = req.params;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedDoctor) {
      throw new NotFoundError(`no doctor with id : ${_id}`);
    }

    res.status(StatusCodes.OK).json({ doctor: updatedDoctor });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
