import React, { useState } from "react";
import { FormRow, FormRowSelect } from "../assets/components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useLoaderData, useParams } from "react-router-dom";
import { PREFIXDOCTOR } from "../../../utils/constants";
import { Form, useNavigate, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const loader = async ({ params }) => {
  try {
    const { _id } = params;
    if (!_id) {
      throw new Error("Invalid ID");
    }
    const { data } = await customFetch.get(`/MPersonnel/${_id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.msg);
    return redirect("/dashboard/all-doctor");
  }
};

export const action = async ({ request, params }) => {
  const { _id } = params;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);


  try {
    if (!_id) {
      throw new Error("Invalid ID");
    }
    await customFetch.patch(`/MPersonnel/${_id}`, data);
    toast.success("แก้ไขข้อมูลแพทย์เรียบร้อยแล้ว");
    return redirect("/dashboard/all-doctor");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const EditDoctor = () => {
  const { doctor } = useLoaderData();

  const navigation = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [selectedDoctorType, setSelectedDoctorType] = useState(
    doctor.nametitle || ""
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
            defaultValue={doctor.username}
          />

          <FormRowSelect
            labelText="คำนำหน้าชื่อ"
            name="nametitle"
            value={selectedDoctorType}
            onChange={handleDoctorTypeChange}
            list={Object.values(PREFIXDOCTOR)}
            defaultValue={doctor.nametitle}
          />

          <FormRow
            type="text"
            name="email"
            labelText="อีเมล"
            defaultValue={doctor.email}
          />

          <FormRow
            type="text"
            name="name"
            labelText="ชื่อ-นามสกุล"
            defaultValue={doctor.name}
          />

          <FormRow
            type="text"
            name="surname"
            labelText="นามสกุล"
            defaultValue={doctor.surname}
          />

          <FormRow
            type="text"
            name="tel"
            labelText="เบอร์โทร"
            defaultValue={doctor.tel}
          />

          {/* <br /> */}
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
export default EditDoctor;
