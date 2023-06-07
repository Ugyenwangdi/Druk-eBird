import { useEffect, useState, useCallback } from "react";
import { Route, Routes, useNavigate, Navigate, Link } from "react-router-dom";
import axios from "axios";

import { Sidebar, Topbar } from "./components";
import {
  Signup,
  Login,
  ForgotPassword,
  PasswordReset,
  Dashboard,
  SpeciesList,
  AddSpecies,
  EditSpecies,
  SpeciesDetails,
  Checklist,
  ChecklistDetail,
  Entries,
  NewSpecies,
  NewSpeciesDetails,
  Birder,
  BirderDetail,
  Settings,
  AddAdmin,
  EditAdmin,
  UpdatePassword,
  AddChecklist,
  AnalyzeChecklist,
  Notification,
  TopBirders,
} from "./pages";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // const [loading, setLoading] = useState(true);

  const [isValidToken, setIsValidtoken] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [userData, setUserData] = useState({});
  const [isDeactivatedUser, setIsDeactivatedUser] = useState(false);
  const [isNotAdmin, setIsNotAdmin] = useState(false);
  const [checkedDeactivatedUser, setCheckedDeactivatedUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchClickedId, setSearchClickedId] = useState("");

  useEffect(() => {
    if (searchQuery) {
      navigate("/species");
      // navigate("/notifications");
    }

    if (searchClickedId) {
      setSearchQuery("");
    }
  }, [searchQuery, navigate]);

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
  console.log("current: ", userData);
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
        setUserData(data);
      };

      getAdminDetails();
    }
  }, [currentUser.id]);

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

  // Sidebar and toggle connection
  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };
  // adding an event listener to the window object to listen for changes in the screen size and update the state accordingly.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // hidding the sidebar in mobile and tablet screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    setShowSidebar(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  if (!checkedDeactivatedUser) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {isValidToken && !isDeactivatedUser ? (
        <div>
          <Topbar
            onToggleSidebar={handleToggleSidebar}
            currentUser={userData}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
          <main>
            <Sidebar
              showSidebar={showSidebar}
              closeSidebar={handleCloseSidebar}
              onToggleSidebar={handleToggleSidebar}
              style={{ position: "fixed" }}
            />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/species"
                element={
                  <SpeciesList
                    searchQuery={searchQuery}
                    setSearchClickedId={setSearchClickedId}
                  />
                }
              />
              <Route path="/species/add" element={<AddSpecies />} />
              <Route path="/species/:id/edit" element={<EditSpecies />} />
              <Route path="/species/:id" element={<SpeciesDetails />} />
              <Route path="/entries" element={<Entries />} />
              <Route path="/checklists" element={<Checklist />} />
              <Route path="/checklists/:id" element={<ChecklistDetail />} />
              <Route path="/new-species" element={<NewSpecies />} />
              <Route path="/new-species/:id" element={<NewSpeciesDetails />} />
              <Route path="/birders" element={<Birder />} />
              <Route path="/birder-detail" element={<BirderDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/add-admin" element={<AddAdmin />} />
              <Route path="/admins/:id/edit" element={<EditAdmin />} />
              <Route path="/password-update" element={<UpdatePassword />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/top-birders" element={<TopBirders />} />

              <Route path="/checklists/add" element={<AddChecklist />} />
              <Route
                path="/checklists/analyze"
                element={<AnalyzeChecklist />}
              />

              <Route path="/*" element={<Navigate replace to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/password-reset/:id/:token"
            element={<PasswordReset />}
          />
          <Route
            path="/deactivated"
            element={
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                }}
              >
                <p
                  style={{
                    fontSize: "24px",
                    color: "link",
                    marginBottom: "20px",
                  }}
                >
                  Your account has been deactivated and you cannot log in.
                </p>
                <Link to="/login" style={{ color: "blue" }}>
                  Click here to login with different account
                </Link>
              </div>
            }
          />

          <Route
            path="/not-admin"
            element={
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                }}
              >
                <p
                  style={{
                    fontSize: "24px",
                    color: "link",
                    marginBottom: "20px",
                  }}
                >
                  You are not an admin of Druk eBird!
                </p>
                <Link to="/login" style={{ color: "blue" }}>
                  Click here to login with different account
                </Link>
              </div>
            }
          />
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
