"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import useFoodData from "../../../hooks/useFoodData";
import useFoodsData from "../../../hooks/useFoodsData";
import useUserData from "../../../hooks/useUserData";
import FoodCard from "../../../components/FoodCard";
import Button from "../../../components/Button";

const AVERAGE = 0;

const getFoodRecommend = (user, foodsData) => {
  let foods = [];
  foodsData.forEach((food) => {
    let score = foodScore(user, food);
    console.log(`Food ID: ${food.id}, Score: ${foodScore(user, food)}`);
    if (score >= AVERAGE) {
      foods.push(food.id);
    }
  });
  return foods;
};

function foodScore(user, food) {
  let score = 0;
  food.nutrientList.forEach((nutrient) => {
    score += checkCondition(nutrient);
  });
  return score;
}

function checkCondition(nutrient) {
  let score = 0;
  switch (nutrient.nutrientId) {
    case 4:
      if (nutrient.amount > 17.5) score -= 50;
      break;
    case 11:
      if (nutrient.amount > 600) score -= 50;
      break;
    case 25:
      if (nutrient.amount > 22.5) score -= 50;
      break;
    default:
      break;
  }
  return score;
}

const RecommendationPage = ({ params }) => {
  const { id } = params;

  const router = useRouter();
  const handleButton = () => {
    router.push(`/user/${id}`);
  };

  const { userData } = useUserData(id);
  const { foodsData } = useFoodsData();

  const recommendedFoodIds = useMemo(() => {
    if (userData && foodsData) {
      return getFoodRecommend(userData, foodsData);
    }
    return [];
  }, [userData, foodsData]);

  const { foodData, loadingFood, errorFood } = useFoodData(recommendedFoodIds);

  if (loadingFood) return <div>Loading food data...</div>;
  if (errorFood) return <div>Error: {errorFood}</div>;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-6/12 overflow-x-auto">
        <div className="flex space-x-4">
          {foodData.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </div>
      <div>
        <Button type="button" onClick={handleButton}>
          Info
        </Button>
      </div>
    </div>
  );
};

export default RecommendationPage;
