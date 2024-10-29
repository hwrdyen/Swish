import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTours } from "../../hooks/useTour";
import { useTeams } from "../../hooks/useTeam";
import { apiRequest } from "../../lib/apiRequest";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useGames } from "../../hooks/useGame";
import { AxiosError } from "axios";

const CreateGame = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn } = authContext;
  const navigate = useNavigate();

  const { allTeamData } = useTeams();
  const { allTourData } = useTours();
  const { fetchGames } = useGames();

  const [gameDate, setGameDate] = useState<Date | null>(new Date());
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [tournament, setTournament] = useState<string>("");

  const handleHomeTeamSelectChange = (value: string) => {
    setHomeTeam(value);
  };

  const handleAwayTeamSelectChange = (value: string) => {
    setAwayTeam(value);
  };

  const handleTourSelectChange = (value: string) => {
    setTournament(value);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest.post("/game/create-game", {
        id: uuidv4(),
        game_date: gameDate,
        home_team_id: homeTeam,
        away_team_id: awayTeam,
        tournament_id: tournament,
      });
      await fetchGames();
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
        setError(err.response?.data.message || "An error occurred.");
      } else {
        console.log("Error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!allTeamData || !allTourData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {isLoggedIn ? (
          allTourData.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <h1>Create A Game</h1>

              <h2>Select Game Date</h2>
              <DatePicker
                selected={gameDate}
                onChange={(date) => setGameDate(date)}
              />
              <h2>Select Home Team</h2>
              <div id="hometeam_container">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <select
                    value={homeTeam}
                    onChange={(e) => handleHomeTeamSelectChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Home Team
                    </option>
                    {allTeamData.map((allTeamSingleData) => (
                      <option
                        key={allTeamSingleData.id}
                        value={allTeamSingleData.id}
                      >
                        {allTeamSingleData.team_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2>Select Away Team</h2>
              <div id="awayteam_container">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <select
                    value={awayTeam}
                    onChange={(e) => handleAwayTeamSelectChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Away Team
                    </option>
                    {allTeamData.map((allTeamSingleData) => (
                      <option
                        key={allTeamSingleData.id}
                        value={allTeamSingleData.id}
                      >
                        {allTeamSingleData.team_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2>Select Tournament</h2>
              <div id="tournament_container">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <select
                    value={tournament}
                    onChange={(e) => handleTourSelectChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Tournament
                    </option>
                    {allTourData.map((allSingleTourData) => (
                      <option
                        key={allSingleTourData.id}
                        value={allSingleTourData.id}
                      >
                        {allSingleTourData.tournament_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={isLoading}>
                Create
              </button>
              {error && <span>{error}</span>}
            </form>
          ) : (
            <Link to={"/create-tour"}>Create Tournament First</Link>
          )
        ) : (
          <div>
            Please login at <Link to={"/login"}>Login</Link>
          </div>
        )}
      </div>
      <Link to={"/"}>Home</Link>
    </div>
  );
};

export default CreateGame;
