import React, { useContext, createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch.js";
import PostureContainer from "../assets/components/PostureContainer.jsx";
import AddButton from "../assets/components/AddButton.jsx";
import AllHeader from "../assets/components/AllHeader.jsx";
import SoftDelete from "../assets/components/SoftDelete.jsx";
import { useLoaderData, useNavigate } from "react-router-dom";
import SearchPostures from "../assets/components/SearchPostures.jsx";
import { MdOutlineAutoDelete } from "react-icons/md";

export const loader = async ({ request }) => {
  console.log(request.url);
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get("/postures", {
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

const AllPostureContext = createContext();

const AllPosture= () => {
  const { data } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลท่ากายภาพรือไม่
    if (data && data.postures) {
      // หากมีข้อมูลท่ากายภาพ ให้ทำตามปกติ
      console.log(data.postures);
    } else {
      // หากไม่มีข้อมูลท่า ให้แสดงข้อความว่า No posture to display
      console.log("No posture to display");
    }
  }, [data]);

  return (
    <AllPostureContext.Provider value={{ data }}>
      <SearchPostures />
      <AddButton onClick={() => navigate("/dashboard/add-posture")}>
        <b>+</b> เพิ่มท่ากายภาพ
      </AddButton>
      <SoftDelete onClick={() => navigate("/dashboard/history-deleted-posture")}>
        <MdOutlineAutoDelete />
      </SoftDelete>
      <AllHeader>ท่ากายภาพทั้งหมด</AllHeader>
      <PostureContainer />
    </AllPostureContext.Provider>
  );
};

export const useAllPostureContext = () => useContext(AllPostureContext);

export default AllPosture;
