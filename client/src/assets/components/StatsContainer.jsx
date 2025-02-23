import { FaSuitcaseRolling, FaCalendarCheck } from "react-icons/fa";
import { GiHeartPlus } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import Wrapper from "../wrappers/StatsContainer";
import StatItem from "./StatItem";
import styled from "styled-components";

const StatsHeader = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: 50px;
  color: #6b6b6b;
  font-size: 30px;
`;

const StatsSubject = styled.h4`
  font-weight: 800;
  text-align: left;
  margin-top: 0;
  margin-bottom: 30px;
  color: #535353;
  font-size: 20px;
  border-bottom: 3px solid #87cefa;
  width: 250px;
  padding-bottom: 10px;
`;

const StatsContainer = ({ defaultStats }) => {
  const stats = [
    // {
    //   title: "กำลังรักษา",
    //   count: `${defaultStats?.กำลังรักษา || 0} คน`,
    //   icon: <GiHeartPlus />,
    //   color: "#f8ba51",
    //   bcg: "#fcefc7",
    // },
    {
      title: "ผู้ป่วยที่ทำกายภาพบำบัด",
      count: `${defaultStats?.ผู้ป่วยที่ทำกายภาพบำบัด || 0} คน`,
      icon: <GiHeartPlus />,
      color: "#f8ba51",
      bcg: "#fcefc7",
    },
    {
      title: "จบการรักษา",
      count: `${defaultStats?.จบการรักษา || 0} คน`,
      icon: <FaCalendarCheck />,
      color: "#72DA95",
      bcg: "#b6ffce91",
    },
    {
      title: "ผู้ป่วยทั้งหมด",
      count: `${defaultStats?.ผู้ป่วยทั้งหมด || 0} คน`,
      icon: <IoPeople />,
      color: "#87CEFA",
      bcg: "#87cefa44",
    },
  ];
  return (
    <>
      <StatsHeader>สวัสดีแอดมิน!</StatsHeader>
      <StatsSubject>จำนวนผู้ป่วยทั้งหมด</StatsSubject>
      <Wrapper>
        {stats.map((item) => {
          return <StatItem key={item.title} {...item} />;
        })}
      </Wrapper>

    </>
  );
};
export default StatsContainer;
