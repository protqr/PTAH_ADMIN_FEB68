import React, { useState } from "react";
import { FormRow, FormRowSelect } from "../assets/components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, redirect, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { TYPEPOSTURES } from "../../../utils/constants";

export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = {
      name: formData.get("name"),
      no: formData.get("no"),
      type: formData.get("type"),
      isEvaluate: formData.get("isEvaluate") === "ประเมิน",
    };

    await customFetch.post("/missions", data);
    toast.success("สร้างภารกิจเรียบร้อยแล้ว");
    return redirect("/dashboard/all-posture");
  } catch (error) {
    toast.error(error?.response?.data?.msg || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    return error;
  }
};

const AddMission = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">เพิ่มภารกิจ</h4>
        <div className="form-center">
          <FormRowSelect
            labelText="ประเภทของภารกิจ"
            name="type"
            list={Object.values(TYPEPOSTURES)}
            required
          />

          <FormRow
            type="text"
            name="name"
            labelText="ชื่อภารกิจ"
            required
          />

          <FormRow
            type="number"
            name="no"
            labelText="ด่านที่"
            required
          />

          <div className="form-row">
            <label className="form-label required">การประเมิน</label>
            <div className="radio-group evaluate-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="isEvaluate"
                  value="ประเมิน"
                  className="radio-input"
                  required
                />
                <span className="radio-custom" />
                <span className="radio-text">ประเมิน</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isEvaluate"
                  value="ไม่ประเมิน"
                  className="radio-input"
                />
                <span className="radio-custom" />
                <span className="radio-text">ไม่ประเมิน</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddMission; 