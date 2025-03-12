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

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  
  try {
    // Check if we're in edit mode by looking for an ID in the URL params or form data
    const idFromParams = params?._id;
    const idFromForm = formData.get("_id");
    const isEditMode = idFromParams || idFromForm;
    
    // Get the targetGroup value
    const targetGroupValue = formData.get("targetGroup");
    
    // Build the payload with all required fields
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      targetGroup: targetGroupValue, // Use the targetGroup value directly (either standard group or user name)
      notifyType: formData.get("notifyType") || "IMPORTANT", // Default to IMPORTANT if not provided
      notificationMode: formData.get("notificationMode") || "ทุกวัน",
    };

    // If recipients field is present, include it in the payload
    const recipients = formData.get("recipients");
    if (recipients) {
      payload.recipients = recipients;
    }

    // Validation
    if (!payload.title) {
      toast.error("โปรดระบุหัวข้อแจ้งเตือน");
      return null;
    }

    if (!payload.description) {
      toast.error("โปรดระบุรายละเอียด");
      return null;
    }

    // Handle notification mode and dates
    if (payload.notificationMode === "ทุกวัน") {
      const dailyTime = formData.get("dailyTime") || "00:00";
      const [hours, minutes] = dailyTime.split(":");
      const dateObj = dayjs()
        .hour(parseInt(hours, 10))
        .minute(parseInt(minutes, 10))
        .second(0)
        .millisecond(0);
      payload.notifyDate = dateObj.toISOString();
    } else {
      const startDate = formData.get("startDate");
      const endDate = formData.get("endDate");
      payload.notifyDate = startDate ? dayjs(startDate).toISOString() : dayjs().toISOString();
      payload.endDate = endDate ? dayjs(endDate).toISOString() : dayjs().add(1, "day").toISOString();
    }

    // Handle file upload if present
    const fileInput = formData.get("file");
    if (fileInput && fileInput.size > 0) {
      const fileModel = await uploadFile(fileInput);
      payload.file = {
        id: fileModel._id,
        name: fileModel.name,
        url: fileModel.url,
        size: fileModel.size,
      };
    } else if (formData.get("existingFile")) {
      // If there's an existing file and no new file uploaded, keep the existing file
      payload.file = JSON.parse(formData.get("existingFile"));
    }

    console.log("Submitting payload:", payload);

    // Make the API request
    if (isEditMode) {
      const id = idFromParams || idFromForm;
      console.log("Updating notification with ID:", id);
      console.log("Payload:", JSON.stringify(payload, null, 2));
      await customFetch.put(`/notifications/${id}`, payload);
      toast.success("แก้ไขข้อมูลแจ้งเตือนเรียบร้อยแล้ว");
    } else {
      console.log("Creating new notification");
      console.log("Payload:", JSON.stringify(payload, null, 2));
      await customFetch.post("/notifications", payload);
      toast.success("เพิ่มข้อมูลแจ้งเตือนเรียบร้อยแล้ว");
    }

    return redirect("/dashboard/all-notification");
  } catch (error) {
    console.error("Error in notification action:", error);
    toast.error(error?.response?.data?.msg || "เกิดข้อผิดพลาด");
    return null;
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
  const [formData, setFormData] = useState(() => {
    // Default values for new notification
    const defaults = {
      title: "",
      description: "",
      notifyDate: dayjs().startOf("minute").toJSON(),
      targetGroup: NOTIFY_TARGET_GROUP.ALL,
      file: {},
      notifyType: NOTIFY_TYPE.IMPORTANT,
      notificationMode: "ทุกวัน",
      dailyTime: dayjs().format("HH:mm"),
      startDate: dayjs().toJSON(),
      endDate: dayjs().add(1, "day").toJSON(),
      recipients: null,
      targetDisplayName: null
    };

    // If in edit mode, use existing notification data
    if (mode === "edit" && existingNotiItem) {
      // For backward compatibility: if targetGroup is SPECIFIC_USER, we need to find the user name
      let targetGroup = existingNotiItem.targetGroup;
      let targetDisplayName = null;
      
      // If we have recipients and the targetGroup is SPECIFIC_USER, try to find the user name
      if (existingNotiItem.recipients && existingNotiItem.targetGroup === 'SPECIFIC_USER') {
        // We'll set targetDisplayName to null for now and let getSelectedTargetValue handle it
        // once ptUsers are loaded
        targetDisplayName = null;
      }
      
      return {
        title: existingNotiItem.title || defaults.title,
        description: existingNotiItem.description || defaults.description,
        notifyDate: existingNotiItem.notifyDate || defaults.notifyDate,
        targetGroup: targetGroup || defaults.targetGroup,
        file: existingNotiItem.file || defaults.file,
        notifyType: existingNotiItem.notifyType || defaults.notifyType,
        notificationMode: existingNotiItem.notificationMode || defaults.notificationMode,
        dailyTime: existingNotiItem.dailyTime || defaults.dailyTime,
        startDate: existingNotiItem.startDate || defaults.startDate,
        endDate: existingNotiItem.endDate || defaults.endDate,
        recipients: existingNotiItem.recipients || defaults.recipients,
        targetDisplayName: targetDisplayName
      };
    }

    return defaults;
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

  // รวม target groups และรายชื่อผู้ใช้เป็น list เดียว
  const combinedTargetList = useMemo(() => {
    // Add the standard target groups first
    const list = [...Object.values(NOTIFY_TARGET_GROUP)];
    
    // Then add individual users with just their names (no USER: prefix)
    if (ptUsers && ptUsers.length > 0) {
      ptUsers.forEach(user => {
        list.push(`${user.name} ${user.surname}`);
      });
    }
    
    return list;
  }, [ptUsers]);

  // ฟังก์ชันสำหรับการเลือกกลุ่มเป้าหมาย/ผู้รับแจ้งเตือน
  const handleTargetChange = (e) => {
    const { value } = e.target;
    
    // Check if the selected value is a standard target group
    if (Object.values(NOTIFY_TARGET_GROUP).includes(value)) {
      // If a standard target group is selected
      setFormData({
        ...formData,
        targetGroup: value,
        recipients: null,
        targetDisplayName: null
      });
    } else {
      // If a user name is selected, find the corresponding user
      const selectedUser = ptUsers.find(user => `${user.name} ${user.surname}` === value);
      if (selectedUser) {
        setFormData({
          ...formData,
          targetGroup: value, // Store the user's name directly in targetGroup
          recipients: selectedUser._id,
          targetDisplayName: value
        });
      }
    }
  };

  // ฟังก์ชันสำหรับแสดงค่าที่เลือกในกลุ่มเป้าหมาย
  const getSelectedTargetValue = () => {
    // If we have a recipient ID, try to find the corresponding user
    if (formData.recipients) {
      // If we already have a display name, use it
      if (formData.targetDisplayName) {
        return formData.targetDisplayName;
      }
      
      // Otherwise find the user in ptUsers
      const user = ptUsers.find(u => u._id === formData.recipients);
      if (user) {
        return `${user.name} ${user.surname}`;
      }
    }
    
    // For standard target groups or if no recipient is found
    return formData.targetGroup;
  };

  return (
    <Wrapper>
      <Form 
        method={mode === "edit" ? "PUT" : "POST"}
        className="form"
        encType="multipart/form-data"
      >
        {/* If in edit mode, include the ID as a hidden field */}
        {mode === "edit" && (
          <>
            <input 
              type="hidden" 
              name="_id" 
              value={existingNotiItem._id} 
            />
            {existingNotiItem.file && Object.keys(existingNotiItem.file).length > 0 && (
              <input 
                type="hidden" 
                name="existingFile" 
                value={JSON.stringify(existingNotiItem.file)} 
              />
            )}
          </>
        )}
        
        {/* Hidden input for recipients ID when a specific user is selected */}
        {formData.targetGroup === 'SPECIFIC_USER' && formData.recipients && (
          <input 
            type="hidden" 
            name="recipients" 
            value={formData.recipients} 
          />
        )}
        
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
            name="targetGroup"
            label="กลุ่มเป้าหมาย / ผู้รับแจ้งเตือน"
            value={getSelectedTargetValue()}
            onChange={handleTargetChange}
            list={combinedTargetList}
            required
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
            required
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


