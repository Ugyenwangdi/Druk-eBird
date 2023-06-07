import React, { useState, useEffect } from "react";
import "../styles/sidebar.css";
import { NavLink } from "react-router-dom";

import LogoutModal from "./LogoutModal";

import axios from "axios";

function Sidebar({ showSidebar, closeSidebar }) {
  // console.log("user: ", user);

  // handling the clicked menu item
  const [activeItem, setActiveItem] = useState("/");

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  const handleMenuItemClick = (menuItem) => {
    setActiveItem(menuItem);
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };
  const handleLogoutConfirm = () => {
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
    <main>
      <aside
        className={`sidebar ${showSidebar ? "show" : ""}`}
        style={{
          display: window.innerWidth >= 768 || showSidebar ? "block" : "none",
        }}
      >
        <button id="close-btn" onClick={closeSidebar} className="close-button">
          <span className="material-icons">close</span>
        </button>
        <div className="sidebar">
          <NavLink
            exact="true"
            to="/"
            className={activeItem === "/" ? "active" : ""}
            onClick={() => handleMenuItemClick("/")}
          >
            <span className="material-icons">grid_view</span>
            <h4>Dashboard</h4>
          </NavLink>
          <NavLink
            to="/species"
            className={activeItem === "/species" ? "active" : ""}
            onClick={() => handleMenuItemClick("/species")}
          >
            <span className="material-icons">flutter_dash</span>
            <h4>Species</h4>
          </NavLink>
          <NavLink
            to="/checklists"
            className={activeItem === "/checklists" ? "active" : ""}
            onClick={() => handleMenuItemClick("/checklists")}
          >
            <span className="material-icons">fact_check</span>
            <h4>Checklists</h4>
          </NavLink>
          <NavLink
            to="/entries"
            className={activeItem === "/entries" ? "active" : ""}
            onClick={() => handleMenuItemClick("/entries")}
          >
            <span className="material-icons">login</span>
            <h4>Entries</h4>
          </NavLink>
          <NavLink
            to="/new-species"
            className={activeItem === "/new-species" ? "active" : ""}
            onClick={() => handleMenuItemClick("/new-species")}
          >
            <span className="material-icons">flutter_dash</span>
            <h4>New Species</h4>
          </NavLink>
          <NavLink
            to="/graphs"
            className={activeItem === "/graphs" ? "active" : ""}
            onClick={() => handleMenuItemClick("/graphs")}
          >
            <span className="material-icons">poll </span>
            <h4>Graphs</h4>
          </NavLink>
          <NavLink
            to="/birders"
            className={activeItem === "/birders" ? "active" : ""}
            onClick={() => handleMenuItemClick("/birders")}
          >
            <span className="material-icons">groups</span>
            <h4>Birders</h4>
          </NavLink>
          <NavLink
            to="/settings"
            className={activeItem === "/settings" ? "active" : ""}
            onClick={() => handleMenuItemClick("/settings")}
          >
            <span className="material-icons">settings</span>
            <h4>Settings</h4>
          </NavLink>
          <a href="#" onClick={handleLogoutConfirmation}>
            <span className="material-icons">logout</span>
            <h4>Logout</h4>
          </a>
        </div>
      </aside>
      {showLogoutModal && (
        <LogoutModal
          message="Are you sure you want to Logout?"
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </main>
  );
}
export default Sidebar;
