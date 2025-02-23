import React from "react";
import Patient from "./Patient";
import Wrapper from "../wrappers/PatientsContainer";
import { useAllPatientContext } from "../../pages/AllPatient";

const PatientsContainer = () => {
  const { data } = useAllPatientContext();

  // ตรวจสอบว่า data ไม่เป็น null หรือ undefined ก่อนที่จะ destructuring
  if (!data) {
    return (
      <Wrapper>
        <h2>Loading...</h2>
      </Wrapper>
    );
  }

  // destructuring allusers ซึ่งเป็น array ของ patients จาก data
  const { allusers: patients } = data;

  // ตรวจสอบว่า patients มีค่าและมีความยาวมากกว่า 0 ก่อนที่จะแสดงผู้ป่วย
  if (!patients || patients.length === 0) {
    return (
      <Wrapper>
        <br /><br /><br /><h2>ไม่พบข้อมูลผู้ป่วย</h2>
      </Wrapper>
    );
  }

  // หากมีผู้ป่วย ให้แสดงรายการผู้ป่วย
  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th className="nopat">หมายเลขผู้ป่วย</th>
            <th>ชื่อผู้ป่วย</th>
            <th>สถานะของผู้ป่วย</th>
            <th className="mang">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            return <Patient key={patient.username} {...patient} />;
          })}
        </tbody>
      </table>
    </Wrapper>
  );
};



export default PatientsContainer;
