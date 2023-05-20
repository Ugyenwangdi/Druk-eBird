import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { UserList } from "../components";

// import "../styles/dashboard.css";

function Dashboard() {
  const token = localStorage.getItem("token");

  const [isValidToken, setIsValidtoken] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [isDeactivatedUser, setIsDeactivatedUser] = useState(false);
  const [isNotAdmin, setIsNotAdmin] = useState(false);
  const [checkedDeactivatedUser, setCheckedDeactivatedUser] = useState(false);

  const validateToken = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/checkLoggedIn`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 && res.data.valid) {
        setIsValidtoken(true);
      } else {
        localStorage.removeItem("token");
        setIsValidtoken(false);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      setIsValidtoken(false);
    } finally {
      setTokenValidated(true); // set the state variable to true once validation is complete
    }
  }, [token]);

  const fetchCurrentUser = useCallback(async () => {
    if (!tokenValidated) return; // skip the API call if the token has not been validated yet

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/checkLoggedIn`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentUser(response.data.user);
      setIsDeactivatedUser(response.data.user.isDeactivated);
      setIsNotAdmin(response.data.user.userType === "user");
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setCheckedDeactivatedUser(true);
    }
  }, [token, tokenValidated]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (currentUser.id) {
      const getAdminDetails = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${currentUser.id}`
        );
        const data = await response.json();
        console.log(data);
        setIsNotAdmin(data.userType === "user");
      };

      getAdminDetails();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!checkedDeactivatedUser) return;
    if (isDeactivatedUser) {
      localStorage.removeItem("token");
      window.location = "/deactivated";
    }
  }, [checkedDeactivatedUser, isDeactivatedUser]);

  useEffect(() => {
    if (!checkedDeactivatedUser) return;
    if (isNotAdmin) {
      localStorage.removeItem("token");
      window.location = "/not-admin";
    }
  }, [checkedDeactivatedUser, isNotAdmin]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard!</p>

      <UserList />
    </div>
  );
}

export default Dashboard;
//  edit

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "../styles/addspecies.css";

// function Dashboard() {
//   const [file, setFile] = useState(null);
//   const [checklistResult, setChecklistResult] = useState({});
//   const [birders, setBirders] = useState([]);

//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setMsg("");
//     setError("");
//     setFile(e.target.files[0]);
//   };

//   const handleFileSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       setLoading(true);

//       // Deployed
//       console.log(formData);
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/v1/analyze-checklists`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log(response);
//       setChecklistResult(response.data);
//       setBirders(response.data.topBirders);

//       setMsg(`Uploaded file!`);
//       setFile(null);
//       document.getElementById("file").value = "";
//     } catch (error) {
//       console.log(error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-species-container">
//       <div className="species-header">
//         <Link to="/species">
//           <span className="material-icons back-arrow">arrow_back_ios</span>
//         </Link>
//         <h2>Checklist Analysis</h2>
//       </div>

//       <div className="previewcontainer">
//         {error && <div className="error_msg">{error}</div>}
//         {msg && <div className="success_msg">{msg}</div>}

//         <div className="file-upload-container">
//           <div>Upload checklist data (*.xlsx)</div>
//           <form onSubmit={handleFileSubmit}>
//             <input
//               className="select-file"
//               type="file"
//               id="file"
//               accept=".xlsx"
//               onChange={handleFileChange}
//             />
//             <button
//               className={file ? "addnew-button" : "addnew-button-disabled"}
//               type="submit"
//               disabled={loading}
//             >
//               Submit
//             </button>
//           </form>

//           <div style={{ padding: "20px", textAlign: "left" }}>
//             <h3>Top birder: </h3>
//             <ul>
//               {birders.map((birder) => (
//                 <li key={birder.name}>
//                   {birder.name} - {birder.checklistCount} checklists
//                 </li>
//               ))}
//             </ul>

//             <h3>
//               Highest birds location: {checklistResult.highestBirdsLocation}
//             </h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
