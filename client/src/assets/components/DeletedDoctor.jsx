import React, { useEffect, useState } from "react";
import Wrapper from "../wrappers/PatientsContainer";
import { RiHistoryLine } from "react-icons/ri";
import customFetch from "../../utils/customFetch";
import { useNavigate } from "react-router-dom";

const DeletedDoctor = () => {
  const [deletedMPersonnel, setDeletedMPersonnel] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMPersonnel = async () => {
      try {
        const res = await customFetch.get("/MPersonnel?isDeleted=true");
        console.log(res.data);
        setDeletedMPersonnel(res.data.MPersonnel);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMPersonnel();
  }, []);

  const handleRecoverDoctor = async (doctorId) => {
    try {
      const res = await customFetch.patch(`/MPersonnel/${doctorId}`, {
        isDeleted: false,
      });
      if (res.status === 200) {
        // Check for successful response
        const updatedMPersonnel = deletedMPersonnel.filter(
          (doctor) => doctor._id !== doctorId
        );
        setDeletedMPersonnel(updatedMPersonnel);
        navigate("/dashboard/all-doctor"); // Redirect after successful recovery
      } else {
        console.error("Error recovering doctor:", res.statusText);
      }
    } catch (error) {
      console.error("Error recovering doctor:", error);
    }
  };

    return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th className="nopat">คำนำหน้า</th>
            <th>ชื่อ-นามสกุล</th>
            <th className="mang">กู้คืน</th>
          </tr>
        </thead>

          {deletedMPersonnel.map((doctor) => {
            return (
              <tbody key={doctor._id}>
                <td>{doctor.nametitle}</td>
                <td>
                  {doctor.name} {doctor.surname}
                </td>
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
                        handleRecoverDoctor(doctor._id);
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

export default DeletedDoctor;
