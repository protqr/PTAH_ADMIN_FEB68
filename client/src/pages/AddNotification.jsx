import React, { useState, useEffect, useMemo } from "react";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import {
  NOTIFY_TARGET_GROUP,
  NOTIFY_TYPE,
} from "../../../utils/constants";
import {
  Form,
  useNavigate,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import DateTimePicker from "../assets/components/common/DateTimePicker";
import InputText from "../assets/components/common/InputText";
import SelectInput from "../assets/components/common/SelectInput";
import UploadFile, { uploadFile } from "../assets/components/common/UploadFile";
import dayjs from "dayjs";

export const loader = async ({ params }) => {
  try {
    const { _id } = params;
    if (!_id) {
      throw new Error("Invalid ID");
    }
    const { data } = await customFetch.get(`/notifications/${_id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.msg);
    return redirect("/dashboard/all-notification");
  }
};

/**
 * 
 * @param {*} mode  add/ edit / view default=add
 * @returns 
 */
const AddNotification = () => {
  const navigate = useNavigate();
  const existingNotiItem = useLoaderData();
  const mode = useMemo(
    () => (existingNotiItem !== undefined ? "edit" : "add"),
    [existingNotiItem]
  );

  // สร้าง state สำหรับเก็บ user ที่มี physicalTherapy = true
  const [ptUsers, setPtUsers] = useState([]);

  // notificationMode มี 2 ค่า: "ทุกวัน" หรือ "กำหนดวันสิ้นสุดแจ้งเตือน"
  // ถ้าเป็น "ทุกวัน" => ให้กรอก dailyTime
  // ถ้าเป็น "กำหนดวันสิ้นสุดแจ้งเตือน" => ให้กรอก startDate, endDate
  const [formData, setFormData] = useState({
    title: mode === "edit" ? existingNotiItem.title : "",
    description: mode === "edit" ? existingNotiItem.description : "",
    notifyDate: mode === "edit" ? existingNotiItem.notifyDate : dayjs().startOf("minute").toJSON(),
    targetGroup: mode === "edit" ? existingNotiItem.targetGroup : NOTIFY_TARGET_GROUP.ALL,
    file: mode === "edit" ? existingNotiItem.file : {},
    notifyType: mode === "edit" ? existingNotiItem.notifyType : NOTIFY_TYPE.IMPORTANT,

    // กำหนดช่วงเผยแพร่ (dropdown)
    notificationMode:
      mode === "edit" && existingNotiItem.notificationMode
        ? existingNotiItem.notificationMode
        : "ทุกวัน", // ค่าเริ่มต้นเป็น "ทุกวัน"

    dailyTime:
      mode === "edit" && existingNotiItem.dailyTime
        ? existingNotiItem.dailyTime
        : dayjs().format("HH:mm"),

    startDate:
      mode === "edit" && existingNotiItem.startDate
        ? existingNotiItem.startDate
        : dayjs().toJSON(),

    endDate:
      mode === "edit" && existingNotiItem.endDate
        ? existingNotiItem.endDate
        : dayjs().add(1, "day").toJSON(),

    // เพิ่มฟิลด์สำหรับผู้รับแจ้งเตือน (เฉพาะคนไข้ที่มี PhysicalTherapy เป็น true)
    recipients:
      mode === "edit" && existingNotiItem.recipients
        ? existingNotiItem.recipients
        : [],
  });

  const [submitting, setSubmitting] = useState(false);

  // ดึงผู้ใช้ที่มี physicalTherapy = true จาก backend
  useEffect(() => {
    const fetchPhysicalTherapyUsers = async () => {
      try {
        // เรียก endpoint ที่เราสร้าง: GET /users/physical-therapy
        const { data } = await customFetch.get("/users/physical-therapy");
        setPtUsers(data);
      } catch (error) {
        console.error("Error fetching PT users:", error);
      }
    };
    fetchPhysicalTherapyUsers();
  }, []);

  // ฟังก์ชัน handleChange สำหรับ input ทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ฟังก์ชันสำหรับการเปลี่ยนวันที่และเวลา
  const handleDateTimeChange = (fieldName, dateValue) => {
    setFormData({
      ...formData,
      [fieldName]: dayjs(dateValue).toJSON(),
    });
  };

  // ฟังก์ชันสำหรับการเลือกผู้รับแจ้งเตือน (รับค่าเป็น string)
  const handleRecipientsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { ...formData };

      // ถ้าเป็น "ทุกวัน" => แปลง dailyTime เป็น Date ที่ mongoose รับได้
      // สมมุติว่าใช้วันนี้เป็น base date + เวลา user เลือก
      if (payload.notificationMode === "ทุกวัน") {
        const [hours, minutes] = payload.dailyTime.split(":");
        const dateObj = dayjs()
          .hour(parseInt(hours, 10))
          .minute(parseInt(minutes, 10))
          .second(0)
          .millisecond(0);

        // แปลงเป็น ISO string เก็บใน notifyDate
        payload.notifyDate = dateObj.toISOString();
      } else {
        // "กำหนดวันสิ้นสุดแจ้งเตือน"
        payload.notifyDate = dayjs(payload.startDate).toISOString();
        payload.endDate = dayjs(payload.endDate).toISOString();
      }

      if (!payload.title) {
        toast.error("โปรดระบุหัวข้อแจ้งเตือน");
        return;
      }

      if (!payload.description) {
        toast.error("โปรดระบุรายละเอียด");
        return;
      }

      if (!payload.notifyDate) {
        toast.error("โปรดระบุวันที่และเวลา");
        return;
      }

      // Upload file ถ้ามี
      if (payload.file.file) {
        const fileModel = await uploadFile(formData.file.file);
        payload.file = {
          id: fileModel._id,
          name: fileModel.name,
          url: fileModel.url,
          size: fileModel.size,
        };
      }

      if (mode === "add") {
        await customFetch.post("/notifications", payload);
      } else {
        await customFetch.put(`/notifications/${existingNotiItem._id}`, payload);
      }

      toast.success("เพิ่มข้อมูลแจ้งเตือนเรียบร้อยแล้ว");
      return navigate("/dashboard/all-notification");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    } finally {
      setSubmitting(false);
    }
  };

  // รวม "ผู้ใช้ทั้งหมด" + รายชื่อผู้ใช้เป็น string ใน list เดียว
  const userList = [
    "ผู้ใช้ทั้งหมด",
    ...ptUsers.map((user) => `${user.name} ${user.surname}`),
  ];

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit} className="form">
        <h4 className="form-title">
          {mode === "add" ? "เพิ่ม" : "แก้ไข"}การแจ้งเตือน
        </h4>
        <div className="form-center">
          <InputText
            type="text"
            name="title"
            label="หัวข้อแจ้งเตือน"
            value={formData.title}
            onChange={handleChange}
          />
          <InputText
            type="text"
            name="description"
            label="รายละเอียด"
            value={formData.description}
            onChange={handleChange}
          />

          {/* เลือกว่าจะแจ้งเตือน "ทุกวัน" หรือ "กำหนดวันสิ้นสุดแจ้งเตือน" */}
          <SelectInput
            name="notificationMode"
            label="กำหนดช่วงเผยแพร่"
            value={formData.notificationMode}
            onChange={handleChange}
            list={["ทุกวัน", "กำหนดวันสิ้นสุดแจ้งเตือน"]}
          />

          {formData.notificationMode === "ทุกวัน" ? (
            // ถ้าเป็น "ทุกวัน" => เลือกเวลา
            <InputText
              type="time"
              name="dailyTime"
              label="เวลาแจ้งเตือนทุกวัน"
              value={formData.dailyTime}
              onChange={handleChange}
            />
          ) : (
            // ถ้าเป็น "กำหนดวันสิ้นสุดแจ้งเตือน" => เลือกวันเริ่มต้น / วันสิ้นสุด
            <>
              <DateTimePicker
                name="startDate"
                label="วันเริ่มต้นแจ้งเตือน"
                initValue={formData.startDate}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
              />
              <DateTimePicker
                name="endDate"
                label="วันสิ้นสุดแจ้งเตือน"
                initValue={formData.endDate}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
              />
            </>
          )}

          {/* ส่วนอื่น ๆ เหมือนเดิม */}
          <SelectInput
            name="recipients"
            label="ผู้รับแจ้งเตือน (เลือกผู้ใช้ทั้งหมดหรือรายบุคคล)"
            value={formData.recipients}
            onChange={handleRecipientsChange}
            // เพิ่ม "ผู้ใช้ทั้งหมด" เป็นตัวเลือกแรก
            list={userList}
          />
          <UploadFile
            name="file"
            label="ไฟล์แนบ"
            value={formData.file}
            onChange={handleChange}
          />
          <SelectInput
            name="notifyType"
            label="ประเภทการแจ้งเตือน"
            value={formData.notifyType}
            onChange={handleChange}
            list={Object.values(NOTIFY_TYPE)}
          />

          {/* ฟิลด์สำหรับผู้รับแจ้งเตือน (ptUsers) */}

        </div>
        <button
          type="submit"
          className="btn btn-block form-btn"
          disabled={submitting}
        >
          {submitting ? "กำลังบันทึกข้อมูล..." : "บันทึก"}
        </button>
      </Form>
    </Wrapper>
  );
};

export default AddNotification;








// import React, { useState, useMemo } from "react";
// import Wrapper from "../assets/wrappers/DashboardFormPage";
// import { NOTIFY_TARGET_GROUP, NOTIFY_TYPE } from "../../../utils/constants";
// import { Form, useNavigate, redirect, useLoaderData } from "react-router-dom";
// import { toast } from "react-toastify";
// import customFetch from "../utils/customFetch";
// import DateTimePicker from "../assets/components/common/DateTimePicker";
// import InputText from "../assets/components/common/InputText";
// import SelectInput from "../assets/components/common/SelectInput";
// import UploadFile, { uploadFile } from "../assets/components/common/UploadFile";
// import dayjs from "dayjs";

// export const loader = async ({ params }) => {
//   try {
//     const { _id } = params;
//     if (!_id) throw new Error("Invalid ID");
//     const { data } = await customFetch.get(`/notifications/${_id}`);
//     return data;
//   } catch (error) {
//     toast.error(error.response.data.msg);
//     return redirect("/dashboard/all-notification");
//   }
// };

// const AddNotification = () => {
//   const navigate = useNavigate();
//   const existingNotiItem = useLoaderData();
//   const mode = useMemo(
//     () => (existingNotiItem ? "edit" : "add"),
//     [existingNotiItem]
//   );

//   const [formData, setFormData] = useState({
//     title: mode === "edit" ? existingNotiItem.title : "",
//     description: mode === "edit" ? existingNotiItem.description : "",
//     notifyDate:
//       mode === "edit"
//         ? existingNotiItem.notifyDate
//         : dayjs().startOf("minute").toJSON(),
//     targetGroup:
//       mode === "edit" ? existingNotiItem.targetGroup : NOTIFY_TARGET_GROUP.ALL,
//     file: mode === "edit" ? existingNotiItem.file : {},
//     notifyType:
//       mode === "edit" ? existingNotiItem.notifyType : NOTIFY_TYPE.IMPORTANT,
//     isDaily:
//       mode === "edit" && existingNotiItem.notifyDate.startsWith("ทุกวัน:"),
//     dailyTime:
//       mode === "edit" && existingNotiItem.notifyDate.startsWith("ทุกวัน:")
//         ? existingNotiItem.notifyDate.split(":")[1]
//         : "00:00",
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleDateTimeChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: dayjs(value).toJSON(),
//     }));
//   };

//   const handleDailyToggle = (e) => {
//     const checked = e.target.checked;
//     setFormData((prev) => ({
//       ...prev,
//       isDaily: checked,
//     }));
//   };

//   const handleTimeChange = (e) => {
//     const time = e.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       dailyTime: time,
//       notifyDate: `ทุกวัน:${time}`,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const payload = { ...formData };

//       if (!payload.title) {
//         toast.error("โปรดระบุหัวข้อแจ้งเตือน");
//         return;
//       }

//       if (!payload.description) {
//         toast.error("โปรดระบุรายละเอียด");
//         return;
//       }

//       if (!payload.notifyDate) {
//         toast.error("โปรดระบุวันที่และเวลา");
//         return;
//       }

//       if (payload.file.file) {
//         const fileModel = await uploadFile(payload.file.file);
//         payload.file = {
//           id: fileModel._id,
//           name: fileModel.name,
//           url: fileModel.url,
//           size: fileModel.size,
//         };
//       }

//       if (mode === "add") {
//         await customFetch.post("/notifications", payload);
//       } else {
//         await customFetch.put(
//           `/notifications/${existingNotiItem._id}`,
//           payload
//         );
//       }

//       toast.success("เพิ่มข้อมูลแจ้งเตือนเรียบร้อยแล้ว");
//       navigate("/dashboard/all-notification");
//     } catch (error) {
//       toast.error(error?.response?.data?.msg || "เกิดข้อผิดพลาด");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Wrapper>
//       <Form onSubmit={handleSubmit} className="form">
//         <h4 className="form-title">
//           {mode === "add" ? "เพิ่ม" : "แก้ไข"}การแจ้งเตือน
//         </h4>
//         <div className="form-center">
//           <InputText
//             type="text"
//             name="title"
//             label="หัวข้อแจ้งเตือน"
//             value={formData.title}
//             onChange={handleChange}
//           />
//           <InputText
//             type="text"
//             name="description"
//             label="รายละเอียด"
//             value={formData.description}
//             onChange={handleChange}
//           />
//           <DateTimePicker
//             name="notifyDate"
//             label="กำหนดวันที่และเวลา"
//             initValue={formData.notifyDate}
//             isDaily={formData.isDaily}
//             dailyTime={formData.dailyTime}
//             onChange={handleDateTimeChange}
//             handleDailyToggle={handleDailyToggle}
//             handleTimeChange={handleTimeChange}
//           />
//           <SelectInput
//             name="targetGroup"
//             label="ผู้รับแจ้งเตือน"
//             value={formData.targetGroup}
//             onChange={handleChange}
//             list={Object.values(NOTIFY_TARGET_GROUP)}
//           />
//           <UploadFile
//             name="file"
//             label="ไฟล์แนบ"
//             value={formData.file}
//             onChange={handleChange}
//           />
//           <SelectInput
//             name="notifyType"
//             label="ประเภทการแจ้งเตือน"
//             value={formData.notifyType}
//             onChange={handleChange}
//             list={Object.values(NOTIFY_TYPE)}
//           />
//         </div>
//         <button
//           type="submit"
//           className="btn btn-block form-btn"
//           disabled={submitting}
//         >
//           {submitting ? "กำลังบันทึกข้อมูล..." : "บันทึก"}
//         </button>
//       </Form>
//     </Wrapper>
//   );
// };

// export default AddNotification;


