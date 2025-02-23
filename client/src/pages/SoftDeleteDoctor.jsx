import React from "react";
import DeletedDoctor from "../assets/components/DeletedDoctor.jsx";
import AllHeader from "../assets/components/AllHeader.jsx";

const SoftDeleteDoctor = () => {
  return (
    <>
      <AllHeader>ข้อมูลที่ลบล่าสุด</AllHeader>
      <DeletedDoctor />
    </>
  );
};

export default SoftDeleteDoctor;
