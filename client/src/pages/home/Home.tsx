import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequest";
import { TeamData } from "../../config/team-config";

const Home = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { currentUser, isLoggedIn } = authContext;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/create-team");
  };

  // Fetch team data from the API
  const [allTeamData, setAllTeamData] = useState<TeamData[]>([]);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiRequest.get("/team");
        setAllTeamData(response.data); // Assuming the data is stored in response.data
        // console.log(response.data); // Log fetched data
      } catch (error) {
        console.error("Failed to fetch team data", error);
      }
    };

    fetchTeams();
  }, []); // Empty dependency array to fetch once on component mount
  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>Hello {currentUser?.username}</p>
          <button onClick={handleClick}>Create My Team</button>
          <div>
            <h2>All Teams:</h2>
            {allTeamData.length > 0 ? (
              <ul>
                {allTeamData.map((team) => (
                  <li key={team.id}>{team.team_name}</li>
                ))}
              </ul>
            ) : (
              <p>No teams available</p>
            )}
          </div>
        </>
      ) : (
        <p>Hello World</p>
      )}
    </div>
  );
};

export default Home;
