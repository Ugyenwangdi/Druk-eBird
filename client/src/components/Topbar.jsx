import { useState, useEffect, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { logo, profile } from "../images";
import LogoutModal from "./LogoutModal";
import "../styles/topbar.css";

function TopBar({ onToggleSidebar, currentUser, setSearchQuery, searchQuery }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchQuery) {
      navigate("/species");
    }

    const handleMouseMove = (e) => {
      const topbarNav = document.querySelector(".topbar-nav");
      const x = e.pageX - topbarNav.offsetLeft;
      const y = e.pageY - topbarNav.offsetTop;
      topbarNav.style.setProperty("--cursorX", x + "px");
      topbarNav.style.setProperty("--cursorY", y + "px");
    };

    document.addEventListener("mousemove", handleMouseMove);

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleOutsideClick);
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

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Fetch notifications from the server
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/notifications`
        );

        setNotifications(response.data.notifications);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const notificationCount = notifications.length;

  return (
    <nav className="topbar-nav">
      <div className="container">
        <Link to="/" className="logo-link">
          <img src={logo} className="logo" alt="" />
        </Link>
        <div className="search-bar">
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Search Bird name, Scientific name, Species "
            onChange={({ currentTarget: input }) => setSearchQuery(input.value)}
          />
        </div>
        <Link to="/notifications" className="notification">
          <span className="material-icons">notifications</span>
          <div className="notification-count">{notificationCount}</div>
        </Link>
        <div className="profile-area">
          <div className="profile" onClick={handleDropdownToggle}  ref={dropdownRef}>
            <div className="profile-photo">
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
          <button id="menu-btn" className="menu-bar" onClick={onToggleSidebar}>
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
