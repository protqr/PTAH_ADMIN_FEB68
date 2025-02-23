import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/users/${params._id}`);
    return toast.success("ลบข้อมูลแอดมินออกเรียบร้อยแล้ว");
  } catch (error) {
    return toast.error(error.response.data.msg);
  }
};

const DeleteAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/all-admin");
  }, [navigate]);

  return <div>Deleting admin...</div>;
};

export default DeleteAdmin;
