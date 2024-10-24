import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest"; // Adjust path as needed
import { TourData } from "../config/tournament-config";

export const useTours = () => {
  const [allTourData, setAllTourData] = useState<TourData[]>([]);
  const [fetchingTours, setFetchingTours] = useState(true);

  const fetchTours = async () => {
    try {
      const response = await apiRequest.get("/tour/all");
      setAllTourData(response.data);
    } catch (error) {
      console.error("Failed to fetch tour data", error);
    } finally {
      setFetchingTours(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [allTourData]);

  return { allTourData, fetchingTours, fetchTours };
};
