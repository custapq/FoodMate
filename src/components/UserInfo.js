import React from "react";
import Card from "./Card"; // Import the Card component
import {
  calculateIBW,
  calculatePercentageIBW,
  calculateBMI,
  calculateBMR,
  calculateTDEE,
} from "../util/calculate.js";

const UserInfo = ({ userData }) => {
  const { id, age, weight, height, gender, exercise, goal, conditionList } =
    userData;

  console.log("user condition: ", conditionList.length);

  // Perform calculations
  const ibw = calculateIBW(height, gender);
  const percentageIBW = calculatePercentageIBW(weight, ibw);
  const bmi = calculateBMI(weight, height);
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, exercise);

  // Weight status
  let weightStatus;
  if (percentageIBW > 120) {
    weightStatus = "อ้วน";
  } else if (percentageIBW >= 110) {
    weightStatus = "น้ำหนักเกิน";
  } else if (percentageIBW >= 90) {
    weightStatus = "สมส่วน";
  } else if (percentageIBW >= 80) {
    weightStatus = "น้ำหนักน้อย";
  } else if (percentageIBW >= 70) {
    weightStatus = "น้ำหนักน้อยปานกลาง";
  } else {
    weightStatus = "น้ำหนักน้อยมาก";
  }

  // BMI status
  let bmiStatus;
  if (bmi > 30) {
    bmiStatus = "โรคอ้วนระดับ 2";
  } else if (bmi >= 25) {
    bmiStatus = "โรคอ้วนระดับ 1";
  } else if (bmi >= 23) {
    bmiStatus = "น้ำหนักเกิน";
  } else if (bmi >= 18.5) {
    bmiStatus = "ปกติ";
  } else {
    bmiStatus = "น้ำหนักน้อย";
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">ผู้ใช้หมายเลข {id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-4xl my-5">
          <h2 className="text-2xl font-bold mb-6">ข้อมูลการคำณวน</h2>
          <Card
            title="IBW"
            value={`${ibw.toFixed(2)} kg`}
            detail="น้ำหนักมาตรฐาน"
          />
          <Card
            title="เปอร์เซ็น IBW"
            value={`${percentageIBW.toFixed(2)}%`}
            detail="เปอร์เซ็นน้ำหนักเทียบกับมาตรฐาน"
          />
          <Card
            title="สถานะน้ำหนัก"
            value={weightStatus}
            detail="การประเมินตาม %IBW"
          />
          <Card
            title="BMI"
            value={bmi.toFixed(2)}
            detail="ดัชนีมวลกาย (Body Mass Index)"
          />
          <Card
            title="สถานะ BMI"
            value={bmiStatus}
            detail="การประเมินตาม BMI"
          />
          <Card
            title="BMR"
            value={`${bmr.toFixed(2)} kcal`}
            detail="พลังงานที่ใช้ในชีวิตประจำวัน (Basal Metabolic Rate)"
          />
          <Card
            title="TDEE"
            value={`${tdee.toFixed(2)} kcal`}
            detail="พลังงานที่ใช้ใน 1 วัน (Total Daily Energy Expenditure)"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-4xl my-5">
          <h2 className="text-2xl font-bold mb-6">ข้อมูลส่วนบุคคล</h2>
          <Card title="น้ำหนัก" value={`${weight} kg`} detail="น้ำหนัก" />
          <Card title="ส่วนสูง" value={`${height} cm`} detail="ส่วนสูง" />
          <Card title="อายุ" value={`${age} ปี`} detail="อายุ" />
          <Card title="เพศ" value={`${gender} `} detail="เพศ" />
          <Card
            title="การออกกำลังกาย"
            value={`${exercise} `}
            detail="การออกกำลังกาย"
          />
          {conditionList.map((conditions) => (
            <Card
              key={conditions.conditionId}
              title="โรคประจำตัว"
              value={conditions.condition.name}
              detail="โรคประจำตัว"
            />
          ))}

          <Card title="เป้าหมาย" value={`${goal} `} detail="เป้าหมาย" />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
