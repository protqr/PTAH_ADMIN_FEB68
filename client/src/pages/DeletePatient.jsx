import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/allusers/${params._id}`);
    return toast.success("ลบคนไข้ออกเรียบร้อยแล้ว");
  } catch (error) {
    return toast.error(error.response.data.msg);
  }
};

const DeletePatient = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/all-patient");
  }, [navigate]);

  return <div>Deleting patient...</div>;
};

export default DeletePatient;
