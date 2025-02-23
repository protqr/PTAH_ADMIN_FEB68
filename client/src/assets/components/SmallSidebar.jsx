import { FaTimes } from "react-icons/fa";
import { useDashboardContext } from "../../pages/DashboardLayout";
import Wrapper from "../wrappers/SmallSidebar";
import Logo from "./Logo";
import links from "../../utils/link";
import NavLinks from "./Navlinks";
import toggleSidebar from "./Navbar";

const SmallSidebar = () => {
  const data = useDashboardContext();
  console.log(data);

  return (
    <Wrapper>
      <div
        className={`sidebar-container ${
          data.showSidebar ? "show-sidebar" : ""
        }`}
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};
export default SmallSidebar;
