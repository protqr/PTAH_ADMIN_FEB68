import React from "react";
import styled from "styled-components";
import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import PTAH_Landing from "../assets/images/PTAH_Landing.png";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>{/* <img src={logo} alt="PTAH" className="logo" /> */}</nav>
      <div className="container page">
        <div className="info">
          <h5>
            แอปพลิเคชันช่วยเหลือการกายภาพบำบัดที่บ้าน | สำหรับผู้ดูแลระบบ <hr />
          </h5>
          <h1>
            <span>PTAH</span> Admin
          </h1>
          {/* <Link to="/register" className="btn register-link">
            Register
          </Link> */}

          <Link to="/login" className="btn ">
            เข้าใช้งาน
          </Link>
        </div>
        <img src={PTAH_Landing} alt="PtahApp" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
