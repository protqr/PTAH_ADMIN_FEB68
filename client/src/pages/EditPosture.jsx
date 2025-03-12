import React, { useState } from 'react';
import { FormRow } from '../assets/components';
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
    const { data } = await customFetch.get(`/missions/${_id}`);
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

    // Prepare mission data (removed type field)
    const missionData = {
      name: data.name,
      no: data.no,
      isEvaluate: data.isEvaluate === "ประเมิน"
    };

    // Prepare submissions data
    const submissionUpdates = formData.getAll('submissionIds').map((id, index) => ({
      _id: id,
      name: formData.getAll('submissionNames')[index],
      evaluate: formData.getAll('submissionEvaluates')[index] === "true",
      imageUrl: formData.getAll('submissionImageUrls')[index] || "",
      videoUrl: formData.getAll('submissionVideoUrls')[index] || ""
    }));

    // Handle new files for each submission
    for (let i = 0; i < submissionUpdates.length; i++) {
      const submissionId = submissionUpdates[i]._id;
      const newImages = formData.getAll(`newImageUrls_${submissionId}`).filter(file => file.size > 0);
      const newVideos = formData.getAll(`newVideoUrls_${submissionId}`).filter(file => file.size > 0);

      if (newImages.length > 0) {
        const newImageUrls = await uploadFilesToFirebase(newImages, `missions/${_id}/submissions/${submissionId}/images`);
        submissionUpdates[i].imageUrl = newImageUrls[0];
      }

      if (newVideos.length > 0) {
        const newVideoUrls = await uploadFilesToFirebase(newVideos, `missions/${_id}/submissions/${submissionId}/videos`);
        submissionUpdates[i].videoUrl = newVideoUrls[0];
      }
    }

    // Update mission and submissions
    await customFetch.patch(`/missions/${_id}`, {
      ...missionData,
      submissionUpdates
    });

    toast.success('แก้ไขข้อมูลภารกิจและท่าเรียบร้อยแล้ว');
    return redirect('/dashboard/all-posture');
  } catch (error) {
    console.error("Error in action:", error);
    toast.error(error?.response?.data?.msg || "An error occurred");
    return error;
  }
};

const EditPosture = () => {
  const { mission } = useLoaderData();
  const navigation = useNavigate();
  const isSubmitting = navigation.state === 'submitting';
  const [isEvaluate, setIsEvaluate] = useState(mission.isEvaluate ? "ประเมิน" : "ไม่ประเมิน");
  const [submissions, setSubmissions] = useState(mission.submission || []);

  const handleIsEvaluateChange = (event) => {
    setIsEvaluate(event.target.value);
  };

  const handleSubmissionChange = (index, field, value) => {
    const updatedSubmissions = [...submissions];
    updatedSubmissions[index] = { ...updatedSubmissions[index], [field]: value };
    setSubmissions(updatedSubmissions);
  };

  const handleFileChange = (submissionId, type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview will be handled by the existing preview elements
    const submission = submissions.find(s => s._id === submissionId);
    if (submission) {
      handleSubmissionChange(
        submissions.indexOf(submission),
        type === 'image' ? 'imageUrl' : 'videoUrl',
        URL.createObjectURL(file)
      );
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <div className="mission-section">
          <h4 className="form-title">แก้ไขข้อมูลภารกิจ</h4>
          <div className="form-center">
            {/* Mission Fields */}
            <div className="mission-fields" style={{ 
              backgroundColor: 'var(--background-secondary-color)',
              padding: '2rem',
              borderRadius: 'var(--border-radius)',
              marginBottom: '2rem'
            }}>
              <h5 style={{ marginBottom: '1.5rem', color: 'var(--primary-500)' }}>ข้อมูลภารกิจ</h5>

              <FormRow
                type="text"
                name="name"
                labelText="ชื่อภารกิจ"
                defaultValue={mission.name}
              />

              <FormRow
                type="number"
                name="no"
                labelText="ด่านที่"
                defaultValue={mission.no}
              />

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
            </div>

            {/* Submissions Section */}
            <div className="submissions-section" style={{
              backgroundColor: 'var(--background-secondary-color)',
              padding: '2rem',
              borderRadius: 'var(--border-radius)'
            }}>
              <h5 style={{ 
                marginBottom: '1.5rem', 
                color: 'var(--primary-500)',
                borderBottom: '2px solid var(--primary-300)',
                paddingBottom: '0.5rem'
              }}>ท่ากายภาพในภารกิจ</h5>
              
              {submissions.map((submission, index) => (
                <div key={submission._id} className="submission-item" style={{
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--border-radius)',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  backgroundColor: 'var(--white)'
                }}>
                  <h6 style={{ 
                    marginBottom: '1rem',
                    color: 'var(--primary-400)'
                  }}>ท่าที่ {index + 1}</h6>
                  
                  <input type="hidden" name="submissionIds" value={submission._id} />
                  
                  <FormRow
                    type="text"
                    name="submissionNames"
                    labelText={`ชื่อท่า`}
                    defaultValue={submission.name}
                    onChange={(e) => handleSubmissionChange(index, 'name', e.target.value)}
                  />

                  <div className="form-row">
                    <label className="form-label">การประเมิน</label>
                    <input
                      type="hidden"
                      name="submissionEvaluates"
                      value={submission.evaluate}
                    />
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          value="true"
                          checked={submission.evaluate}
                          onChange={() => handleSubmissionChange(index, 'evaluate', true)}
                        />
                        <span className="radio-text">ประเมิน</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          value="false"
                          checked={!submission.evaluate}
                          onChange={() => handleSubmissionChange(index, 'evaluate', false)}
                        />
                        <span className="radio-text">ไม่ประเมิน</span>
                      </label>
                    </div>
                  </div>

                  <div className="media-section">
                    <div className="form-row">
                      <label className="form-label">รูปภาพ</label>
                      <input
                        type="file"
                        name={`newImageUrls_${submission._id}`}
                        onChange={(e) => handleFileChange(submission._id, 'image', e)}
                        accept="image/*"
                      />
                      <input
                        type="hidden"
                        name="submissionImageUrls"
                        value={submission.imageUrl || ""}
                      />
                      {submission.imageUrl && (
                        <div className="preview-container">
                          <img
                            src={submission.imageUrl}
                            alt="Preview"
                            style={{ maxWidth: '200px', marginTop: '1rem' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-row">
                      <label className="form-label">วิดีโอ</label>
                      <input
                        type="file"
                        name={`newVideoUrls_${submission._id}`}
                        onChange={(e) => handleFileChange(submission._id, 'video', e)}
                        accept="video/*"
                      />
                      <input
                        type="hidden"
                        name="submissionVideoUrls"
                        value={submission.videoUrl || ""}
                      />
                      {submission.videoUrl && (
                        <div className="preview-container">
                          <video
                            src={submission.videoUrl}
                            controls
                            style={{ maxWidth: '200px', marginTop: '1rem' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-block form-btn"
          disabled={isSubmitting}
          style={{ marginTop: '2rem' }}
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
        </button>
      </Form>
    </Wrapper>
  );
};

export default EditPosture;