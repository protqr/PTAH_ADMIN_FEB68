import React from 'react';
import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { FormRow, Logo } from '../assets/components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/register', data);
    toast.success('เพิ่มแอดมินเรียบร้อยแล้ว');
    return redirect('/dashboard/all-admin');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  console.log(navigation);
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Wrapper>
      <Form method="post" className="form">
        {/* <Logo /> */}
        <h4>เพิ่มแอดมิน</h4>
        <FormRow type="text" name="username" defaultValue="" />
        <FormRow type="text" name="name" defaultValue="" />
        <FormRow
          type="text"
          name="surname"
          labelText="surname"
          defaultValue=""
        />
        <FormRow type="email" name="email" defaultValue="" />
        <FormRow type="password" name="password" defaultValue="" />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "submitting..." : "submit"}
        </button>
        {/* <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p> */}
      </Form>
    </Wrapper>
  );
};

export default Register;
