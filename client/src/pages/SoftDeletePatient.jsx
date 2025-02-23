import React from "react";
import DeletedPatient from "../assets/components/DeletedPatient.jsx";
import AllHeader from "../assets/components/AllHeader.jsx";

const SoftDeletePatient = () => {
  return (
    <>
      <AllHeader>ข้อมูลที่ลบล่าสุด</AllHeader>
      <DeletedPatient />
    </>
  );
};

export default SoftDeletePatient;