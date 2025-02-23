import React from "react";
import DeletePosture from "../assets/components/DeletePosture.jsx";
import AllHeader from "../assets/components/AllHeader.jsx";

const SoftDeletePosture = () => {
  return (
    <>
      <AllHeader>ข้อมูลที่ลบล่าสุด</AllHeader>
      <DeletePosture />
    </>
  );
};

export default SoftDeletePosture;
