import Caregiver from "../models/Caregiver.js";

// ดึงข้อมูลผู้ดูแลทั้งหมด พร้อม populate ข้อมูลผู้ใช้งานและคนไข้
export const getAllCaregivers = async (req, res) => {
  try {
    const caregivers = await Caregiver.find().populate("user patient");
    res.status(200).json({ caregivers });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ดึงข้อมูลผู้ดูแลตาม id พร้อม populate ข้อมูลที่เกี่ยวข้อง
export const getCaregiverById = async (req, res) => {
  try {
    const { id } = req.params;
    const caregiver = await Caregiver.findById(id).populate("user patient");
    if (!caregiver) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลผู้ดูแล" });
    }
    res.status(200).json({ caregiver });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// สร้างข้อมูลผู้ดูแลใหม่
export const createCaregiver = async (req, res) => {
  try {
    const newCaregiver = await Caregiver.create(req.body);
    res.status(201).json({ newCaregiver });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// อัปเดตข้อมูลผู้ดูแล
export const updateCaregiver = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCaregiver = await Caregiver.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCaregiver) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลผู้ดูแลที่ต้องการแก้ไข" });
    }
    res.status(200).json({ updatedCaregiver });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ลบข้อมูลผู้ดูแล
export const deleteCaregiver = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCaregiver = await Caregiver.findByIdAndDelete(id);
    if (!deletedCaregiver) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลผู้ดูแลที่ต้องการลบ" });
    }
    res.status(200).json({ msg: "ลบข้อมูลผู้ดูแลเรียบร้อยแล้ว" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
