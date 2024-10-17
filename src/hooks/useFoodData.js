import { useState, useEffect } from "react";

const useFoodData = (foodIds) => {
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFood = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/foods/${foodIds}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch food data");
      }
      const data = await res.json();
      setFoodData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (foodIds) {
      fetchFood();
    }
  }, [foodIds]);

  return { foodData, loading, error };
};

export default useFoodData;
