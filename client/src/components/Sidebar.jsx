import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import axios from "axios";

function Sidebar({ show }) {
  // console.log("user: ", user);

  // const handleLogout = () => {
  //   try {
  //     // Localhost
  //     // if (googleUser) {
  //     //   window.open(`http://localhost:8080/auth/logout`, "_self");
  //     // }

  //     // Deployed
  //     if (googleUser) {
  //       window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  //     }

  //     if (user) {
  //       localStorage.removeItem("token");
  //       window.location.reload();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();

  const handleTabClick = (path) => {
    setActiveTab(path);
  };

  const handleLogout = () => {
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
    <aside style={{ display: show ? "block" : "none" }}>
      <div className="sidebar">
        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
          onClick={() => handleTabClick("/")}
        >
          <span className="material-icons">grid_view</span>
          <h4>Dashboard</h4>
        </Link>
        <Link
          to="/species"
          className={location.pathname.includes("/species") ? "active" : ""}
          onClick={() => handleTabClick("/species")}
        >
          <span className="material-icons">flutter_dash</span>
          <h4>Species</h4>
        </Link>
        <Link
          to="/checklist"
          className={location.pathname === "/checklist" ? "active" : ""}
          onClick={() => handleTabClick("/checklist")}
        >
          <span className="material-icons">fact_check</span>
          <h4>Checklists</h4>
        </Link>
        <Link
          to="/entries"
          className={location.pathname === "/entries" ? "active" : ""}
          onClick={() => handleTabClick("/entries")}
        >
          <span className="material-icons">login</span>
          <h4>Entries</h4>
        </Link>
        <Link to="#">
          <span className="material-icons">flutter_dash</span>
          <h4>New Species</h4>
        </Link>
        <Link to="#">
          <span className="material-icons">poll </span>
          <h4>Graphs</h4>
        </Link>
        <Link to="#">
          <span className="material-icons">groups</span>
          <h4>Birders</h4>
        </Link>
        <Link
          to="/settings"
          className={location.pathname === "/settings" ? "active" : ""}
          onClick={() => handleTabClick("/settings")}
        >
          <span className="material-icons">settings</span>
          <h4>Settings</h4>
        </Link>
        <Link to="#" onClick={handleLogout}>
          <span className="material-icons">logout</span>
          <h4>Logout</h4>
        </Link>
      </div>
      {/* <button id="close-btn">
        <span className="material-icons">chevron_left</span>
      </button> */}
    </aside>
  );
}

export default Sidebar;
