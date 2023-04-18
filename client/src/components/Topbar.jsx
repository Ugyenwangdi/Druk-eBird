import React from "react";
import { logo, profile } from "../images";
import "../styles/topbar.css";

function TopBar({ onToggleSidebar }) {
  return (
    <div className="top-bar">
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
    </div>
  );
}

export default TopBar;

// import React, { useState } from "react";
// import { logo } from "../images";
// import "../styles/topbar.css";

// function Topbar() {
//   const [showDropdown, setShowDropdown] = useState(false);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   return (
//     <div className="top-bar">
//       <div className="logo">
//         <img src={logo} alt="Druk-ebird Logo" />
//       </div>
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search Bird Species, Birding sites, Birders etc"
//         />
//         <button>Search</button>
//       </div>
//       <div className="user-profile">
//         <div className="dropdown">
//           <button className="dropbtn" onClick={toggleDropdown}>
//             <img src={logo} alt="Profile Picture" />
//             Admin Profile
//           </button>
//           {showDropdown && (
//             <div className="dropdown-content">
//               <a href="#">Setting</a>
//               <a href="#">Logout</a>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Topbar;
