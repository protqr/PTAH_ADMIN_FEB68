import React, { useState, useEffect } from "react";
import {
  FormRow,
  FormRowSelect,
  FormRowMultiSelect,
  FormRowRadio,
} from "../assets/components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import {
  CHOOSEPOSTURES,
  TYPEPOSTURES,
  TYPESTATUS,
  GENDER,
  RELATIONS,
  HAVECAREGIVER,
} from "../../../utils/constants";
import {
  Form,
  redirect,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

const isUserNameDuplicate = async (username) => {
  try {
    const response = await customFetch.get(`/allusers?username=${username}`);
    return response.data.length > 0;
  } catch (error) {
    console.error("Error checking duplicate username:", error);
    return false;
  }
};

const isIdCardDuplicate = async (ID_card_number) => {
  try {
    const response = await customFetch.get(`/allusers?ID_card_number=${ID_card_number}`);
    return response.data.length > 0;
  } catch (error) {
    console.error("Error checking duplicate ID_card_number:", error);
    return false;
  }
};

export const action = async ({ request }) => {
  try {
    const data = await request.formData();
    const idPatient = data.get("idPatient");
    const ID_card_number = data.get("ID_card_number");
    const username = data.get("username");
    const email = data.get("email");
    const name = data.get("name");
    const surname = data.get("surname");
    const tel = data.get("tel");
    const nationality = data.get("nationality");
    const Address = data.get("Address");
    const birthday = data.get("birthday");
    const sickness = data.get("sickness");
    const gender = data.get("gender");
    // const userType = data.get("userType");
    // const userPostsData = data.get("userPosts");
    const userStatus = data.get("userStatus");
    const nameCaregiver = data.get("nameCaregiver");
    const lastnameCaregiver = data.get("lastnameCaregiver");
    const telCaregiver = data.get("telCaregiver");
    const caregiverRelations = data.get("caregiverRelations");
    const otherRelations = data.get("otherRelations");
    const youhaveCaregiver = data.get("youhaveCaregiver");

    // ตรวจสอบความซ้ำซ้อนของข้อมูล
    const isDuplicate = await isUserNameDuplicate(username);
    if (isDuplicate) {
      toast.error("ชื่อผู้ใช้ซ้ำกัน โปรดกรอกชื่อผู้ใช้ใหม่");
      return null;
    }

    if (!/^[0-9]+$/.test(idPatient)) {
      toast.error("หมายเลขผู้ป่วยต้องเป็นตัวเลขเท่านั้น");
      return null;
    }

    const isDuplicate2 = await isIdCardDuplicate(ID_card_number);
    if (isDuplicate2) {
      toast.error("หมายเลขบัตรประชาชนซ้ำกัน โปรดเลือกหมายเลขอื่น");
      return null;
    }

    if (!/^[0-9]+$/.test(ID_card_number)) {
      toast.error("หมายเลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น");
      return null;
    }

    if (youhaveCaregiver === HAVECAREGIVER.TYPE_CGV1) {
      if (
        !nameCaregiver ||
        !lastnameCaregiver ||
        !telCaregiver ||
        !caregiverRelations
      ) {
        toast.error("กรุณากรอกข้อมูลผู้ดูแลให้ครบถ้วน");
        return null;
      }
    }

    // สร้างข้อมูลผู้ป่วย
    const patientData = {
      idPatient: idPatient,
      ID_card_number: ID_card_number,
      username: username,
      email: email,
      name: name,
      surname: surname,
      tel: tel,
      nationality: nationality,
      Address: Address,
      birthday: birthday,
      sickness: sickness,
      gender: gender,
      // userType: userType,
      // userPosts: userPostsData,
      userStatus: userStatus,
      youhaveCaregiver: youhaveCaregiver,
      nameCaregiver: nameCaregiver,
      lastnameCaregiver: lastnameCaregiver,
      telCaregiver: telCaregiver,
      caregiverRelations: caregiverRelations,
      otherRelations:
        caregiverRelations === RELATIONS.OTHER ? otherRelations : "",
    };


    console.log("Sending request:", patientData);
    // ส่งข้อมูลเป็น JSON
    await customFetch.post("/allusers", patientData);
    toast.success("เพิ่มข้อมูลคนไข้เรียบร้อยแล้ว");
    return redirect("/dashboard/all-patient");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};



const AddUser = () => {
  const { user } = useOutletContext();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

const handleUserPostsChange = (selectedOptions) => {
  setSelectedUserPosts(selectedOptions);
};


  const [selectedgender, setSelectedgender] = useState(GENDER.GENDER_01);
  const [selectedUserType, setSelectedUserType] = useState(TYPEPOSTURES.TYPE_1);
  const [selectedUserPosts, setSelectedUserPosts] = useState([]);
  const [selectedUserStatus, setSelectedUserStatus] = useState(TYPESTATUS.TYPE_ST1);
  const [postures, setPostures] = useState([]);

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

  useEffect(() => {
    console.log(selectedUserPosts);
  }, [selectedUserPosts]);

  const handleUserTypeChange = (event) => {
    setSelectedgender(event.target.value);
    setSelectedUserType(event.target.value);
    setSelectedUserStatus(event.target.value);
    setSelectedYouhaveCaregiver(event.target.value);
  };

  const [selectedYouhaveCaregiver, setSelectedYouhaveCaregiver] = useState(HAVECAREGIVER.TYPE_CGV1);
  const [selectedRelation, setSelectedRelation] = useState("");
  const [otherRelation, setOtherRelation] = useState("");

  const handleRelationChange = (e) => {
    setSelectedRelation(e.target.value);
  };

  const handleOtherRelationChange = (e) => {
    setOtherRelation(e.target.value);
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">เพิ่มข้อมูลคนไข้</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="ID_card_number"
            labelText="หมายเลขบัตรประชาชน"
            pattern="[0-9]*"
          />
          <div className="row">
            <div className="column1">
              <FormRow
                type="text"
                name="idPatient"
                labelText="หมายเลขผู้ป่วย"
                pattern="[0-9]*"
              />
              <FormRow type="text" name="name" labelText="ชื่อผู้ป่วย" />
              <FormRow
                type="text"
                name="sickness"
                labelText="โรคหรืออาการของผู้ป่วย"
              />
              <FormRowSelect
                labelText="เพศ"
                name="gender"
                value={selectedgender}
                onChange={handleUserTypeChange}
                list={Object.values(GENDER)}
              />
              <FormRow type="text" name="email" labelText="อีเมล" />
              <FormRow type="text" name="nationality" labelText="สัญชาติ" />
            </div>
            <div className="column2">
              <FormRow type="text" name="username" labelText="ชื่อผู้ใช้" />
              <FormRow type="text" name="surname" labelText="นามสกุลผู้ป่วย" />
              <FormRowSelect
                labelText="เลือกสถานะปัจจุบันของคนไข้"
                name="userStatus"
                value={selectedUserStatus}
                onChange={handleUserTypeChange}
                list={Object.values(TYPESTATUS)}
              />
              <FormRow type="date" name="birthday" labelText="วันเกิด" />
              <FormRow type="text" name="tel" labelText="เบอร์โทร" />
              <FormRow type="text" name="Address" labelText="ที่อยู่" />
            </div>
          </div>
          {/* <FormRowMultiSelect
            type="textarea"
            name="userPosts"
            labelText="เลือกท่ากายภาพบำบัด"
            options={["ท่าทั้งหมด", ...postures.map((p) => p.namePostures)]}
            value={selectedUserPosts}
            onChange={handleUserPostsChange}
          /> */}

          {/* <input name="userPostsDummy" value={selectedUserPosts} hidden></input> */}
        </div>
        <br />
        <br />
        <br />
        <hr />
        <br />
        <br />

        {/* เพิ่มข้อมูลผู้ดูแล */}
        <br />
        <h4 className="form-title">เพิ่มข้อมูลผู้ดูแล</h4>
        <div className="form-center">
          <FormRowSelect
            labelText="มีผู้ดูแลหรือไม่?"
            name="youhaveCaregiver"
            value={selectedYouhaveCaregiver}
            onChange={handleUserTypeChange}
            list={Object.values(HAVECAREGIVER)}
          />
          <div className="row">
            <div className="column1">
              {selectedYouhaveCaregiver === HAVECAREGIVER.TYPE_CGV1 && (
                <>
                  <FormRow
                    type="text"
                    name="nameCaregiver"
                    labelText="ชื่อจริง (ผู้ดูแล)"
                    required
                  />
                  <FormRow
                    type="text"
                    name="lastnameCaregiver"
                    labelText="นามสกุล (ผู้ดูแล)"
                    required
                  />
                  <FormRow
                    type="tel"
                    name="telCaregiver"
                    labelText="เบอร์โทรศัพท์ผู้ดูแล"
                    required
                  />
                </>
              )}
            </div>

            <div className="column2">
              {selectedYouhaveCaregiver === HAVECAREGIVER.TYPE_CGV1 && (
                <>
                  <FormRowRadio
                    name="caregiverRelations"
                    list={Object.values(RELATIONS)}
                    value={selectedRelation}
                    onChange={handleRelationChange}
                    otherOption={RELATIONS.OTHER}
                    otherValue={otherRelation}
                    onOtherChange={handleOtherRelationChange}
                    required
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <br />
        <button
          type="submit"
          className="btn btn-block form-btn "
          disabled={isSubmitting}
        >
          {isSubmitting ? "submitting..." : "submit"}
        </button>
      </Form>
    </Wrapper>
  );
};

export default AddUser;
