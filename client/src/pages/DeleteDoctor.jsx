import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/MPersonnel/${params._id}`);
    return toast.success("ลบข้อมูลแพทย์ออกเรียบร้อยแล้ว");
  } catch (error) {
    return toast.error(error.response.data.msg);
  }
};

const DeleteDoctor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/all-doctor");
  }, [navigate]);

  return <div>Deleting doctor...</div>;
};

export default DeleteDoctor;

