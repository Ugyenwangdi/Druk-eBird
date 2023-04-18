import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
// import "./App.css";

import { Sidebar, Topbar } from "./components";
import {
  Signup,
  Login,
  ForgotPassword,
  PasswordReset,
  Dashboard,
  Species,
  AddSpecies,
} from "./pages";

// import "./App.css";

function App() {
  const user = localStorage.getItem("token");

  const [loading, setLoading] = useState(true); // new loading state
  const [googleUser, setGoogleUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const getGoogleUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      console.log(data.user);
      // localStorage.setItem("token", data.user);
      setGoogleUser(data.user._json);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // set loading to false once user object is available or error occurs
    }
  };

  useEffect(() => {
    getGoogleUser();
  }, []);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // render loading spinner/message while loading is true
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user || googleUser ? (
        <div>
          <Topbar onToggleSidebar={handleToggleSidebar} />
          <main>
            <Sidebar
              user={user}
              googleUser={googleUser}
              show={showSidebar}
              onToggleSidebar={handleToggleSidebar}
            />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/species" element={<Species />} />
              <Route path="/add-species" element={<AddSpecies />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/password-reset/:id/:token"
            element={<PasswordReset />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
