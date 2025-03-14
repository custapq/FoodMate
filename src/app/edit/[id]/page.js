"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputRadio from "@/components/InputRadio";
import InputText from "@/components/InputText";
import InputSelect from "@/components/InputSelect";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";

const fetchUser = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${id}`);
  const data = await res.json();
  return data;
};

// ตัวแปรประเภท
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

export default function EditUser({ params }) {
  const router = useRouter();
  const { id } = params;

  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session?.user?.id !== parseInt(id)) {
      router.push("/");
    }
  }, [session, status, id, router]);

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [gender, setGender] = useState(Gender.MALE);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState(Goal.GENERAL);
  const [exercise, setExercise] = useState(Exercise.NONE);
  const [condition, setCondition] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUser(id);
      setGender(userData.gender);
      setAge(userData.age);
      setWeight(userData.weight);
      setHeight(userData.height);
      setGoal(userData.goal);
      setExercise(userData.exercise);
      setCondition(userData.condition);
    };
    loadUserData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      age,
      weight,
      height,
      gender,
      goal,
      exercise,
      condition,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${id}`,
        {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      const data = await res.json();
      console.log("User updated:", data);

      router.push(`/user/${id}`); 
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
      <Button type="submit">Update</Button>
    </form>
  );
}
