import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequest";
import { TourData } from "../../config/tournament-config";
import { useTeams } from "../../hooks/useTeam";

const Home = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { currentUser, isLoggedIn } = authContext;

  const navigate = useNavigate();
  const handleCreateTeam = () => {
    navigate("/create-team");
  };
  const handleCreateTournament = () => {
    navigate("/create-tour");
  };

  // Fetch team data from the API
  const { allTeamData, fetchingTeams } = useTeams();

  // Fetch my-tour data from the API
  const [allTourData, setAllTourData] = useState<TourData[]>([]);
  const [fetchingTours, setFetchingTours] = useState(true);
  const fetchTours = async () => {
    try {
      const response = await apiRequest.get("/user/my-tours");
      setAllTourData(response.data); // Assuming the data is stored in response.data
    } catch (error) {
      console.error("Failed to fetch tour data", error);
    } finally {
      setFetchingTours(false);
    }
  };
  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>Hello {currentUser?.username}</p>
          <p>
            Check your <Link to={"/profile"}>Profile</Link>
          </p>
          <button onClick={handleCreateTeam}>Create My Team</button>
          <button onClick={handleCreateTournament}>Create My Tournament</button>
          <div>
            <h2>Created Teams:</h2>
            {!fetchingTeams ? (
              allTeamData.length > 0 ? (
                <ul>
                  {allTeamData.map((team) => (
                    <li key={team.id}>
                      <Link to={`/team/${team.id}`}>{team.team_name}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No teams available</p>
              )
            ) : (
              <p>Fetching Teams...</p>
            )}

            <h2>Participated Tournament:</h2>
            {!fetchingTours ? (
              allTourData.length > 0 ? (
                <ul>
                  {allTourData.map((tour) => (
                    <li key={tour.id}>
                      <Link to={`/tour/${tour.id}`}>
                        {tour.tournament_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tours available</p>
              )
            ) : (
              <p>Fetching Tours...</p>
            )}

            <h2>All Game Schedule:</h2>
          </div>
        </>
      ) : (
        <p>Hello World</p>
      )}
    </div>
  );
};

export default Home;
