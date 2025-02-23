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


export const action = async ({ request }) => {
  try {
    const formData = new FormData();
    const data = await request.formData();
    const username = data.get("username");
    const name = data.get("name");
    const surname = data.get("surname");
    const email = data.get("email");
    const password = data.get("password");



    // เพิ่มข้อมูลจาก FormData ลงใน formData
    for (const [key, value] of data.entries()) {
      formData.append(key, value);
    }

    const adminData = {
      username: username,
      name: name,
      surname: surname,
      email: email,
      password: password,
    };

    console.log("Sending request:", adminData);
    await customFetch.post("/auth/register", adminData);
    toast.success("เพิ่มข้อมูลแอดมินเรียบร้อยแล้ว");
    return redirect("/dashboard/all-admin");
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AddAdmin = () => {
  const { user } = useOutletContext();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";


  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">เพิ่มข้อมูลแอดมิน</h4>
        <div className="form-center">
          <FormRow type="text" name="username" labelText="ชื่อผู้ใช้" />

          <FormRow type="text" name="name" labelText="ชื่อ" />

          <FormRow type="text" name="surname" labelText="นามสกุล" />

          <FormRow type="text" name="email" labelText="อีเมล" />

          <FormRow type="text" name="password" labelText="รหัสผ่าน" />

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

export default AddAdmin;
