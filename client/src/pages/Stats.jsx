import React from "react";
import { ChartsContainer, StatsContainer } from "../assets/components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
  try {
    const response = await customFetch.get("/allusers/stats");
    return response.data;
  } catch (error) {
    console.error("Error loading stats:", error);
    return { error: "Failed to load stats" };
  }
};


const Stats = () => {
  const { defaultStats, monthlyApplications, monthlyApplications2 } =
    useLoaderData();

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && (
        <ChartsContainer
          data={monthlyApplications}
          title="ข้อมูลคนไข้ที่ต้องทำกายภาพบำบัด"
        />
      )}

      {monthlyApplications2?.length > 1 && (
        <ChartsContainer
          data={monthlyApplications2}
          title="ข้อมูลจำนวนคนไข้ในระบบทั้งหมด"
        />
      )}
    </>
  );
};

export default Stats;
