"use client";
import { useState, useEffect } from "react";

const useTodayRecommendations = (userId) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTodayRecommendations = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/recommendation/today/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        if (isMounted) {
          setRecommendations(data || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching today's recommendations:", error);
          setError("Could not fetch recommendations for today.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTodayRecommendations();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { recommendations, loading, error };
};

export default useTodayRecommendations;
