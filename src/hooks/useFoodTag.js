import { useState, useEffect } from "react";

const useFoodTag = () => {
  const [foodTags, setFoodTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFoodTage = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/foodTag`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch food data");
      }
      const data = await res.json();
      setFoodTags(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodTage();
  }, []);

  return { foodTags, loading, error };
};

export default useFoodTag;
