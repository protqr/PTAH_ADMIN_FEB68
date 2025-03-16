import { useState } from "react";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, redirect, useNavigation } from "react-router-dom";
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

export const action = async ({ request }) => {
    try {
        const formData = await request.formData();

        const missionName = formData.get("name");
        const subMissionName = formData.get("subName");
        const noString = formData.get("no");
        const isEvaluateText = formData.get("isEvaluate");

        const imageFile = formData.get("imageUrl");
        const videoFile = formData.get("videoUrl");

        const imageUrl = imageFile && imageFile.size > 0 ? await uploadFileToFirebase(imageFile, `missions/${noString}/images`) : "";
        const videoUrl = videoFile && videoFile.size > 0 ? await uploadFileToFirebase(videoFile, `missions/${noString}/videos`) : "";

        const isEvaluated = isEvaluateText === "ประเมิน";
        const submission = {
            subName: subMissionName,
            evaluate: isEvaluated,
            imageUrl,
            videoUrl,
        };

        const missionData = {
            no: noString || 0,
            name: missionName,
            isEvaluate: isEvaluated,
            submissionsData: submission
        };

        await customFetch.post("/missions", missionData);
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

    return (
        <Wrapper>
            <Form method="post" className="form" encType="multipart/form-data">
                <h4 className="form-title">เพิ่มด่านกายภาพ / Mission</h4>
                <div className="form-center">
                    <div className="form-row">
                        <label htmlFor="no" className="form-label required">ด่านที่</label>
                        <input type="text" id="no" name="no" value={model.no} className="form-input" placeholder="กรุณาระบุชื่อภารกิจ" required />
                    </div>

                    <div className="form-row">
                        <label htmlFor="name" className="form-label required">ชื่อภารกิจ</label>
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

                    <button type="submit" className="btn btn-block form-btn submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                    </button>
                </div>
            </Form>
        </Wrapper>
    );
};

export default AddPosture;
