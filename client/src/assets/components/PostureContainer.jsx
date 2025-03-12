// MissionContainer.jsx
import React from "react";
import Wrapper from "../wrappers/PatientsContainer";
import { useAllPostureContext } from "../../pages/AllPosture";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, Form } from "react-router-dom";

const PostureContainer = () => {
  const { missions } = useAllPostureContext();
  const navigate = useNavigate();

  if (!missions) {
    return (
      <Wrapper>
        <h2>Loading...</h2>
      </Wrapper>
    );
  }

  if (missions.length === 0) {
    return (
      <Wrapper>
        <br /><br /><br /><h2>ไม่มีข้อมูลภารกิจ</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th>ด่านที่</th>
            <th>ชื่อภารกิจ</th>
            <th>การประเมิน</th>
            <th>จำนวนท่า</th>
            <th className="actions-header">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => (
            <tr key={mission._id}>
              <td>{mission.no}</td>
              <td>{mission.name}</td>
              <td>{mission.isEvaluate ? "ประเมิน" : "ไม่ประเมิน"}</td>
              <td>{mission.submission?.length || 0}</td>
              <td className="actions">
                <Link to={`/dashboard/edit-posture/${mission._id}`} className="btn edit-btn">
                  <FaEdit />
                </Link>
                <Form method="post" action={`/dashboard/delete-posture/${mission._id}`}>
                  <button
                    type="submit"
                    className="btn delete-btn"
                    onClick={(e) => {
                      if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบภารกิจนี้?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <MdDelete />
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default PostureContainer;
