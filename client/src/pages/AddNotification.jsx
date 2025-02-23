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
import DateTimePicker from "../assets/components/common/DateTimePicker"
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
  const mode = useMemo(() => existingNotiItem !== undefined ? "edit" : "add", [existingNotiItem])

  const [formData, setFormData] = useState({
    title: mode === "edit" ? existingNotiItem.title : "",
    description: mode === "edit" ? existingNotiItem.description : "",
    notifyDate: mode === "edit" ? existingNotiItem.notifyDate : dayjs().startOf('minute').toJSON(),
    targetGroup: mode === "edit" ? existingNotiItem.targetGroup : NOTIFY_TARGET_GROUP.ALL,
    file: mode === "edit" ? existingNotiItem.file : {},
    notifyType: mode === "edit" ? existingNotiItem.notifyType : NOTIFY_TYPE.IMPORTANT,
  });
  const [submitting, setSubmitting] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)

    try {

      const payload = { ...formData }

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

      // Upload file
      if (payload.file.file) {
        const fileModel = await uploadFile(formData.file.file)
        payload.file = {
          id: fileModel._id,
          name: fileModel.name,
          url: fileModel.url,
          size: fileModel.size,
        }
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
      setSubmitting(false)
    }
  };


  return (
    <Wrapper>
      <Form onSubmit={handleSubmit} className="form">
        <h4 className="form-title">{mode === "add" ? "เพิ่ม" : "แก้ไข"}การแจ้งเตือน</h4>
        <div className="form-center">
          <InputText type="text" name="title" label="หัวข้อแจ้งเตือน" value={formData.title} onChange={handleChange} />
          <InputText type="text" name="description" label="รายละเอียด" value={formData.description} onChange={handleChange} />
          <DateTimePicker name="notifyDate" label="กำหนดวันที่และเวลา" initValue={formData.notifyDate} onChange={handleChange} />
          <SelectInput name="targetGroup" label="ผู้รับแจ้งเตือน" value={formData.targetGroup} onChange={handleChange}
            list={Object.values(NOTIFY_TARGET_GROUP)}
          />
          <UploadFile name="file" label="ไฟล์แนบ" value={formData.file} onChange={handleChange} />
          <SelectInput name="notifyType" label="ประเภทการแจ้งเตือน" value={formData.notifyType} onChange={handleChange}
            list={Object.values(NOTIFY_TYPE)}
          />
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


