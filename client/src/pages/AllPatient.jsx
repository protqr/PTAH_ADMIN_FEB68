import React, { useContext, createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch.js';
import PatientsContainer from '../assets/components/PatientsContainer.jsx';
import SearchContainer from '../assets/components/SearchContainer.jsx';
import AddButton from '../assets/components/AddButton.jsx';
import AllHeader from '../assets/components/AllHeader.jsx';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { MdAddCircle } from 'react-icons/md';
import SoftDelete from "../assets/components/SoftDelete.jsx";
import { MdOutlineAutoDelete } from "react-icons/md";

export const loader = async ({ request }) => {
  console.log(request.url);
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get('/allusers', {
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


const AllPatientContext = createContext();

const AllPatient = () => {
  const { data, searchValues } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลผู้ป่วยหรือไม่
    if (data && data.allusers) {
      // หากมีข้อมูลผู้ป่วย ให้ทำตามปกติ
      console.log(data.allusers);
    } else {
      // หากไม่มีข้อมูลผู้ป่วย ให้แสดงข้อความว่า No patients to display
      console.log('ไม่พบข้อมูลผู้ป่วย');
    }
  }, [data]);

  return (
    <AllPatientContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <AddButton onClick={() => navigate("/dashboard/add-user")}>
        <b>+</b> เพิ่มผู้ป่วย
      </AddButton>
      <SoftDelete onClick={() => navigate("/dashboard/history-deleted-patient")}>
        <MdOutlineAutoDelete />
      </SoftDelete>
      <AllHeader>คนไข้ทั้งหมด</AllHeader>
      <PatientsContainer />
    </AllPatientContext.Provider>
  );
};


export const useAllPatientContext = () => useContext(AllPatientContext);

export default AllPatient;
