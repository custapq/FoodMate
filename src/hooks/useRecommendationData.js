"use client";
import { useState, useEffect } from "react";

const useRecommendationData = (userId) => {
  const [recData, setRecData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendation = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/recommendation/user/${userId}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await res.json();
      setRecData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, [userId]);

  return { recData, loading, error };
};

export default useRecommendationData;
