import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { currentUser, isLoggedIn } = authContext;

  return (
    <div className="Navbar__container">
      <Link to={"/"} className="Navbar__home">
        Swish
      </Link>

      {isLoggedIn && currentUser ? (
        <div className="Navbar__auth">
          <Link to="/profile" className="Navbar__auth--link">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt="User Avatar"
                className="Navbar__auth--img"
              />
            ) : (
              <img
                src={"/user-avatar.png"}
                alt="Default Avatar"
                className="Navbar__auth--img"
              />
            )}
          </Link>
        </div>
      ) : (
        <Link to={"/login"}>Login</Link>
      )}
    </div>
  );
};

export default Navbar;
