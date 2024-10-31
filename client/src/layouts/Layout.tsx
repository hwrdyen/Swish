import "./Layout.scss";
import Navbar from "../components/navbar/Navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="Layout__container">
      <Navbar />
      <div className="Layout--child__container">{children}</div>
    </div>
  );
};

export default Layout;
