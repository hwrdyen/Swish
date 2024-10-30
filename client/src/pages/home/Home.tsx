import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTeams } from "../../hooks/useTeam";
import { useTours } from "../../hooks/useTour";
import { useGames } from "../../hooks/useGame";

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

  const handleCreateGame = () => {
    navigate("/create-game");
  };

  // Fetch team data from the API
  const { allCreatedTeamData, fetchingCreatedTeams } = useTeams();

  // Fetch my-tour data from the API
  const { allTourData, fetchingTours } = useTours();

  const { allGameData } = useGames();

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
          <button onClick={handleCreateGame}>Create Game</button>
          <div>
            <h2>Created Teams:</h2>
            {!fetchingCreatedTeams ? (
              allCreatedTeamData.length > 0 ? (
                <ul>
                  {allCreatedTeamData.map((CreatedTeam) => (
                    <li key={CreatedTeam.id}>
                      <Link to={`/team/${CreatedTeam.id}`}>
                        {CreatedTeam.team_name}
                      </Link>
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
            {allGameData.length > 0 ? (
              <ul>
                {allGameData.map((allSingleGame) => {
                  return (
                    <Link to={`/game/${allSingleGame.id}`}>
                      <li key={allSingleGame.id}>
                        {new Date(allSingleGame.game_date).toLocaleDateString()}{" "}
                        {allSingleGame.home_team_id} vs{" "}
                        {allSingleGame.away_team_id}
                      </li>
                    </Link>
                  );
                })}
              </ul>
            ) : (
              <p>No games available.</p> // Optional: Add a message when there are no games
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
