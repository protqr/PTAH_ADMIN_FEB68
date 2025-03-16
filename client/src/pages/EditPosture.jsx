import { useState } from 'react';
import { FormRow } from '../assets/components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData } from 'react-router-dom';
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

    const missionData = {
      name: data.name,
      no: data.no,
      isEvaluate: data.isEvaluate === "ประเมิน"
    };

    console.log("missionData:", missionData);

    const submissionUpdates = formData.getAll('submissionIds').map((id, index) => ({
      _id: id,
      name: formData.getAll('submissionNames')[index],
      evaluate: formData.getAll('submissionEvaluates')[index] === "true",
      imageUrl: formData.getAll('submissionImageUrls')[index] || "",
      videoUrl: formData.getAll('submissionVideoUrls')[index] || ""
    }));

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
  const [openSubmissions, setOpenSubmissions] = useState(new Array(submissions.length).fill(false));

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

    const submission = submissions.find(s => s._id === submissionId);
    if (submission) {
      handleSubmissionChange(
        submissions.indexOf(submission),
        type === 'image' ? 'imageUrl' : 'videoUrl',
        URL.createObjectURL(file)
      );
    }
  };

  const toggleSubmission = (index) => {
    const updatedOpenSubmissions = [...openSubmissions];
    updatedOpenSubmissions[index] = !updatedOpenSubmissions[index];
    setOpenSubmissions(updatedOpenSubmissions);
  };

  const deleteSubmission = async (submissionId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบท่านี้?")) {
      return;
    }
    try {
      const missionId = mission._id;
      await customFetch.delete(`/missions/${missionId}/submissions/${submissionId}`);
      setSubmissions(submissions.filter(sub => sub._id !== submissionId));
      toast.success("ลบท่าเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error(error?.response?.data?.msg || "เกิดข้อผิดพลาดในการลบ");
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

              <div className="form-row">
                <label htmlFor="name" className="form-label required">ด่านที่</label>
                <input type="text" id="name" name="name" disabled value={mission.no} className="form-input" placeholder="กรุณาระบุชื่อภารกิจ" required />
              </div>

              <div className="form-row">
                <label htmlFor="postureType" className="form-label required">ประเภทของท่า</label>
                <select disabled id="postureType" name="postureType" className="form-select" required>
                  <option>{mission.name}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700">การประเมิน</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="isEvaluate" value="ประเมิน" className="hidden peer" checked={isEvaluate === "ประเมิน"} onChange={handleIsEvaluateChange} required />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-blue-500">
                      <div className="w-3 h-3 bg-blue-500 rounded-full peer-checked:scale-100 scale-0 transition-transform"></div>
                    </div>
                    <span className="text-gray-700 peer-checked:text-blue-600">ประเมิน</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="isEvaluate" value="ไม่ประเมิน" className="hidden peer" checked={isEvaluate === "ไม่ประเมิน"} onChange={handleIsEvaluateChange} />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full peer-checked:scale-100 scale-0 transition-transform"></div>
                    </div>
                    <span className="text-gray-700 peer-checked:text-red-600">ไม่ประเมิน</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="submissions-section" style={{
              backgroundColor: 'var(--background-secondary-color)',
              padding: '2rem',
              borderRadius: 'var(--border-radius)'
            }}>
              <h5 style={{ marginBottom: '1.5rem', color: 'var(--primary-500)', borderBottom: '2px solid var(--primary-300)', paddingBottom: '0.5rem' }}>ท่ากายภาพในภารกิจ</h5>

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
                  }} className='flex justify-between'>
                    ท่าที่ {index + 1}
                    <div className='flex gap-8'>
                      <button type="button" onClick={() => toggleSubmission(index)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--primary-400)', cursor: 'pointer' }}>
                        {openSubmissions[index] ? 'ซ่อน' : 'แสดง'}
                      </button>
                      <button type="button" onClick={() => deleteSubmission(submission._id)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--primary-400)', cursor: 'pointer' }}>
                        ลบ
                      </button>
                    </div>
                  </h6>

                  {openSubmissions[index] && (
                    <>
                      <input type="hidden" name="submissionIds" value={submission._id} />

                      <FormRow type="text" name="submissionNames" labelText={`ชื่อท่า`} defaultValue={submission.name}
                        onChange={(e) => handleSubmissionChange(index, 'name', e.target.value)} />

                      {/* <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold text-gray-700">การประเมิน</label>
                        <input type="hidden" name="submissionEvaluates" value={submission.evaluate} />

                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name={`submissionEvaluate-${index}`} value="true" checked={submission.evaluate}
                              onChange={() => handleSubmissionChange(index, 'evaluate', true)} className="hidden peer" />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-blue-500">
                              <div className="w-3 h-3 bg-blue-500 rounded-full peer-checked:scale-100 scale-0 transition-transform"></div>
                            </div>
                            <span className="text-gray-700 peer-checked:text-blue-600">ประเมิน</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name={`submissionEvaluate-${index}`} value="false" checked={!submission.evaluate}
                              onChange={() => handleSubmissionChange(index, 'evaluate', false)} className="hidden peer" />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-red-500">
                              <div className="w-3 h-3 bg-red-500 rounded-full peer-checked:scale-100 scale-0 transition-transform"></div>
                            </div>
                            <span className="text-gray-700 peer-checked:text-red-600">ไม่ประเมิน</span>
                          </label>
                        </div>
                      </div> */}

                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-lg font-semibold text-gray-700">รูปภาพ</label>
                          <label className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
                            <input
                              type="file"
                              name={`newImageUrls_${submission._id}`}
                              onChange={(e) => handleFileChange(submission._id, 'image', e)}
                              accept="image/*"
                              className="hidden"
                            />
                            <span className="text-gray-600">เลือกไฟล์รูปภาพ</span>
                          </label>
                          <input
                            type="hidden"
                            name="submissionImageUrls"
                            value={submission.imageUrl || ""}
                          />
                          {submission.imageUrl && (
                            <div className="mt-2 flex justify-center">
                              <img
                                src={submission.imageUrl}
                                alt="Preview"
                                className="w-full max-w-xs rounded-lg border border-gray-300 shadow-sm"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-lg font-semibold text-gray-700">วิดีโอ</label>
                          <label className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
                            <input
                              type="file"
                              name={`newVideoUrls_${submission._id}`}
                              onChange={(e) => handleFileChange(submission._id, 'video', e)}
                              accept="video/*"
                              className="hidden"
                            />
                            <span className="text-gray-600">เลือกไฟล์วิดีโอ</span>
                          </label>
                          <input
                            type="hidden"
                            name="submissionVideoUrls"
                            value={submission.videoUrl || ""}
                          />
                          {submission.videoUrl && (
                            <div className="mt-2 flex justify-center">
                              <video
                                src={submission.videoUrl}
                                className="w-full max-w-md rounded-lg border border-gray-300 shadow-sm"
                                controls
                              />
                            </div>
                          )}
                        </div>
                      </div>

                    </>
                  )}
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
