import React, { useEffect, useState } from "react";
import Wrapper from "../wrappers/PatientsContainer";
import { RiHistoryLine } from "react-icons/ri";
import customFetch from "../../utils/customFetch";
import { useNavigate } from "react-router-dom";

const DeletePosture = () => {
  const [deletedPostures, setDeletedPostures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostures = async () => {
      try {
        const res = await customFetch.get("/postures?isDeleted=true");
        console.log(res.data);
        setDeletedPostures(res.data.postures);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPostures();
  }, []);

  const handleRecoverPosture = async (postId) => {
    try {
      const res = await customFetch.patch(`/postures/${postId}`, {
        isDeleted: false,
      });
      if (res.status === 200) {
        // Check for successful response
        const updatedPostures = deletedPostures.filter(
          (posture) => posture._id !== postId
        );
        setDeletedPostures(updatedPostures);
        navigate("/dashboard/all-posture"); // Redirect after successful recovery
      } else {
        console.error("Error recovering posture:", res.statusText);
      }
    } catch (error) {
      console.error("Error recovering posture:", error);
    }
  };

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th className="nopat">ท่าที่</th>
            <th>ชื่อท่ากายภาพ</th>
            <th className="mang">กู้คืน</th>
          </tr>
        </thead>
        {deletedPostures.map((posture) => {
          return (
            <tbody key={posture._id}>
              <td>{posture.noPostures}</td>
              <td>{posture.namePostures}</td>
              <td>
                <button
                  type="button"
                  className="btn delete-btn"
                  onClick={() => {
                    if (
                      window.confirm(
                        "คุณแน่ใจหรือไม่ว่าต้องการกู้คืนรายการนี้?"
                      )
                    ) {
                      handleRecoverPosture(posture._id);
                    }
                  }}
                >
                  <RiHistoryLine />
                </button>
              </td>
            </tbody>
          );
        })}
      </table>
    </Wrapper>
  );
};

export default DeletePosture;
