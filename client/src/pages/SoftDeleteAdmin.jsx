import React from "react";
import DeletedAdmin from "../assets/components/DeletedAdmin.jsx";
import AllHeader from "../assets/components/AllHeader.jsx";

const SoftDeleteAdmin = () => {
  return (
    <>
      <AllHeader>ข้อมูลที่ลบล่าสุด</AllHeader>
      <DeletedAdmin />
    </>
  );
};

export default SoftDeleteAdmin;
