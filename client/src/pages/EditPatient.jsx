import React, { useState, useEffect } from "react";
import {
  FormRow,
  FormRowSelect,
  FormRowMultiSelect,
  FormRowRadio,
} from "../assets/components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useLoaderData, useParams } from "react-router-dom";
import {
  TYPEPOSTURES,
  CHOOSEPOSTURES,
  TYPESTATUS,
  GENDER,
  RELATIONS,
  HAVECAREGIVER,
} from "../../../utils/constants";
import { Form, useNavigate, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const loader = async ({ params }) => {
  try {
    const { _id } = params;
    if (!_id) {
      throw new Error("Invalid ID");
    }
    const { data } = await customFetch.get(`/allusers/${_id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.msg);
    return redirect("/dashboard/all-patient");
  }
};

export const action = async ({ request, params }) => {
  const { _id } = params;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);

  // แปลงค่าที่เลือกจาก FormRowMultiSelect เป็นอาร์เรย์ของสตริง
  // if (data.userPosts) {
  //   data.userPosts = data.userPosts.split(',').map((item) => item.trim());
  // }

  try {
    if (!_id) {
      throw new Error("Invalid ID");
    }
    await customFetch.patch(`/allusers/${_id}`, data);
    toast.success("แก้ไขข้อมูลคนไข้เรียบร้อยแล้ว");
    return redirect("/dashboard/all-patient");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const EditPatient = () => {
  const { patient } = useLoaderData();

  const navigation = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [selectedgender, setSelectedgender] = useState(
    patient.gender || ""
  );
  const [selectedUserType, setSelectedUserType] = useState(
    patient.userType || ""
  );
  const [selectedUserPosts, setSelectedUserPosts] = useState(
    patient.userPosts || []
  );
  const [selectedUserStatus, setSelectedUserStatus] = useState(
    patient.userStatus || ""
  );
  const [postures, setPostures] = useState([]);

  const [selectedYouhaveCaregiver, setSelectedYouhaveCaregiver] = useState(
    patient.youhaveCaregiver || ""
  );
  const [selectedRelation, setSelectedRelation] = useState(
    patient.caregiverRelations || ""
  );
  const [otherRelation, setOtherRelation] = useState(
    patient.otherRelation || ""
  );

  useEffect(() => {
    const fetchPostures = async () => {
      try {
        const { data } = await customFetch.get("/postures");
        setPostures(data.postures);
      } catch (error) {
        toast.error(error?.response?.data?.msg);
      }
    };
    fetchPostures();
  }, []);

  const handleUserTypeChange = (event) => {
    setSelectedgender(event.target.value);
    setSelectedUserType(event.target.value);
    setSelectedUserStatus(event.target.value);
    setSelectedYouhaveCaregiver(event.target.value);
  };

  const handleUserPostsChange = (selectedOptions) => {
    setSelectedUserPosts(selectedOptions.map((option) => option.value));
  };

  const handleRelationChange = (event) => {
    setSelectedRelation(event.target.value);
  };

  const handleOtherRelationChange = (event) => {
    setOtherRelation(event.target.value);
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">แก้ไขข้อมูลคนไข้</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="ID_card_number"
            labelText="หมายเลขบัตรประชาชน"
            pattern="[0-9]*"
            defaultValue={patient.ID_card_number}
          />

          <div className="row">
            <div className="column1">
              <FormRow
                type="text"
                name="idPatient"
                labelText="หมายเลขผู้ป่วย"
                pattern="[0-9]*"
                defaultValue={patient.idPatient}
              />
              <FormRow
                type="text"
                name="name"
                labelText="ชื่อผู้ป่วย"
                defaultValue={patient.name}
              />
              <FormRow
                type="text"
                name="sickness"
                labelText="โรคหรืออาการของผู้ป่วย"
                defaultValue={patient.sickness}
              />
              <FormRowSelect
                labelText="เพศ"
                name="gender"
                value={selectedgender}
                onChange={handleUserTypeChange}
                list={Object.values(GENDER)}
                defaultValue={patient.gender}
              />
              <FormRow
                type="text"
                name="email"
                labelText="อีเมล"
                defaultValue={patient.email}
              />
              <FormRow
                type="text"
                name="nationality"
                labelText="สัญชาติ"
                defaultValue={patient.nationality}
              />
            </div>

            <div className="column2">
              <FormRow
                type="text"
                name="username"
                labelText="ชื่อผู้ใช้"
                defaultValue={patient.username}
              />
              <FormRow
                type="text"
                name="surname"
                labelText="นามสกุลผู้ป่วย"
                defaultValue={patient.surname}
              />
              <FormRowSelect
                labelText="เลือกสถานะปัจจุบันของคนไข้"
                name="userStatus"
                value={selectedUserStatus}
                onChange={handleUserTypeChange}
                list={Object.values(TYPESTATUS)}
                defaultValue={patient.userStatus}
              />
              <FormRow
                type="date"
                name="birthday"
                labelText="วันเกิด"
                defaultValue={patient.birthday}
              />
              <FormRow
                type="text"
                name="tel"
                labelText="เบอร์โทร"
                defaultValue={patient.tel}
              />
              <FormRow
                type="text"
                name="Address"
                labelText="ที่อยู่"
                defaultValue={patient.Address}
              />
            </div>
          </div>

          {/* <FormRowMultiSelect
            name="userPosts"
            labelText="เลือกท่ากายภาพบำบัด"
            value={selectedUserPosts}
            options={["ท่าทั้งหมด", ...postures.map((p) => p.namePostures)]}
            defaultValue={patient.userPosts}
            onChange={handleUserPostsChange}
          /> */}

          <hr />
          <br />

          {/* แก้ไขข้อมูลผู้ดูแล */}
          <br />
          <h4 className="form-title">แก้ไขข้อมูลผู้ดูแล</h4>
          <div className="form-center">
            <FormRowSelect
              labelText="มีผู้ดูแลหรือไม่?"
              name="youhaveCaregiver"
              value={selectedYouhaveCaregiver}
              onChange={handleUserTypeChange}
              list={[
                "โปรดเลือกว่ามีผู้ดูแลหรือไม่?",
                ...Object.values(HAVECAREGIVER),
              ]}
              defaultValue={
                patient.youhaveCaregiver || "โปรดเลือกว่ามีผู้ดูแลหรือไม่?"
              }
            />

            {selectedYouhaveCaregiver === HAVECAREGIVER.TYPE_CGV1 && (
              <div className="row">
                <div className="column1">
                  <FormRow
                    type="text"
                    name="nameCaregiver"
                    labelText="ชื่อจริง (ผู้ดูแล)"
                    defaultValue={patient.nameCaregiver || ""}
                  />
                  <FormRow
                    type="text"
                    name="lastnameCaregiver"
                    labelText="นามสกุล (ผู้ดูแล)"
                    defaultValue={patient.lastnameCaregiver || ""}
                  />
                  <FormRow
                    type="tel"
                    name="telCaregiver"
                    labelText="เบอร์โทรศัพท์ผู้ดูแล"
                    defaultValue={patient.telCaregiver || ""}
                  />
                </div>
                <div className="column2">
                  <FormRowRadio
                    name="caregiverRelations"
                    list={Object.values(RELATIONS)}
                    value={selectedRelation || patient.caregiverRelations}
                    onChange={handleRelationChange}
                    otherOption={RELATIONS.OTHER}
                    otherValue={otherRelation || patient.otherRelation || ""}
                    onOtherChange={handleOtherRelationChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* <br /> */}
          <button
            type="submit"
            className="btn btn-block form-btn "
            disabled={isSubmitting}
          >
            {isSubmitting ? "submitting..." : "submit"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditPatient;
