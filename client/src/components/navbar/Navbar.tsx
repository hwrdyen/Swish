import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AxiosError } from "axios";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequest";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { currentUser, isLoggedIn, updateUser } = authContext;

  return (
    <>
      <Link to={"/"}>Swish</Link>

      {isLoggedIn && currentUser ? (
        <div>
          <Link to="/profile">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="User Avatar" />
            ) : (
              <img
                src={"/user-avatar.png"}
                alt="Default Avatar"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </Link>
        </div>
      ) : (
        <Link to={"/login"}>Login</Link>
      )}
    </>
  );
};

export default Navbar;
