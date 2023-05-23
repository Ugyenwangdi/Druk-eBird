import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { logo, profile } from "../images";
import "../styles/topbar.css";

function TopBar({ onToggleSidebar, currentUser, setSearchQuery, searchQuery }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      navigate("/species");
    }
  }, [searchQuery, navigate]);

  return (
    <nav>
      <div className="container">
        <img src={logo} className="logo" alt="" />
        <div className="search-bar">
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Search Bird names "
            onChange={({ currentTarget: input }) => setSearchQuery(input.value)}
          />
        </div>
        <div className="profile-area">
          <div className="profile">
            <div className="profile-photo">
              <img
                src={currentUser.profile ? currentUser.profile : profile}
                alt="profile"
              />
            </div>
            <h5>{currentUser.name ? currentUser.name : "User"}</h5>
          </div>
          <button id="menu-btn" onClick={onToggleSidebar}>
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
export default TopBar;
