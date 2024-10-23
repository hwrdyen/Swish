import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest"; // Adjust path as needed
import { TeamData } from "../config/team-config";

export const useTeams = () => {
  const [allTeamData, setAllTeamData] = useState<TeamData[]>([]);
  const [fetchingTeams, setFetchingTeams] = useState(true);

  const fetchTeams = async () => {
    try {
      const response = await apiRequest.get("/team/created-teams");
      setAllTeamData(response.data);
    } catch (error) {
      console.error("Failed to fetch team data", error);
    } finally {
      setFetchingTeams(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [allTeamData]);

  return { allTeamData, fetchingTeams, fetchTeams };
};
