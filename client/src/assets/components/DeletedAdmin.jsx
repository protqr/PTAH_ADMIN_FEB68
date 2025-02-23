import React, { useEffect, useState } from "react";
import Wrapper from "../wrappers/PatientsContainer";
import { RiHistoryLine } from "react-icons/ri";
import customFetch from "../../utils/customFetch";
import { useNavigate } from "react-router-dom";

const DeletedAdmin = () => {
  const [deletedAdmins, setDeletedAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await customFetch.get("/users?isDeleted=true");
        console.log(res.data);
        setDeletedAdmins(res.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdmins();
  }, []);

  const handleRecoverAdmin = async (adminId) => {
    try {
      const res = await customFetch.patch(`/users/${adminId}`, {
        isDeleted: false,
      });
      if (res.status === 200) {
        // Check for successful response
        const updatedAdmins = deletedAdmins.filter(
          (user) => user._id !== adminId
        );
        setDeletedAdmins(updatedAdmins);
        navigate("/dashboard/all-admin"); // Redirect after successful recovery
      } else {
        console.error("Error recovering admin:", res.statusText);
      }
    } catch (error) {
      console.error("Error recovering admin:", error);
    }
  };

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th className="nopat">ชื่อแอดมิน</th>
            <th className="mang">กู้คืน</th>
          </tr>
        </thead>

        {deletedAdmins.map((user) => {
          return (
            <tbody key={user._id}>
              <td>{user.name}</td>
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
                      handleRecoverAdmin(user._id);
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

export default DeletedAdmin;
