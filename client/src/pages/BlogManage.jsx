import React, { useState, useEffect } from "react";
import { FaTrash, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import AllHeader from "../assets/components/AllHeader.jsx";

const BlogManage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
            className="border p-6 rounded-lg shadow-lg bg-white mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">{post.title}</div>
              <div className="text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="text-sm text-gray-500 mb-2 flex items-center">
              <FaUserCircle className="h-6 w-6 text-gray-500 mr-2" />
              <span className="font-semibold">{post.postedBy}</span>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleDelete(post._id)}
                className="flex items-center text-red-500 font-semibold hover:text-red-700"
              >
                <FaTrash className="mr-1 h-4 w-4" /> ลบกระทู้
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>ไม่พบกระทู้ที่ตรงกับคำค้นหา</p>
      )}
    </div>
  );
};

export default BlogManage;
