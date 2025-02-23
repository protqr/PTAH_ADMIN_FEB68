import React, { useState } from "react";
import { FormRow, FormRowSelect } from "../assets/components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { PREFIXDOCTOR } from "../../../utils/constants";
import {
  Form,
  redirect,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const isIdDoctorDuplicate = async (username) => {
  try {
    const response = await customFetch.get(`/MPersonnel?username=${username}`);
    return response.data.length > 0; // หากมีหมายเลขซ้ำกันอยู่ในฐานข้อมูล จะคืนค่า true
  } catch (error) {
    console.error("Error checking duplicate username:", error);
    return false; // หากเกิดข้อผิดพลาดในการเชื่อมต่อกับ API หรือไม่พบข้อมูล จะคืนค่า false
  }
};

export const action = async ({ request }) => {
  try {
    const formData = new FormData();
    const data = await request.formData();
    const username = data.get("username");
    const name = data.get("name");
    const surname = data.get("surname");
    const tel = data.get("tel");
    const nametitle = data.get("nametitle");
    const email = data.get("email");


    // ตรวจสอบว่าหมายเลขผู้ป่วยซ้ำกันหรือไม่
    const isDuplicate = await isIdDoctorDuplicate(username);
    if (isDuplicate) {
      toast.error("เลขใบประกอบวิชาชีพซ้ำกัน โปรดเลือกหมายเลขที่ถูกต้อง");
      return null; // หยุดการส่งข้อมูลถ้าหมายเลขผู้ป่วยซ้ำกัน
    }

    // ตรวจสอบว่าหมายเลขผู้ป่วยเป็นตัวเลขหรือไม่
    if (!/^[0-9]+$/.test(username)) {
      toast.error("เลขใบประกอบวิชาชีพต้องเป็นตัวเลขเท่านั้น");
      return null; // หยุดการส่งข้อมูลถ้าหมายเลขผู้ป่วยไม่ใช่ตัวเลข
    }

    // เพิ่มข้อมูลจาก FormData ลงใน formData
    for (const [key, value] of data.entries()) {
      formData.append(key, value);
    }

    const doctorData = {
      username: username,
      name: name,
      surname: surname,
      tel: tel,
      nametitle: nametitle,
      email: email,
    };

    console.log("Sending request:", doctorData);
    await customFetch.post("/MPersonnel", doctorData);
    toast.success("เพิ่มข้อมูลแพทย์เรียบร้อยแล้ว");
    return redirect("/dashboard/all-doctor");
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AddDoctor = () => {
  const { user } = useOutletContext();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [selectedDoctorType, setSelectedDoctorType] = useState(
    PREFIXDOCTOR.PF_MD1
  );

  const handleDoctorTypeChange = (event) => {
    setSelectedDoctorType(event.target.value);
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">เพิ่มข้อมูลแพทย์</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="username"
            labelText="เลขใบประกอบวิชาชีพ"
            pattern="[0-9]*"
          />

          <FormRowSelect
            labelText="คำนำหน้าชื่อ"
            name="nametitle"
            value={selectedDoctorType}
            onChange={handleDoctorTypeChange}
            list={Object.values(PREFIXDOCTOR)}
          />
          <FormRow type="text" name="email" labelText="อีเมล" />
          <FormRow type="text" name="name" labelText="ชื่อ" />
          <FormRow type="text" name="surname" labelText="นามสกุล" />
          <FormRow type="text" name="tel" labelText="เบอร์โทร" />

          <br />
          <button
            type="submit"
            className="btn btn-block form-btn "
            disabled={isSubmitting}
          >
            {isSubmitting ? "submitting..." : "submit"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddDoctor;
