import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../images";

import "../styles/signup.css";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    country: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const url = "http://localhost:8080/api/v1/users/register";
      const url = `${process.env.REACT_APP_API_URL}/api/v1/users/register`;

      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="login_container">
      <div
        className="login_form_container"
        style={{ height: "680px", width: "1050px" }}
      >
        <div className="signup_left" style={{ flex: 1 }}>
          <form className="form_container" onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "150px",
                  height: "150px",
                  marginBottom: "12px",
                }}
              />
            </div>
            <p style={{ fontSize: "16px", paddingBottom: "20px" }}>
              Welcome to Druk Ebird! Please create your account.
            </p>

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
              <label htmlFor="country">Country</label>
              <input
                type="text"
                placeholder="Country"
                name="country"
                onChange={handleChange}
                value={data.country}
                required
                className="input"
                id="country"
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

            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="signup_green_btn">
              Sign Up
            </button>

            <div>
              Already have an account? <Link to="/login"> Sign In</Link>
            </div>
          </form>
        </div>

        <div
          className="right"
          style={{
            backgroundImage: "url('/Verditer.jpg')",
            backgroundSize: "cover",
            flex: 1,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Signup;
