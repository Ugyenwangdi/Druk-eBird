import { logo, profile } from "../images";
import "../styles/topbar.css";

function TopBar({ onToggleSidebar }) {
  return (
    <nav>
      <div className="container">
        <img src={logo} className="logo" alt="" />
        <div className="search-bar">
          <span className="material-icons">search</span>
          <input
            type="search"
            placeholder="Search Bird Species, Birding sites, Birders etc"
          />
        </div>
        <div className="profile-area">
          <div className="profile">
            <div className="profile-photo">
              <img src={profile} alt="profile" />
            </div>
            <h5>Karma Choden</h5>
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
