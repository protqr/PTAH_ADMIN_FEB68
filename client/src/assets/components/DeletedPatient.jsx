import React, { useEffect, useState } from "react";
import Wrapper from "../wrappers/PatientsContainer";
import { RiHistoryLine } from "react-icons/ri";
import customFetch from "../../utils/customFetch";
import { useNavigate } from "react-router-dom";

const DeletedPatient = () => {
  const [deletedpatients, setDeletedPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await customFetch.get("/allusers?isDeleted=true");
        console.log(res.data);
        setDeletedPatients(res.data.allusers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPatients();
  }, []);

  const handleRecoverPatient = async (patientId) => {
    try {
      const res = await customFetch.patch(`/allusers/${patientId}`, {
        isDeleted: false,
      });
      if (res.status === 200) {
        // Check for successful response
        const updatedPatients = deletedpatients.filter(
          (Patient) => Patient._id !== patientId
        );
        setDeletedPatients(updatedPatients); // Fix typo here
        navigate("/dashboard/all-patient"); // Redirect after successful recovery
      } else {
        console.error("Error recovering patient:", res.statusText);
      }
    } catch (error) {
      console.error("Error recovering patient:", error);
    }
  };

    const formatUserName = (username) => {
      return username.slice(0, 8) + "x".repeat(6);
    };

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th className="nopat">หมายเลขผู้ป่วย</th>
            <th>ชื่อผู้ป่วย</th>
            <th>สถานะของผู้ป่วย</th>
            <th className="mang">กู้คืน</th>
          </tr>
        </thead>
        {deletedpatients.map((patient) => {
          return (
            <tbody key={patient._id}>
              <td>{formatUserName(patient.username)}</td>
              <td>
                {patient.name} {patient.surname}
              </td>
              <td>{patient.userStatus}</td>
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
                      handleRecoverPatient(patient._id);
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

export default DeletedPatient;
