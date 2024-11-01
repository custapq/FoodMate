"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputRadio from "../../components/InputRadio"; // Import InputRadio component
import InputText from "../../components/InputText"; // Import InputText component
import InputSelect from "../../components/InputSelect"; // Import InputSelect component
import Button from "../../components/Button"; // Import Button component

const fetchConditions = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/conditions`);
  const data = await res.json();
  return data;
};

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
  const router = useRouter();

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [gender, setGender] = useState(Gender.MALE);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState(Goal.GENERAL);
  const [exercise, setExercise] = useState(Exercise.NONE);
  const [conditions, setConditions] = useState([]);
  const [condition, setCondition] = useState([]);
  const [hasCondition, setHasCondition] = useState(false);
  const [loadingCondition, setLoadingCondition] = useState(true);
  const [error, setError] = useState("");

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
      setCondition(condition.filter((id) => id !== conditionId));
    } else {
      setCondition([...condition, conditionId]);
    }
  };

  const validateAge = (age) => {
    const ageNum = Number(age);
    return ageNum >= 1 && ageNum <= 120;
  };

  const validateWeight = (weight) => {
    const weightNum = Number(weight);
    return weightNum >= 20 && weightNum <= 300;
  };

  const validateHeight = (height) => {
    const heightNum = Number(height);
    return heightNum >= 50 && heightNum <= 250;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateAge(age)) {
      setError("กรุณาระบุอายุที่ถูกต้อง (1-120 ปี)");
      return;
    }

    if (!validateWeight(weight)) {
      setError("กรุณาระบุน้ำหนักที่ถูกต้อง (20-300 กิโลกรัม)");
      return;
    }

    if (!validateHeight(height)) {
      setError("กรุณาระบุส่วนสูงที่ถูกต้อง (50-250 เซนติเมตร)");
      return;
    }

    const userId = localStorage.getItem("userId");
    const userData = {
      userId: Number(userId),
      age,
      weight,
      height,
      gender,
      goal,
      exercise,
      condition,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Failed to create user details");
      }

      const data = await res.json();
      console.log("User details created:", data);

      router.push(`/recommendation/${userId}`);
    } catch (error) {
      setError(error.message);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Create Profile</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 md:gap-6">
          <InputText
            label="Height"
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
          <InputText
            label="Weight"
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <InputText
            label="Age"
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
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
                setCondition([]);
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
                setCondition([]);
              }}
              label="ไม่มี"
            />
          </div>
        </div>

        {hasCondition && !loadingCondition && (
          <div className="mt-4">
            <label>เลือกโรคประจำตัวของคุณ:</label>
            {conditions.map((conditionItem) => (
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
        <Button type="submit">Create Profile</Button>
      </form>
    </div>
  );
}
