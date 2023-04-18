import React from "react";
import "../styles/sidebar.css";

function Sidebar({ user, googleUser, show }) {
  // console.log("user: ", user);

  const handleLogout = () => {
    try {
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
        <a href="#">
          <span className="material-icons">fact_check</span>
          <h4>Checklists</h4>
        </a>
        <a href="#">
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
        <a href="#">
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

// import React from "react";
// // import "../styles/sidebar.css";

// function Sidebar(userDetails) {
//   const user = localStorage.getItem("token");

//   const googleUser = userDetails?.googleUser;

//   // console.log("user: ", user);

//   const handleLogout = () => {
//     try {
//       if (googleUser) {
//         window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
//       }
//       if (user) {
//         localStorage.removeItem("token");
//         window.location.reload();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="sidebar">
//       <ul>
//         <li>
//           <a href="#">Dashboard</a>
//         </li>
//         <li>
//           <a href="#">Species</a>
//         </li>
//         <li>
//           <a href="#">Checklists</a>
//         </li>
//         <li>
//           <a href="#">Entries</a>
//         </li>
//         <li>
//           <a href="#">New Species</a>
//         </li>
//         <li>
//           <a href="#">Graphs</a>
//         </li>
//         <li>
//           <a href="#">Birders</a>
//         </li>
//         <li>
//           <a href="#">Settings</a>
//         </li>
//         <li>
//           <a href="#" onClick={handleLogout}>
//             Logout
//           </a>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;
