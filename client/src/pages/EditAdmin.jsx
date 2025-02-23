// import React, { useState } from "react";
// import { FormRow, FormRowSelect } from "../assets/components";
// import Wrapper from "../assets/wrappers/DashboardFormPage";
// import { useLoaderData, useParams } from "react-router-dom";
// import { Form, useNavigate, redirect } from "react-router-dom";
// import { toast } from "react-toastify";
// import customFetch from "../utils/customFetch";

// export const loader = async ({ params }) => {
//   try {
//     const { _id } = params;
//     if (!_id) {
//       throw new Error("Invalid ID");
//     }
//     const { data } = await customFetch.get(`/users/${_id}`);
//     return data;
//   } catch (error) {
//     toast.error(error.response.data.msg);
//     return redirect("/dashboard/all-doctor");
//   }
// };

// export const action = async ({ request, params }) => {
//   const { _id } = params;
//   const formData = await request.formData();
//   const data = Object.fromEntries(formData);

//   try {
//     if (!_id) {
//       throw new Error("Invalid ID");
//     }
//     await customFetch.patch(`/users/update-user`, data);
//     toast.success("แก้ไขข้อมูลแอดมินเรียบร้อยแล้ว");
//     return redirect("/dashboard/all-doctor");
//   } catch (error) {
//     toast.error(error?.response?.data?.msg);
//     return error;
//   }
// };

// const EditAdmin = () => {
//   const { admin } = useLoaderData();

//   const navigation = useNavigate();
//   const isSubmitting = navigation.state === "submitting";

//   return (
//     <Wrapper>
//       <Form method="post" className="form">
//         <h4 className="form-title">แก้ไขข้อมูลแอดมิน</h4>
//         <div className="form-center">
//           <FormRow
//             type="text"
//             name="noAdmin"
//             labelText="หมายเลขแอดมิน"
//             pattern="[0-9]*"
//           />

//           <FormRow type="text" name="name" labelText="ชื่อ" />

//           <FormRow type="text" name="lastname" labelText="นามสกุล" />

//           <FormRow type="text" name="email" labelText="อีเมล" />

//           <FormRow type="text" name="password" labelText="รหัสผ่าน" />

//           {/* <br /> */}
//           <button
//             type="submit"
//             className="btn btn-block form-btn "
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "submitting..." : "submit"}
//           </button>
//         </div>
//       </Form>
//     </Wrapper>
//   );
// };
// export default EditAdmin;
