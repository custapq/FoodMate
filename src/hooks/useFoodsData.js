import { useState, useEffect } from "react";

const useFoodsData = () => {
  const [foodsData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFood = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/foods`);
      if (!res.ok) {
        throw new Error("Failed to fetch food data");
      }
      const data = await res.json();
      setFoodData(data); // สมมติว่าข้อมูลที่ได้เป็น array ของอาหาร
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, []);

  return { foodsData, loading, error };
};

export default useFoodsData;
