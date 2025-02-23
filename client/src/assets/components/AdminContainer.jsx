import React from "react";
import Wrapper from "../wrappers/PatientsContainer";
import { useAllAdminContext } from "../../pages/AllAdmin";
import Admin from "./Admin";

const AdminContainer = () => {
  const { data } = useAllAdminContext();

  if (!data) {
    return (
      <Wrapper>
        <h2>Loading...</h2>
      </Wrapper>
    );
  }

  const { users } = data;

  if (!users || users.length === 0) {
    return (
      <Wrapper>
        <br /><br /><br /><h2>ไม่พบข้อมูลแอดมิน</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th className="nopat">ชื่อแอดมิน</th>
            <th className="mang">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return <Admin key={user._id} {...user} />;
          })}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default AdminContainer;

