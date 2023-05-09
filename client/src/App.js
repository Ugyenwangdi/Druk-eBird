import { useEffect, useState } from "react";
import {
  useNavigate,
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
  Entries,
  Settings,
} from "./pages";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [googleUser, setGoogleUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isValidToken, setIsValidtoken] = useState(false);

  const validateToken = async () => {
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
    }
  };

  const getGoogleUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      localStorage.setItem("token", data.token);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
    getGoogleUser();
  }, [navigate]);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {isValidToken ? (
        <div>
          <Topbar onToggleSidebar={handleToggleSidebar} />
          <main>
            <Sidebar
              show={showSidebar}
              onToggleSidebar={handleToggleSidebar}
              style={{ position: "fixed" }}
            />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/species" element={<SpeciesList />} />
              <Route path="/species/add" element={<AddSpecies />} />
              <Route path="/species/:id/edit" element={<EditSpecies />} />
              <Route path="/species/:id" element={<SpeciesDetails />} />
              <Route path="/entries" element={<Entries />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/settings" element={<Settings />} />
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
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
