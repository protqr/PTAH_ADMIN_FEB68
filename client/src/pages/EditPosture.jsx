import React, { useState } from 'react';
import { FormRow, FormRowSelect } from '../assets/components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData } from 'react-router-dom';
import { TYPEPOSTURES } from '../../../utils/constants';
import { Form, useNavigate, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";

export const loader = async ({ params }) => {
  try {
    const { _id } = params;
    if (!_id) {
      throw new Error('Invalid ID');
    }
    const { data } = await customFetch.get(`/postures/${_id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.msg);
    return redirect('/dashboard/all-posture');
  }
};

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

export const action = async ({ request, params }) => {
  const { _id } = params;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    if (!_id) {
      throw new Error('Invalid ID');
    }

    // Handle existing URLs
    data.imageUrls = data.imageUrls ? data.imageUrls.split(',').filter(url => url.trim() !== '') : [];
    data.videoUrls = data.videoUrls ? data.videoUrls.split(',').filter(url => url.trim() !== '') : [];

    // Handle new files
    const newImageFiles = formData.getAll('newImageUrls').filter(file => file.size > 0);
    const newVideoFiles = formData.getAll('newVideoUrls').filter(file => file.size > 0);

    // Upload new files
    const newImageUrls = await uploadFilesToFirebase(newImageFiles, `postures/${_id}/images`);
    const newVideoUrls = await uploadFilesToFirebase(newVideoFiles, `postures/${_id}/videos`);

    // Combine existing and new URLs
    data.imageUrls = [...data.imageUrls, ...newImageUrls];
    data.videoUrls = [...data.videoUrls, ...newVideoUrls];

    // Convert isEvaluate from Thai string to boolean
    data.isEvaluate = data.isEvaluate === "ประเมิน";

    console.log("Data being sent to server:", data);

    await customFetch.patch(`/postures/${_id}`, data);
    toast.success('แก้ไขข้อมูลท่ากายภาพเรียบร้อยแล้ว');
    return redirect('/dashboard/all-posture');
  } catch (error) {
    console.error("Error in action:", error);
    toast.error(error?.response?.data?.msg || "An error occurred");
    return error;
  }
};

const EditPosture = () => {
  const { posture } = useLoaderData();
  const navigation = useNavigate();
  const isSubmitting = navigation.state === 'submitting';
  const [selectedUserType, setSelectedUserType] = useState(posture.userType || '');
  const [imageUrls, setImageUrls] = useState(posture.imageUrls || []);
  const [videoUrls, setVideoUrls] = useState(posture.videoUrls || []);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newVideoFiles, setNewVideoFiles] = useState([]);
  const [isEvaluate, setIsEvaluate] = useState(posture.isEvaluate ? "ประเมิน" : "ไม่ประเมิน");

  const handleUserTypeChange = (event) => {
    setSelectedUserType(event.target.value);
  };

  const handleIsEvaluateChange = (event) => {
    setIsEvaluate(event.target.value);
  };

  const removeFile = (index, isImage) => {
    if (isImage) {
      setImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideoUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e, setFiles) => {
    const files = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...files]);
  };

  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">แก้ไขข้อมูลท่ากายภาพ</h4>
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
            defaultValue={posture.noPostures}
          />

          <FormRow
            type="text"
            name="namePostures"
            labelText="ชื่อท่ากายภาพ"
            defaultValue={posture.namePostures}
          />

          {/* Replace text input with radio buttons for isEvaluate */}
          <div className="form-row">
            <label className="form-label required">การประเมิน</label>
            <div className="radio-group evaluate-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="isEvaluate"
                  value="ประเมิน"
                  className="radio-input"
                  checked={isEvaluate === "ประเมิน"}
                  onChange={handleIsEvaluateChange}
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
                  checked={isEvaluate === "ไม่ประเมิน"}
                  onChange={handleIsEvaluateChange}
                />
                <span className="radio-custom" />
                <span className="radio-text">ไม่ประเมิน</span>
              </label>
            </div>
          </div>

          <input type="hidden" name="imageUrls" value={imageUrls.join(",")} />
          <input type="hidden" name="videoUrls" value={videoUrls.join(",")} />

          <div className="form-row">
            <label className="form-label">รูปภาพ</label>
            <input
              type="file"
              name="newImageUrls"
              onChange={(e) => handleFileChange(e, setNewImageFiles)}
              accept="image/*"
              multiple
            />
            <div className="image-previews">
              {imageUrls.map((url, index) => (
                <div key={`image-${index}`} className="preview-container">
                  <img src={url} alt={`Image ${index}`} className="thumbnail" />
                  <button
                    type="button"
                    onClick={() => removeFile(index, true)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {newImageFiles.map((file, index) => (
                <div key={`new-image-${index}`} className="preview-container">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New Image ${index}`}
                    className="thumbnail"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">วิดีโอ</label>
            <input
              type="file"
              name="newVideoUrls"
              onChange={(e) => handleFileChange(e, setNewVideoFiles)}
              accept="video/*"
              multiple
            />
            <div className="video-previews">
              {videoUrls.map((url, index) => (
                <div key={`video-${index}`} className="preview-container">
                  <video src={url} className="thumbnail-video" controls />
                  <button
                    type="button"
                    onClick={() => removeFile(index, false)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {newVideoFiles.map((file, index) => (
                <div key={`new-video-${index}`} className="preview-container">
                  <video
                    src={URL.createObjectURL(file)}
                    className="thumbnail-video"
                    controls
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "submitting..." : "submit"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditPosture;