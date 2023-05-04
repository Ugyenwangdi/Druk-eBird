import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
} from "./pages";

// import "./index.css";

function App() {
  const user = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [googleUser, setGoogleUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // console.log("user: ", user.email);
  // console.log("googleUser: ", googleUser.email);

  const getGoogleUser = async () => {
    try {
      const url = `http://localhost:8080/auth/login/success`;
      // const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;

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
              <Route path="/*" element={<Navigate replace to="/" />} />
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
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
