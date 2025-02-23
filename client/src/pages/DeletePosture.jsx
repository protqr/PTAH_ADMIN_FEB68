import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/postures/${params._id}`);
    return toast.success("ลบท่ากายภาพออกเรียบร้อยแล้ว");
  } catch (error) {
    return toast.error(error.response.data.msg);
  }
};

const DeletePosture = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/all-posture");
  }, [navigate]);

  return <div>Deleting posture...</div>;
};

export default DeletePosture;
