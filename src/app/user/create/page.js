"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputRadio from "../../../components/InputRadio";
import InputText from "../../../components/InputText";
import InputSelect from "../../../components/InputSelect";
import Button from "../../../components/Button";

// Fetch conditions from API
const fetchConditions = async () => {
  const res = await fetch("http://localhost:3000/api/conditions");
  const data = await res.json();
  return data;
};

// Enums for Gender, Goal, and Exercise
const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};

const Goal = {
  GENERAL: "GENERAL",
  GAINWEIGHT: "GAINWEIGHT",
  WEIGHTMAINTAIN: "WEIGHTMAINTAIN",
  LOSSWEIGHT: "LOSSWEIGHT",
};

const Exercise = {
  NONE: "NONE",
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  SPORTMAN: "SPORTMAN",
};

export default function Create() {
  const router = useRouter(); // Create router instance

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [gender, setGender] = useState(Gender.MALE);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState(Goal.GENERAL);
  const [exercise, setExercise] = useState(Exercise.NONE);

  const [conditions, setConditions] = useState([]);
  const [condition, setCondition] = useState([9]); // ตั้งค่า default condition เป็น id=9 ("ไม่เป็นโรค")
  const [hasCondition, setHasCondition] = useState(false); // เริ่มต้นเป็น false แปลว่า "ไม่เป็นโรค"
  const [loadingCondition, setLoadingCondition] = useState(true);

  useEffect(() => {
    const getConditions = async () => {
      try {
        const data = await fetchConditions();
        setConditions(data);
        setLoadingCondition(false);
      } catch (error) {
        console.error("Error fetching conditions:", error);
        setLoadingCondition(false);
      }
    };
    getConditions();
  }, []);

  const handleConditionChange = (conditionId) => {
    if (condition.includes(conditionId)) {
      // ถ้า conditionId มีอยู่แล้วให้ลบออก
      setCondition(condition.filter((id) => id !== conditionId));
    } else {
      // ถ้าไม่มี ให้เพิ่มเข้าไป
      setCondition([...condition, conditionId]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      age,
      weight,
      height,
      gender,
      goal,
      exercise,
      condition, // ส่ง condition ที่ถูกเลือก (default = 9)
    };

    try {
      const res = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      const data = await res.json();
      console.log("User created:", data);

      const userId = data.id;

      router.push(`/recommendation/${userId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form className="max-w-md mx-auto mt-5" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 md:gap-6">
        <InputText
          label="Height"
          id="height"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <InputText
          label="Weight"
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <InputText
          label="Age"
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 md:gap-6">
        <InputRadio
          id="male"
          name="gender"
          value={Gender.MALE}
          checked={gender === Gender.MALE}
          onChange={() => setGender(Gender.MALE)}
          label="ชาย"
        />
        <InputRadio
          id="female"
          name="gender"
          value={Gender.FEMALE}
          checked={gender === Gender.FEMALE}
          onChange={() => setGender(Gender.FEMALE)}
          label="หญิง"
        />
      </div>

      {/* ส่วนที่เลือกว่าจะมีโรคหรือไม่ */}
      <div className="mt-4">
        <label>คุณมีโรคประจำตัวหรือไม่?</label>
        <div className="flex space-x-4 mt-2">
          <InputRadio
            id="hasConditionYes"
            name="hasCondition"
            value={true}
            checked={hasCondition === true}
            onChange={() => {
              setHasCondition(true);
              setCondition([]); // ถ้าผู้ใช้เลือกว่าจะเป็นโรค จะรีเซ็ต condition เป็นค่าว่าง
            }}
            label="มี"
          />
          <InputRadio
            id="hasConditionNo"
            name="hasCondition"
            value={false}
            checked={hasCondition === false}
            onChange={() => {
              setHasCondition(false);
              setCondition([9]); // ถ้าเลือกว่าไม่มีโรค ตั้งค่าเป็น 9 ("ไม่เป็นโรค")
            }}
            label="ไม่มี"
          />
        </div>
      </div>

      {/* แสดงรายการโรค ถ้าเลือกว่ามีโรค */}
      {hasCondition && !loadingCondition && (
        <div className="mt-4">
          <label>เลือกโรคประจำตัวของคุณ:</label>
          {conditions
            .filter((conditionItem) => conditionItem.id !== 9)
            .map((conditionItem) => (
              <div key={conditionItem.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`condition-${conditionItem.id}`}
                  value={conditionItem.id}
                  checked={condition.includes(conditionItem.id)}
                  onChange={() => handleConditionChange(conditionItem.id)}
                  className="mr-2"
                />
                <label htmlFor={`condition-${conditionItem.id}`}>
                  {conditionItem.name}
                </label>
              </div>
            ))}
        </div>
      )}

      <InputSelect
        label="Select your goal"
        id="goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        options={[
          Goal.GENERAL,
          Goal.GAINWEIGHT,
          Goal.WEIGHTMAINTAIN,
          Goal.LOSSWEIGHT,
        ]}
      />
      <InputSelect
        label="Select your exercise"
        id="exercise"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        options={[
          Exercise.NONE,
          Exercise.LOW,
          Exercise.MEDIUM,
          Exercise.HIGH,
          Exercise.SPORTMAN,
        ]}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
