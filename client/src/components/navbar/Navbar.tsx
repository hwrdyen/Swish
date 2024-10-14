import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AxiosError } from "axios";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequest";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn, updateUser } = authContext;

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
    } catch (err) {
      // Check if the error is an instance of AxiosError
      if (err instanceof AxiosError) {
        // Access error message from the response data
        console.log(err.response?.data.message);
      } else {
        // Handle non-Axios errors
        console.log("Error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link to={"/"}>Swish</Link>

      {isLoggedIn ? (
        <button onClick={handleLogout} disabled={isLoading}>
          Logout
        </button>
      ) : (
        <Link to={"/login"}>Login</Link>
      )}
    </>
  );
};

export default Navbar;
