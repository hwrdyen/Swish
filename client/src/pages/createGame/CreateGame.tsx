import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTours } from "../../hooks/useTour";
import { useTeams } from "../../hooks/useTeam";

const CreateGame = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn } = authContext;

  const { allTeamData } = useTeams();
  const { allTourData } = useTours();

  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");

  const handleHomeTeamSelectChange = (value: string) => {
    setHomeTeam(value);
  };

  const handleAwayTeamSelectChange = (value: string) => {
    setAwayTeam(value);
  };

  if (!allTeamData || !allTourData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {isLoggedIn ? (
          allTourData.length > 0 ? (
            <form>
              <h1>Create A Game</h1>

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
