// import React, { useContext, createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import customFetch from "../utils/customFetch.js";
// import DoctorContainer from "../assets/components/DoctorContainer.jsx";
// import SearchMPersonnel from "../assets/components/SearchMPersonnel.jsx";
// import AddButton from "../assets/components/AddButton.jsx";
// import AllHeader from "../assets/components/AllHeader.jsx";
// import { useLoaderData, useNavigate } from "react-router-dom";
// import SoftDelete from "../assets/components/SoftDelete.jsx";
// import { MdOutlineAutoDelete } from "react-icons/md";

// export const loader = async ({ request }) => {
//   console.log(request.url);
//   const params = Object.fromEntries([
//     ...new URL(request.url).searchParams.entries(),
//   ]);

//   try {
//     const { data } = await customFetch.get("/MPersonnel", {
//       params,
//     });
//     return {
//       data,
//       searchValues: { ...params },
//     };
//   } catch (error) {
//     toast.error(error?.response?.data?.msg);
//     return error;
//   }
// };

// const AllNotificationContext = createContext();

// const AllNotification = () => {
//   const { data } = useLoaderData();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // ตรวจสอบว่ามีข้อมูลแพทย์หรือไม่
//     if (data && data.MPersonnel) {
//       // หากมีข้อมูล ให้ทำตามปกติ
//       console.log(data.MPersonnel);
//     } else {
//       // หากไม่มีข้อมูลให้แสดงข้อความว่า No doctor to display
//       console.log("No doctor to display");
//     }
//   }, [data]);

//   return (
//     <AllNotificationContext.Provider value={{ data }}>
//       <SearchMPersonnel />
//       <AddButton onClick={() => navigate("/dashboard/add-doctor")}>
//         <b>+</b> เพิ่มข้อมูลแพทย์
//       </AddButton>
//       <SoftDelete onClick={() => navigate("/dashboard/history-deleted-doctor")}>
//         <MdOutlineAutoDelete />
//       </SoftDelete>
//       <AllHeader>ข้อมูลแพทย์ทั้งหมด</AllHeader>
//       <DoctorContainer />
//     </AllNotificationContext.Provider>
//   );
// };

// export const useAllNotificationContext = () => useContext(AllNotificationContext);

// export default AllNotification;
