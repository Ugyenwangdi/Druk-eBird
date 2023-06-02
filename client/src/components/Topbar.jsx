import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logo, profile } from "../images";
import LogoutModal from "./LogoutModal";
import "../styles/topbar.css";

function TopBar({ onToggleSidebar, currentUser, setSearchQuery, searchQuery }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      navigate("/species");
    }

    // Add the event listener here
    const handleMouseMove = (e) => {
      const topbarNav = document.querySelector(".topbar-nav");
      const x = e.pageX - topbarNav.offsetLeft;
      const y = e.pageY - topbarNav.offsetTop;
      topbarNav.style.setProperty("--cursorX", x + "px");
      topbarNav.style.setProperty("--cursorY", y + "px");
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [searchQuery, navigate]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNavigateToSettings = () => {
    setShowDropdown(false);
    navigate("/settings");
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };
  const handleLogoutConfirm = () => {
    setShowDropdown(false);
    // Make a POST request to your backend to log out the user
    axios
      .post("http://localhost:8080/auth/logout")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    // Remove the sessionId from local storage
    localStorage.removeItem("token");

    // Redirect the user to the login page
    window.location = "/login";
  };

  return (
    <nav className="topbar-nav">
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
            <div className="profile-photo" onClick={handleDropdownToggle}>
              <img
                src={currentUser.profile ? currentUser.profile : profile}
                alt="profile"
              />
            </div>
            <h5>{currentUser.name ? currentUser.name : "User"}</h5>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleNavigateToSettings}>
                  <span class="material-symbols-outlined">settings</span>
                  Settings
                </button>
                <button onClick={handleLogoutConfirmation}>
                  <span class="material-symbols-outlined">logout</span>Logout
                </button>
              </div>
            )}
          </div>
          <button id="menu-btn" onClick={onToggleSidebar}>
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>
      {showLogoutModal && (
        <LogoutModal
          message="Are you sure you want to Logout?"
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </nav>
  );
}
export default TopBar;
