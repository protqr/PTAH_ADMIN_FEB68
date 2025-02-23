import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/posts/${params._id}`);
    return toast.success("ลบข้อมูลโพสท์ออกเรียบร้อยแล้ว");
  } catch (error) {
    return toast.error(error.response.data.msg);
  }
};

const DeletePost = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/blogmanage");
  }, [navigate]);

  return <div>Deleting post...</div>;
};

export default DeletePost;
