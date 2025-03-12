import React, { useState } from "react";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, redirect, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";
import { TYPEPOSTURES } from "../../../utils/constants";

// ฟังก์ชันอัปโหลดไฟล์เดี่ยวไปยัง Firebase
const uploadFileToFirebase = async (file, path) => {
  if (!file) return "";
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading to Firebase:", error);
    throw error;
  }
};

// Action ที่จะถูกเรียกเมื่อกด "ส่งข้อมูล"
export const action = async ({ request }) => {
  try {
    const formData = await request.formData();

    const postureType = formData.get("postureType");     // ประเภทของท่า (จาก dropdown)
    const missionName = formData.get("name");          // ชื่อภารกิจ (สำหรับ Submission)
    const noString = formData.get("no");               // ด่านที่ (1..5)
    const isEvaluateText = formData.get("isEvaluate"); // "ประเมิน" หรือ "ไม่ประเมิน"

    console.log("isEvaluateText:", isEvaluateText);
    console.log("isEvaluateText === 'ประเมิน':", isEvaluateText === "ประเมิน");

    // Handle file uploads
    const imageFile = formData.get("imageUrl");
    const videoFile = formData.get("videoUrl");

    const imageUrl = imageFile && imageFile.size > 0
      ? await uploadFileToFirebase(imageFile, `missions/${noString}/images`)
      : "";
    const videoUrl = videoFile && videoFile.size > 0
      ? await uploadFileToFirebase(videoFile, `missions/${noString}/videos`)
      : "";

    // Prepare submission data
    const isEvaluated = isEvaluateText === "ประเมิน";
    const submission = {
      name: missionName,
      postureType,
      evaluate: isEvaluated,
      imageUrl,
      videoUrl,
    };

    // Prepare mission data with submission
    const missionData = {
      no: noString,
      name: postureType,
      isEvaluate: isEvaluated,
      submissionsData: [submission] // This will be used to create the submission
    };

    console.log("Submission data:", submission);
    console.log("Mission data:", missionData);

    // Create both mission and submission using the combined endpoint
    const response = await customFetch.post("/missions/create-with-sub", missionData);
    console.log("Server response:", response.data);
    
    toast.success("สร้างท่ากายภาพ/mission เรียบร้อยแล้ว");
    return redirect("/dashboard/all-posture");
  } catch (error) {
    console.error("Error in action:", error);
    toast.error(error?.response?.data?.msg || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    return null;
  }
};

const AddPosture = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  // แสดงตัวอย่างรูป
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // แสดงตัวอย่างวิดีโอ
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">เพิ่มท่ากายภาพ / Mission</h4>
        
        <div className="form-center">
          {/* ประเภทของท่า (First field) */}
          <div className="form-row">
            <label htmlFor="postureType" className="form-label required">
              ประเภทของท่า
            </label>
            <select 
              id="postureType" 
              name="postureType" 
              className="form-select"
              required
            >
              <option value="">-- เลือกประเภทของท่า --</option>
              {Object.values(TYPEPOSTURES).map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* ชื่อภารกิจ */}
          <div className="form-row">
            <label htmlFor="name" className="form-label required">
              ชื่อภารกิจ (Submission)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="กรุณาระบุชื่อภารกิจ"
              required
            />
          </div>

          {/* ด่านที่ */}
          <div className="form-row">
            <label className="form-label required">ด่านที่</label>
            <div className="radio-group stage-group">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="radio-label stage-label">
                  <input
                    type="radio"
                    name="no"
                    value={num}
                    className="radio-input"
                    required
                  />
                  <span className="radio-custom" />
                  <span className="radio-text">ด่านที่ {num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* การประเมิน */}
          <div className="form-row">
            <label className="form-label required">การประเมิน</label>
            <div className="radio-group evaluate-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="isEvaluate"
                  value="ประเมิน"
                  className="radio-input"
                  required
                />
                <span className="radio-custom" />
                <span className="radio-text">ประเมิน</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isEvaluate"
                  value="ไม่ประเมิน"
                  className="radio-input"
                />
                <span className="radio-custom" />
                <span className="radio-text">ไม่ประเมิน</span>
              </label>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="media-section">
            {/* รูปภาพ */}
            <div className="form-row">
              <label htmlFor="imageUrl" className="form-label">
                รูปภาพประกอบ
                <span className="optional-text">(ไม่บังคับ)</span>
              </label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-file-input"
                />
                {imagePreview && (
                  <div className="preview-container">
                    <img src={imagePreview} alt="preview" className="preview-image" />
                  </div>
                )}
              </div>
            </div>

            {/* วิดีโอ */}
            <div className="form-row">
              <label htmlFor="videoUrl" className="form-label">
                วิดีโอสาธิต
                <span className="optional-text">(ไม่บังคับ)</span>
              </label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="videoUrl"
                  name="videoUrl"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="form-file-input"
                />
                {videoPreview && (
                  <div className="preview-container">
                    <video 
                      src={videoPreview} 
                      className="preview-video" 
                      controls
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-block form-btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddPosture;
