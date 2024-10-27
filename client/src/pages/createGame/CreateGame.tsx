import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTours } from "../../hooks/useTour";

const CreateGame = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn } = authContext;

  const { allTourData } = useTours();

  return (
    <div>
      <div>
        {isLoggedIn ? (
          allTourData.length > 0 ? (
            <form>
              <h1>Create A Game</h1>
            </form>
          ) : (
            <Link to={"/create-tour"}>Create Tournament First</Link>
          )
        ) : (
          <div>
            please login at <Link to={"/login"}>Login</Link>{" "}
          </div>
        )}
      </div>
      <Link to={"/"}>Home</Link>
    </div>
  );
};

export default CreateGame;
