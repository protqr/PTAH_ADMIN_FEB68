import React, { useEffect, useState } from "react";
import Wrapper from "../wrappers/PatientsContainer";
import { RiHistoryLine } from "react-icons/ri";
import customFetch from "../../utils/customFetch";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const DeletedNotification = () => {
  const [deletedData, setDeletedData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeletedData = async () => {
      try {
        const res = await customFetch.get("/notifications?isDeleted=true");
        setDeletedData(res.data.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeletedData();
  }, []);

  const handleRecoverData = async (id) => {
    try {
      const res = await customFetch.patch(`/notifications/${id}`, {
        isDeleted: false,
      });
      if (res.status === 200) {
        const newData = deletedData.filter((c) => c._id !== id);
        setDeletedData(newData);
        navigate("/dashboard/all-notification");
      } else {
        console.error("Error recovering data:", res.statusText);
      }
    } catch (error) {
      console.error("Error recovering data:", error);
    }
  };

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th className="nopat">วัน | เวลา</th>
            <th>หัวข้อแจ้งเตือน</th>
            <th>สถานะ</th>
            <th className="mang">กู้คืน</th>
          </tr>
        </thead>
        {deletedData.map((item) => {
          return (
            <tbody key={item._id}>
              <td>{dayjs(item.notifyDate).format("DD/MM/YYYY | HH:mm")}</td>
              <td>
                {item.title}
              </td>
              <td>
                {item.status}
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
                      handleRecoverData(item._id);
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

export default DeletedNotification;
