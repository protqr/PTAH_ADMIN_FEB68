import React, { useState, useEffect } from "react";
import { FaTrash, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AllHeader from "../assets/components/AllHeader.jsx";

const BlogManage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("/api/v1/posts");
        setPosts(data.posts);
        setFilteredPosts(data.posts);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching posts");
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm("คุณต้องการลบกระทู้นี้ใช่หรือไม่?")) {
      try {
        await axios.delete(`/api/v1/posts/${postId}`);
        const updatedPosts = posts.filter((post) => post._id !== postId);
        setPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
        toast.success("ลบกระทู้เรียบร้อยแล้ว");
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการลบกระทู้");
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(term)
    );
    setFilteredPosts(filtered);
  };

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="max-w-4xl mx-auto my-8">
     
      <AllHeader>
        กระทู้ทั้งหมด {posts.length} กระทู้
      </AllHeader>
      
    
      <div className="mt-8 mb-8">
        <input
          type="text"
          placeholder="ค้นหากระทู้..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border rounded-lg"
        />
      </div>
      

      {/* แสดงรายการโพสต์ */}
      {filteredPosts.length > 0 ? (
  filteredPosts.map((post) => (
    <div
      key={post._id}
      className="border p-6 rounded-lg shadow-lg bg-white mb-6 cursor-pointer"
      onClick={() =>
        navigate("/dashboard/respond-blog", { state: { post } })
      }
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">{post.title}</div>
        <div className="text-sm text-gray-400">
          {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>
      <p className="text-gray-700 mb-4">
        {post.content.substring(0, 100)}...
      </p>
      <p className="text-blue-700 mb-4">#{post.tag}</p>

      <div className="text-sm text-gray-500 mb-2 flex items-center">
        <span className="font-semibold">
          {post.postedBy
            ? post.postedBy.nametitle
              ? `${post.postedBy.nametitle} ${post.postedBy.name} ${post.postedBy.surname}`
              : `${post.postedBy.name} ${post.postedBy.surname}`
            : "ผู้โพสต์ไม่ทราบ"}
        </span>
      </div>

      {/* ปุ่มลบโพสต์ */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ป้องกันการคลิกที่ div หลัก
          handleDelete(post._id);
        }}
        className="text-red-600 hover:text-red-800 flex items-center"
      >
        <FaTrash className="mr-2" /> ลบกระทู้
      </button>
    </div>
  ))
) : (
  <p>ไม่พบกระทู้ที่ตรงกับคำค้นหา</p>
)}
    </div>
  );
};

export default BlogManage;
