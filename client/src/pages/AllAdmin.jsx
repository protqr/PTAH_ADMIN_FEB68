import React, { useContext, createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch.js";
import AdminContainer from "../assets/components/AdminContainer.jsx";
import SearchAdmin from "../assets/components/SearchAdmin.jsx";
import AddButton from "../assets/components/AddButton.jsx";
import AllHeader from "../assets/components/AllHeader.jsx";
import { useLoaderData, useNavigate } from "react-router-dom";
import SoftDelete from "../assets/components/SoftDelete.jsx";
import { MdOutlineAutoDelete } from "react-icons/md";

export const loader = async ({ request }) => {
  console.log(request.url);
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/users", {
      params,
    });
    return {
      data,
      searchValues: { ...params },
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllAdminContext = createContext();

const AllAdmin = () => {
  const { data } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลท่ากายภาพรือไม่
    if (data && data.users) {
      // หากมีข้อมูลท่ากายภาพ ให้ทำตามปกติ
      console.log(data.users);
    } else {
      // หากไม่มีข้อมูลท่า ให้แสดงข้อความว่า No posture to display
      console.log("No user to display");
    }
  }, [data]);

  return (
    <AllAdminContext.Provider value={{ data }}>
      <SearchAdmin />
      <AddButton onClick={() => navigate("/dashboard/add-admin")}>
        <b>+</b> เพิ่มแอดมิน
      </AddButton>
      <SoftDelete onClick={() => navigate("/dashboard/history-deleted-admin")}>
        <MdOutlineAutoDelete />
      </SoftDelete>
      <AllHeader>ข้อมูลแอดมินทั้งหมด</AllHeader>
      <AdminContainer />
    </AllAdminContext.Provider>
  );
};

export const useAllAdminContext = () => useContext(AllAdminContext);

export default AllAdmin;
