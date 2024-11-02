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
import useFavorites from "@/hooks/useFavorites";

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
  const { favorites, toggleFavorite } = useFavorites(parseInt(id));

  // console.log("session.user.id", session.user.id);
  // console.log("id", id);
  // console.log("parseInt(id)", parseInt(id));
  // console.log("status", status);

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

  const displayCurrentProgress = Math.min((currentEnergy / tdee) * 100, 100);
  const displaySelectedProgress = Math.min(
    ((currentEnergy + selectedFoodEnergy) / tdee) * 100,
    100
  );

  const isLoading = loading || loadingFood || !userData || !foodsData;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (errorFood) return <div>Error: {errorFood}</div>;

  const handleFoodClick = (foodId) => {
    setSelectedFoods((prev) => {
      if (prev.includes(foodId)) {
        // ถ้ามี foodId อยู่แล้ว ให้ลบออก
        return prev.filter((id) => id !== foodId);
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
    <div className="flex flex-col items-center min-h-screen pb-28">
      <div className="container mx-auto flex items-center justify-between">
        <span>พลังงานวันนี้</span>
        <span
          className={updatedEnergy > tdee ? "text-red-500 font-medium" : ""}
        >
          {updatedEnergy} / {Math.round(tdee)} kcal
        </span>
      </div>
      <div className="container mx-auto mt-2">
        <div className="bg-gray-200 rounded-full h-4 relative">
          <div
            className={`absolute h-4 transition-all duration-300 ease-in-out ${
              currentEnergy > tdee ? "bg-red-500" : "bg-green-400"
            }`}
            style={{ width: `${displayCurrentProgress}%` }}
          ></div>
          <div
            className={`absolute h-4 transition-all duration-300 ease-in-out ${
              updatedEnergy > tdee ? "bg-red-300" : "bg-yellow-400"
            }`}
            style={{
              width: `${displaySelectedProgress - displayCurrentProgress}%`,
              left: `${displayCurrentProgress}%`,
            }}
          ></div>
        </div>
      </div>
      {updatedEnergy > tdee && (
        <div className="container mx-auto mt-2">
          <p className="text-red-500 text-sm">
            ⚠️ พลังงานที่ได้รับเกินปริมาณที่แนะนำต่อวัน
          </p>
        </div>
      )}

      <div className="p-1 w-full max-w-6xl mx-auto">
        {selectedFoods.length > 0 && (
          <div className="w-full my-5">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-orange-500">
              อาหารที่เลือก
            </h2>
            <div className="flex space-x-4 overflow-x-auto mb-4">
              {selectedFoods.map((foodId) => {
                const selectedFood = foodData.find(
                  (food) => food.id === foodId
                );
                return selectedFood ? (
                  <FoodCard key={foodId} food={selectedFood} />
                ) : null;
              })}
            </div>

            {selectedFoods.length > 0 && (
              <div className="flex justify-between gap-4 mt-4 mb-8">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-2 px-4 text-gray-600 hover:text-red-600 transition-colors duration-200 border border-red-600 rounded-lg"
                >
                  ล้างรายการทั้งหมด
                </button>
                <button
                  onClick={handleButtonSelect}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  ยืนยันรายการอาหาร ({selectedFoods.length})
                </button>
              </div>
            )}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-orange-500">
          อาหารทั้งหมด
        </h2>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4">
            {foodData.map((food) => (
              <div
                key={food.id}
                onClick={() => handleFoodClick(food.id)}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <FoodCard 
                  food={food} 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 pb-2 border-b-2 border-orange-500">
          อาหารที่ชื่นชอบ
        </h2>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4">
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <div
                  key={favorite.foodId}
                  onClick={() => handleFoodClick(favorite.foodId)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <FoodCard 
                    food={favorite.food} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 py-4">ยังไม่มีอาหารที่ชื่นชอบ</p>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 pb-2 border-b-2 border-orange-500">
          อาหารประเภทผัด
        </h2>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4">
            {foodData
              .filter((food) =>
                food.foodTagList.some((tag) => tag.foodTag.id === 10)
              )
              .map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleFoodClick(food.id)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <FoodCard 
                    food={food} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 pb-2 border-b-2 border-orange-500">
          อาหารประเภทแกง
        </h2>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4">
            {foodData
              .filter((food) =>
                food.foodTagList.some((tag) => tag.foodTag.id === 7)
              )
              .map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleFoodClick(food.id)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <FoodCard 
                    food={food} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 pb-2 border-b-2 border-orange-500">
          ก๋วยเตี๋ยว
        </h2>
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
                  <FoodCard 
                    food={food} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 pb-2 border-b-2 border-orange-500">
          อาหารจานเดียว
        </h2>
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
                  <FoodCard 
                    food={food} 
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
