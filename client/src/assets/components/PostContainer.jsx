import React from "react";
import Wrapper from "../wrappers/PatientsContainer";
import { useAllPostContext } from "../../pages/BlogManage";
import Post from "./Post";

const PostContainer = () => {
  const { data } = useAllPostContext();

  if (!data) {
    return (
      <Wrapper>
        <h2>Loading...</h2>
      </Wrapper>
    );
  }

  const { posts } = data;

  if (!posts || posts.length === 0) {
    return (
      <Wrapper>
        <br />
        <br />
        <br />
        <h2>ไม่พบข้อมูลท่ากายภาพ</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th>คำนำหน้า</th>
            <th>ชื่อ-นามสกุล</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <Post key={post._id} {...post} />
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default PostContainer;