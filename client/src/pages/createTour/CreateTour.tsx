import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const CreateTour = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn } = authContext;

  return (
    <div>
      <div>
        {isLoggedIn ? (
          <div>Logged In</div>
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

export default CreateTour;
