import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { FaTrash } from "react-icons/fa";

// ✅ เชื่อมต่อ WebSocket ไปที่ Backend
const socket = io("http://localhost:5100", { 
  transports: ["websocket", "polling"],
  reconnection: true
});

const RespondBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {};
  const [comments, setComments] = useState([]);

  if (!post) {
    return <p>ไม่พบข้อมูลกระทู้</p>;
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/api/v1/posts/${post._id}`);
        setComments(data.post.comments || []);
      } catch (error) {
        toast.error("ไม่สามารถโหลดความคิดเห็นได้");
      }
    };

    fetchComments();

    // ✅ รับข้อความใหม่จาก WebSocket
    socket.on("new-comment", (updatedComments) => {
      setComments(updatedComments);
    });

    return () => {
      socket.off("new-comment");
    };
  }, [post._id]);

  // ✅ ฟังก์ชันลบกระทู้
  const handleDeletePost = async () => {
    if (window.confirm("คุณต้องการลบกระทู้นี้ใช่หรือไม่?")) {
      try {
        await axios.delete(`/api/v1/posts/${post._id}`);
        toast.success("ลบกระทู้เรียบร้อยแล้ว");
        navigate("/blogmanage"); // กลับไปหน้าหลักหลังลบ
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการลบกระทู้");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="border p-6 rounded-lg shadow-lg bg-white mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h2>

          {/* ✅ ปุ่มลบกระทู้ */}
          <button
            onClick={handleDeletePost}
            className="text-red-600 hover:text-red-800 flex items-center"
          >
            <FaTrash className="mr-2" /> ลบกระทู้
          </button>
        </div>

        <p className="text-gray-700 mb-6 text-justify">{post.content}</p>
        <p className="text-blue-700 mb-6">#{post.tag}</p>
        <div className="text-sm text-gray-500 mb-2 flex items-center">
          <span className="font-semibold">
            สร้างโดย : {post.postedBy ? `${post.postedBy.name} ${post.postedBy.surname}` : "ผู้โพสต์ไม่ทราบ"}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">ความคิดเห็นทั้งหมด:</h3>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="p-4 border rounded-lg bg-gray-50">
                <p className="font-medium text-gray-600">
                  ตอบกลับโดย:{" "}
                  {comment.postedByPersonnel
                    ? `${comment.postedByPersonnel.nametitle} ${comment.postedByPersonnel.name} ${comment.postedByPersonnel.surname}`
                    : comment.postedByUser
                    ? `${comment.postedByUser.name} ${comment.postedByUser.surname}`
                    : "ผู้ใช้"}
                </p>
                <p className="text-gray-700 mt-2">{comment.text}</p>

                {/* ✅ แสดง replies ภายใน map */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 border-l-2 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="mb-2">
                        <p className="text-gray-600 text-sm">
                          ↪ ตอบโดย:{" "}
                          {reply.postedByPersonnel
                            ? `${reply.postedByPersonnel.nametitle} ${reply.postedByPersonnel.name} ${reply.postedByPersonnel.surname}`
                            : reply.postedByUser
                            ? `${reply.postedByUser.name} ${reply.postedByUser.surname}`
                            : "ผู้ใช้"}
                        </p>
                        <p className="text-gray-700 text-sm">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">ยังไม่มีความคิดเห็น</p>
        )}
      </div>
    </div>
  );
};

export default RespondBlog;
