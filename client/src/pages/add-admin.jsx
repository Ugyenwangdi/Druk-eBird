import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { logo } from "../images";

import "../styles/signup.css";

const AddAdmin = () => {
  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setMsg("");
    setError("");
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // const url = "http://localhost:8080/api/v1/users/register";
      const url = `${process.env.REACT_APP_API_URL}/auth/register-admin`;

      // add your JWT token to the headers object
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(url, data, { headers });
      setMsg(res.data.message);
      console.log(res);
      setData({ name: "", email: "", country: "", password: "" });
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
          <h2>Add admin</h2>
        </div>
      </div>
      <div className="login_container">
        <div className="signup_form_container">
          <div className="signup_left" style={{ flex: 1 }}>
            <form
              className="form_container"
              onSubmit={handleSubmit}
              style={{ marginBottom: "10px", padding: "0 40px" }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: "150px",
                    height: "150px",
                    marginTop: "-12px",
                  }}
                />
              </div>
              <p style={{ fontSize: "16px", paddingBottom: "20px" }}>
                Register Admin User
              </p>
              {error && <div className="error_msg">{error}</div>}
              {msg && <div className="success_msg">{msg}</div>}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: "10px",
                  color: "#808191",
                  fontSize: "16px",
                }}
              >
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  onChange={handleChange}
                  value={data.name}
                  required
                  className="input"
                  id="name"
                  style={{ color: "#808191" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: "10px",
                  color: "#808191",
                  fontSize: "16px",
                }}
              >
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  value={data.email}
                  required
                  className="input"
                  id="email"
                  style={{ color: "#808191" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: "10px",
                  color: "#808191",
                  fontSize: "16px",
                }}
              >
                <label htmlFor="userType">User Type</label>
                <select
                  className="input"
                  name="userType"
                  onChange={handleChange}
                  value={data.userType}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: "10px",
                    color: "#808191",
                    fontSize: "16px",
                  }}
                >
                  <option value="">Select type</option>
                  <option value="user">Basic User</option>
                  <option value="admin-user">Admin User</option>
                  <option value="root-user">Root User</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: "10px",
                  color: "#808191",
                  fontSize: "16px",
                }}
              >
                <label htmlFor="password">Password</label>

                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={data.password}
                  required
                  className="input"
                  id="password"
                  style={{ color: "#808191" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: "10px",
                  color: "#808191",
                  fontSize: "16px",
                }}
              >
                <label htmlFor="password-confirm">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={data.confirmPassword}
                  required
                  className="input"
                  id="password-confirm"
                  style={{ color: "#808191" }}
                />
              </div>

              <button
                type="submit"
                className="signup_green_btn"
                disabled={loading}
              >
                {loading ? "Adding Admin ..." : "Add Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
