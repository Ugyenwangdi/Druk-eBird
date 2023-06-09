import { useEffect, useState, Fragment, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../styles/passwordreset.css";

const UpdatePassword = () => {
  const token = localStorage.getItem("token");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const fetchCurrentUser = useCallback(async () => {
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

      console.log(currentUser);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }, [token, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (!currentUser.googleId) {
        const url = `${process.env.REACT_APP_API_URL}/users/${currentUser.id}/update-password`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const { data } = await axios.post(
          url,
          {
            oldPassword: oldPassword,
            newPassword: newPassword,
          },
          { headers }
        );

        setMsg(data.message);
        setError("");
        window.location = "/login";
      } else {
        setError("You cannot update your google account");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          paddingBottom: "0px",
        }}
      >
        <div className="species-header">
          <Link to="/settings">
            <span className="material-icons back-arrow">arrow_back_ios</span>
          </Link>
          <h2>Update password</h2>
        </div>
      </div>
      <Fragment>
        <div className="password_reset_container">
          <form className="form_contain" onSubmit={handleSubmit}>
            <h1 style={{ margin: "15px 0" }}>Change my password</h1>
            <input
              type="password"
              placeholder="Old Password"
              name="oldPassword"
              onChange={(e) => {
                setMsg("");
                setError("");
                setOldPassword(e.target.value);
              }}
              value={oldPassword}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="New Password"
              name="newPassword"
              onChange={(e) => {
                setMsg("");
                setError("");
                setNewPassword(e.target.value);
              }}
              value={newPassword}
              required
              className="input"
            />
            {error && <div className="error_msg">{error}</div>}
            {msg && <div className="success_msg">{msg}</div>}
            <button type="submit" className="green_btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </Fragment>
    </div>
  );
};

export default UpdatePassword;
