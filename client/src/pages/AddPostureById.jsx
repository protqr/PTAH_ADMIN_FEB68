import { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, redirect, useNavigation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";

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

export const action = async ({ request, params }) => {
  try {
    const { _id } = params;
    const formData = await request.formData();

    const missionName = formData.get("name");
    const noString = formData.get("no");
    const isEvaluateText = formData.get("isEvaluate");

    const imageFile = formData.get("imageUrl");
    const videoFile = formData.get("videoUrl");

    const imageUrl = imageFile && imageFile.size > 0 ? await uploadFileToFirebase(imageFile, `missions/${noString}/images`) : "";
    const videoUrl = videoFile && videoFile.size > 0 ? await uploadFileToFirebase(videoFile, `missions/${noString}/videos`) : "";

    const isEvaluated = isEvaluateText === "ประเมิน";
    const submission = {
      name: missionName,
      evaluate: isEvaluated,
      imageUrl,
      videoUrl,
    };

    const missionData = {
      id: _id,
      submissionsData: submission
    };

    await customFetch.post("/missions/create-with-sub", missionData);
    toast.success("สร้างท่ากายภาพ/mission เรียบร้อยแล้ว");
    return redirect("/dashboard/all-posture");
  } catch (error) {
    console.error("Error in action:", error);
    toast.error(error?.response?.data?.msg || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    return null;
  }
};

const AddPostureById = () => {
  const { _id } = useParams();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [model, setModel] = useState([]);

  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await customFetch.get(`/missions/${_id}`);
        const { mission } = response.data;
        setModel(mission);
      } catch (error) {
        console.error("Error fetching mission:", error);
      }
    };

    if (_id) {
      fetchMission();
    }
  }, [_id]);

  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">เพิ่มท่ากายภาพ / Mission</h4>
        <div className="form-center">
          <div className="form-row">
            <label htmlFor="name" className="form-label required">ด่านที่</label>
            <input type="text" id="name" name="name" disabled value={model.no} className="form-input" placeholder="กรุณาระบุชื่อภารกิจ" required />
          </div>

          <div className="form-row">
            <label htmlFor="postureType" className="form-label required">ประเภทของท่า</label>
            <select disabled id="postureType" name="postureType" className="form-select" required>
              <option>{model.name}</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="name" className="form-label required">ชื่อภารกิจ (Submission)</label>
            <input type="text" id="name" name="name" className="form-input" placeholder="กรุณาระบุชื่อภารกิจ" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-700">การประเมิน</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="isEvaluate" value="ประเมิน" className="hidden peer" checked={model.isEvaluate === true} onChange={() => setModel({ ...model, isEvaluate: true })} required />
                <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-blue-500">
                  <div className="w-3 h-3 bg-blue-500 rounded-full peer-checked:scale-100 scale-0 transition-transform"></div>
                </div>
                <span className="text-gray-700 peer-checked:text-blue-600">ประเมิน</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="isEvaluate" value="ไม่ประเมิน" className="hidden peer" checked={model.isEvaluate === false} onChange={() => setModel({ ...model, isEvaluate: false })} />
                <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-red-500">
                  <div className="w-3 h-3 bg-red-500 rounded-full peer-checked:scale-100 scale-0 transition-transform"></div>
                </div>
                <span className="text-gray-700 peer-checked:text-red-600">ไม่ประเมิน</span>
              </label>
            </div>
          </div>


          <div className="space-y-6">
            {/* รูปภาพประกอบ */}
            <div className="flex flex-col gap-2">
              <label htmlFor="imageUrl" className="text-lg font-semibold text-gray-700">
                รูปภาพประกอบ
              </label>
              <label className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-gray-600">เลือกไฟล์รูปภาพ</span>
              </label>
              {imagePreview && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full max-w-xs rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* วิดีโอสาธิต */}
            <div className="flex flex-col gap-2">
              <label htmlFor="videoUrl" className="text-lg font-semibold text-gray-700">
                วิดีโอสาธิต
              </label>
              <label className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="file"
                  id="videoUrl"
                  name="videoUrl"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                <span className="text-gray-600">เลือกไฟล์วิดีโอ</span>
              </label>
              {videoPreview && (
                <div className="mt-2 flex justify-center">
                  <video
                    src={videoPreview}
                    className="w-full max-w-md rounded-lg border border-gray-300 shadow-sm"
                    controls
                  />
                </div>
              )}
            </div>
          </div>



          <button type="submit" className="btn btn-block form-btn submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddPostureById;
