import React from "react";
import "../styles/sidebar.css";

function Sidebar({ user, googleUser, show }) {
  // console.log("user: ", user);

  const handleLogout = () => {
    try {
      // Localhost
      // if (googleUser) {
      //   window.open(`http://localhost:8080/auth/logout`, "_self");
      // }

      // Deployed
      if (googleUser) {
        window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
      }

      if (user) {
        localStorage.removeItem("token");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside style={{ display: show ? "block" : "none" }}>
      <div className="sidebar">
        <a href="/" className="active">
          <span className="material-icons">grid_view</span>
          <h4>Dashboard</h4>
        </a>
        <a href="/species">
          <span className="material-icons">flutter_dash</span>
          <h4>Species</h4>
        </a>
        <a href="/checklist">
          <span className="material-icons">fact_check</span>
          <h4>Checklists</h4>
        </a>
        <a href="/entries">
          <span className="material-icons">login</span>
          <h4>Entries</h4>
        </a>
        <a href="#">
          <span className="material-icons">flutter_dash</span>
          <h4>New Species</h4>
        </a>
        <a href="#">
          <span className="material-icons">poll </span>
          <h4>Graphs</h4>
        </a>
        <a href="#">
          <span className="material-icons">groups</span>
          <h4>Birders</h4>
        </a>
        <a href="/settings">
          <span className="material-icons">settings</span>
          <h4>Settings</h4>
        </a>
        <a href="#" onClick={handleLogout}>
          <span className="material-icons">logout</span>
          <h4>Logout</h4>
        </a>
      </div>
      {/* <button id="close-btn">
        <span className="material-icons">chevron_left</span>
      </button> */}
    </aside>
  );
}

export default Sidebar;
