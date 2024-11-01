"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useFoodData from "@/hooks/useFoodData";
import useFoodsData from "@/hooks/useFoodsData";
import useUserData from "@/hooks/useUserData";
import FoodCard from "@/components/FoodCard";
import Button from "@/components/Button";
import useTodayRecommendation from "@/hooks/useTodayRecommendation";
import { useSession } from "next-auth/react";

import { calculateBMR, calculateTDEE } from "@/util/calculate";
import LoadingScreen from "@/components/LoadingScreen";

const AVERAGE = 0;

const getFoodRecommend = (user, foodsData) => {
  return foodsData
    .filter((food) => foodScore(user, food) >= AVERAGE)
    .map((food) => food.id);
};

const foodScore = (user, food) => {
  return food.nutrientList.reduce(
    (score, nutrient) => score + checkCondition(user.conditionId, nutrient),
    0
  );
};

const checkCondition = (conditionId, nutrient) => {
  switch (conditionId) {
    case 1:
      switch (nutrient.nutrientId) {
        case 4:
          return nutrient.amount > 17.5 ? -50 : 0;
        case 11:
          return nutrient.amount > 600 ? -50 : 0;
        case 25:
          return nutrient.amount > 22.5 ? -50 : 0;
        default:
          return 0;
      }
    case 6:
      switch (nutrient.nutrientId) {
        case 25:
          return nutrient.amount > 15 ? -50 : 0;
        case 4:
          return nutrient.amount > 10 ? -20 : 0;
        default:
          return 0;
      }
    case 8:
      switch (nutrient.nutrientId) {
        case 5:
          return nutrient.amount < 1000 ? -20 : 0;
        case 3:
          return nutrient.amount > 800 ? -30 : 0;
        default:
          return 0;
      }
    default:
      return 0;
  }
};

const RecommendationPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  console.log("session.user.id", session.user.id);
  console.log("id", id);
  console.log("parseInt(id)", parseInt(id));
  console.log("status", status);

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("unauthorized");
      router.push("/");
    } else if (session?.user?.id !== parseInt(id)) {
      console.log("user id not match");
      router.push("/");
    }
  }, [session?.user?.id, status, id, router]);

  if (status !== "authenticated") {
    return <div>Loading...</div>;
  }

  const { recommendations, loading, error } = useTodayRecommendation(id);

  const [selectedFoods, setSelectedFoods] = useState([]);

  const { userData } = useUserData(id);
  const { foodsData } = useFoodsData();

  // const filteredFood = foodsData.filter((food) =>
  //   food.foodTagList.some((tag) => tag.foodTag.id === 16)
  // );

  // console.log(filteredFood);

  const recommendedFoodIds = useMemo(() => {
    if (userData && foodsData) {
      return getFoodRecommend(userData, foodsData);
    }
    return [];
  }, [userData, foodsData]);

  const { foodData, loadingFood, errorFood } = useFoodData(recommendedFoodIds);

  const currentEnergy = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return 0;

    return recommendations.reduce((total, recommendation) => {
      return (
        total +
        recommendation.foodRecommendation.reduce((acc, food) => {
          return (
            acc +
            food.food.nutrientList.reduce((sum, nutrient) => {
              return nutrient.nutrientId === 1 ? sum + nutrient.amount : sum;
            }, 0)
          );
        }, 0)
      );
    }, 0);
  }, [recommendations]);

  const { age, weight, height, gender, exercise } = userData || {};
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, exercise);

  const calculateSelectedFoodsEnergy = () => {
    return selectedFoods.reduce((total, foodId) => {
      const food = foodData.find((food) => food.id === foodId);
      if (food) {
        const energyNutrient = food.nutrientList.find(
          (nutrient) => nutrient.nutrientId === 1
        );
        return total + (energyNutrient ? energyNutrient.amount : 0);
      }
      return total;
    }, 0);
  };

  const selectedFoodEnergy = calculateSelectedFoodsEnergy();
  const updatedEnergy = currentEnergy + selectedFoodEnergy;

  const currentProgress = (currentEnergy / tdee) * 100;
  const selectedProgress = (selectedFoodEnergy / tdee) * 100;

  const isLoading = loading || loadingFood || !userData || !foodsData;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (errorFood) return <div>Error: {errorFood}</div>;

  const handleFoodClick = (foodId) => {
    setSelectedFoods((prev) => {
      if (prev.includes(foodId)) {
        // ถ้ามี foodId อยู่แล้ว ให้ลบออก
        return prev.filter(id => id !== foodId);
      } else {
        // ถ้ายังไม่มี foodId ให้เพิ่มเข้าไป
        return [...prev, foodId];
      }
    });
  };

  const handleButtonSelect = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/recommendation/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foodRecommendation: selectedFoods,
            timeStamp: new Date().getTime(),
          }),
        }
      );

      if (res.ok) {
        setSelectedFoods([]);
        router.push(`/user/${id}/history`);
        // router.push(`/recommendation/${id}`);
      } else {
        console.error("Failed to submit recommendation");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClearAll = () => {
    setSelectedFoods([]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="container mx-auto flex items-center justify-between">
        <span>พลังงานวันนี้</span>
        <span>
          {updatedEnergy} / {Math.round(tdee)} kcal
        </span>
      </div>
      <div className="container mx-auto mt-2">
        <div className="bg-gray-200 rounded-full h-4 relative">
          <div
            className="absolute bg-green-400 h-4 transition-all duration-300 ease-in-out"
            style={{ width: `${currentProgress}%` }}
          ></div>
          <div
            className="absolute bg-yellow-400 h-4 transition-all duration-300 ease-in-out"
            style={{
              width: `${selectedProgress}%`,
              left: `${currentProgress}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="p-1 w-full max-w-6xl mx-auto">
        <div className="w-full overflow-x-auto my-5">
          <h3>Selected Foods:</h3>
          <div className="flex space-x-4">
            {selectedFoods.map((foodId) => {
              const selectedFood = foodData.find((food) => food.id === foodId);
              return selectedFood ? (
                <FoodCard key={foodId} food={selectedFood} />
              ) : null;
            })}
          </div>
          {selectedFoods.length > 0 && (
            <Button type="button" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>

        <h3>อาหารทั้งหมด</h3>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4">
            {foodData.map((food) => (
              <div
                key={food.id}
                onClick={() => handleFoodClick(food.id)}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        </div>

        <h3>กับข้าว</h3>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4">
            {foodData
              .filter((food) =>
                food.foodTagList.some((tag) => tag.foodTag.id === 2)
              )
              .map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleFoodClick(food.id)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <FoodCard food={food} />
                </div>
              ))}
          </div>
        </div>

        <h3>ก๋วยเตี๊ยว</h3>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4">
            {foodData
              .filter((food) =>
                food.foodTagList.some((tag) => tag.foodTag.id === 6)
              )
              .map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleFoodClick(food.id)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <FoodCard food={food} />
                </div>
              ))}
          </div>
        </div>

        <h3>อาหารจานเดียว</h3>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4">
            {foodData
              .filter((food) =>
                food.foodTagList.some((tag) => tag.foodTag.id === 16)
              )
              .map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleFoodClick(food.id)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <FoodCard food={food} />
                </div>
              ))}
          </div>
        </div>

        <div className="grid grid-rows-1 gap-2 mt-4">
          <Button
            type="button"
            onClick={handleButtonSelect}
            disabled={selectedFoods.length === 0}
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
