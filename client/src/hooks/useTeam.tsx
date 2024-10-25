import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest"; // Adjust path as needed
import { TeamData } from "../config/team-config";

export const useTeams = () => {
  const [allCreatedTeamData, setAllCreatedTeamData] = useState<TeamData[]>([]);
  const [fetchingCreatedTeams, setFetchingCreatedTeams] = useState(true);

  const fetchCreatedTeams = async () => {
    try {
      const response = await apiRequest.get("/team/created-teams");
      setAllCreatedTeamData(response.data);
    } catch (error) {
      console.error("Failed to fetch team data", error);
    } finally {
      setFetchingCreatedTeams(false);
    }
  };

  useEffect(() => {
    fetchCreatedTeams();
  }, [allCreatedTeamData]);

  const [allTeamData, setAllTeamData] = useState<TeamData[]>([]);
  const [fetchingAllTeams, setFetchingAllTeams] = useState(true);

  const fetchAllTeams = async () => {
    try {
      const response = await apiRequest.get("/team/all-teams");
      setAllTeamData(response.data);
    } catch (error) {
      console.error("Failed to fetch team data", error);
    } finally {
      setFetchingAllTeams(false);
    }
  };

  useEffect(() => {
    fetchAllTeams();
  }, [allTeamData]);

  return {
    allCreatedTeamData,
    fetchingCreatedTeams,
    fetchCreatedTeams,
    allTeamData,
    fetchingAllTeams,
    fetchAllTeams,
  };
};
