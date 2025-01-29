"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useFoodData from "@/hooks/useFoodData";
import useFoodsData from "@/hooks/useFoodsData";
import useUserData from "@/hooks/useUserData";
import FoodCard from "@/components/FoodCard";
import useTodayRecommendation from "@/hooks/useTodayRecommendation";
import { useSession, getSession } from "next-auth/react";
import useFoodTag from "@/hooks/useFoodTag";

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
        case 4: //fat
          return nutrient.amount > 17.5 ? -50 : 0;
        case 11: //sodium
          return nutrient.amount > 600 ? -50 : 0;
        case 25: //sugar
          return nutrient.amount > 22.5 ? -50 : 0;
        default:
          return 0;
      }
    // case 6:
    //   switch (nutrient.nutrientId) {
    //     case 25:
    //       return nutrient.amount > 15 ? -50 : 0;
    //     case 4:
    //       return nutrient.amount > 10 ? -20 : 0;
    //     default:
    //       return 0;
    //   }
    // case 8:
    //   switch (nutrient.nutrientId) {
    //     case 5:
    //       return nutrient.amount < 1000 ? -20 : 0;
    //     case 3:
    //       return nutrient.amount > 800 ? -30 : 0;
    //     default:
    //       return 0;
    //   }
    default:
      return 0;
  }
};

const RecommendationPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      console.log("session from getSession:", session?.user?.id);
      console.log("id:", id);
      console.log("parseInt(id):", parseInt(id));

      if (!session) {
        console.log("unauthorized - no session");
        router.push("/");
        return;
      }

      if (session.user.id !== parseInt(id)) {
        console.log("user id not match");
        router.push("/");
      }
    };

    checkSession();
  }, [id, router]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  const { recommendations, loading, error } = useTodayRecommendation(id);

  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);

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
  const { foodTags, loading: loadingTags, error: errorTags } = useFoodTag(); // 🔹 ดึง FoodTags

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const results = foodData.filter((food) =>
      food.thaiName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFoods(results);
  }, [searchQuery, foodData]);

  const filteredFoodData = useMemo(() => {
    if (searchQuery) {
      return foodData.filter((food) =>
        food.thaiName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (!selectedTag) return foodData;

    return foodData.filter((food) =>
      food.foodTagList.some((tag) => tag.foodTag.id === selectedTag)
    );
  }, [foodData, selectedTag, searchQuery]);

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
      <div className="container mx-auto my-2">
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

        <div className="container mx-auto mt-2 flex gap-4 items-center">
          <select
            value={selectedTag || ""}
            onChange={(e) =>
              setSelectedTag(e.target.value ? parseInt(e.target.value) : null)
            }
            className="p-2 border rounded"
          >
            <option value="">แสดงทั้งหมด</option>
            {foodTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="ค้นหาอาหาร..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border rounded flex-1"
          />
        </div>
        
        <div className="p-1 w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-orange-500">
            อาหารทั้งหมด
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {filteredFoodData.map((food) => (
              <div
                key={food.id}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleFoodClick(food.id)}
              >
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
