// In AllPosture.jsx
import React, { useContext, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch.js";
import MissionContainer from "../assets/components/PostureContainer.jsx";
import AddButton from "../assets/components/AddButton.jsx";
import AllHeader from "../assets/components/AllHeader.jsx";
import SoftDelete from "../assets/components/SoftDelete.jsx";
import { useLoaderData, useNavigate } from "react-router-dom";
import SearchMissions from "../assets/components/SearchPostures.jsx";
import { MdOutlineAutoDelete } from "react-icons/md";

export const loader = async ({ request }) => {
  const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);

  try {
    const { data } = await customFetch.get("/missions", { params });
    console.log("Missions data:", data); // Debug log
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

const AllPosture = () => {
  const { data, searchValues } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.missions) {
      console.log("Missions loaded:", data.missions);
    } else {
      console.log("No missions data available");
    }
  }, [data]);

  return (
    <AllPostureContext.Provider value={{ missions: data.missions || [], searchValues }}>
      <SearchMissions />
      <AddButton onClick={() => navigate("/dashboard/add-posture")}>
        <b>+</b> เพิ่มท่ากายภาพ
      </AddButton>
      <SoftDelete onClick={() => navigate("/dashboard/history-deleted-posture")}>
        <MdOutlineAutoDelete />
      </SoftDelete>
      <AllHeader>ภารกิจทั้งหมด</AllHeader>
      <MissionContainer />
    </AllPostureContext.Provider>
  );
};

export const useAllPostureContext = () => useContext(AllPostureContext);
export default AllPosture;
