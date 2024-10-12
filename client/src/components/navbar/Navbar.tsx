import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <Link to={"/"}>Swish</Link>
      <Link to={"/register"}>Register</Link>
    </>
  );
};

export default Navbar;
