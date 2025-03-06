import React, { useState } from "react";
import { FormRow, FormRowSelect, FormRowRadioButton } from "../assets/components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { TYPEPOSTURES } from "../../../utils/constants";
import {
  Form,
  redirect,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";

const uploadFilesToFirebase = async (files, path) => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const storageRef = ref(storage, `${path}/${index}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error in uploadFilesToFirebase:", error);
    throw error;
  }
};

export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const noPostures = formData.get("noPostures");

    // Validate noPostures is a number
    if (!/^[0-9]+$/.test(noPostures)) {
      toast.error("หมายเลขท่าต้องเป็นตัวเลขเท่านั้น");
      return null;
    }

    const imageFiles = formData
      .getAll("imageUrls")
      .filter((file) => file instanceof File && file.size > 0);
    const videoFiles = formData
      .getAll("videoUrls")
      .filter((file) => file instanceof File && file.size > 0);

    const imageUrls = await uploadFilesToFirebase(
      imageFiles,
      `postures/${noPostures}/images`
    );
    const videoUrls = await uploadFilesToFirebase(
      videoFiles,
      `postures/${noPostures}/videos`
    );

    const postureData = {
      noPostures: formData.get("noPostures"),
      namePostures: formData.get("namePostures"),
      isEvaluate: formData.get("isEvaluate"),
      userType: formData.get("userType"),
      imageUrls,
      videoUrls,
    };

    console.log("Posture data being sent to server:", postureData);

    const response = await customFetch.post("/postures", postureData);
    console.log("Server response:", response.data);

    toast.success("เพิ่มข้อมูลท่ากายภาพเรียบร้อยแล้ว");
    return redirect("/dashboard/all-posture");
  } catch (error) {
    console.error("Error in action function:", error);
    toast.error(
      error?.response?.data?.msg || "An error occurred. Please try again."
    );
    return error;
  }
};

const AddPosture = () => {
  const { user } = useOutletContext();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [selectedUserType, setSelectedUserType] = useState(TYPEPOSTURES.TYPE_1);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  const handleUserTypeChange = (event) => {
    setSelectedUserType(event.target.value);
  };

  const handleFileChange = (e, setFiles, setPreviews) => {
    const files = Array.from(e.target.files).filter((file) => file.size > 0);
    setFiles((prevFiles) => [...prevFiles, ...files]);

    const previewPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((newPreviews) =>
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
    );
  };

  const removeFile = (index, files, setFiles, setPreviews) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">เพิ่มท่ากายภาพ</h4>
        <div className="form-center">
          <FormRowSelect
            labelText="ชื่อประเภทของท่ากายภาพบำบัด"
            name="userType"
            value={selectedUserType}
            onChange={handleUserTypeChange}
            list={Object.values(TYPEPOSTURES)}
          />

          <FormRow
            type="text"
            name="noPostures"
            labelText="ด่านที่"
            pattern="[0-9]*"
          />

          <FormRow type="text" name="namePostures" labelText="ชื่อท่ากายภาพ" />

          <FormRow type="textarea" name="isEvaluate" labelText="ด่านนี้มีการประเมินไหม?" />

          <div className="form-row">
            <label htmlFor="images" className="form-label">
              รูปภาพ
            </label>
            <input
              type="file"
              id="images"
              name="imageUrls"
              onChange={(e) =>
                handleFileChange(e, setImageFiles, setImagePreviews)
              }
              accept="image/*"
              multiple
            />
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="preview-container">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="thumbnail"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeFile(
                        index,
                        imageFiles,
                        setImageFiles,
                        setImagePreviews
                      )
                    }
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="videos" className="form-label">
              วิดีโอ
            </label>
            <input
              type="file"
              id="videos"
              name="videoUrls"
              onChange={(e) =>
                handleFileChange(e, setVideoFiles, setVideoPreviews)
              }
              accept="video/*"
              multiple
            />
            <div className="video-previews">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="preview-container">
                  <video src={preview} className="thumbnail-video" controls />
                  <button
                    type="button"
                    onClick={() =>
                      removeFile(
                        index,
                        videoFiles,
                        setVideoFiles,
                        setVideoPreviews
                      )
                    }
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังส่ง..." : "ส่ง"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddPosture;
