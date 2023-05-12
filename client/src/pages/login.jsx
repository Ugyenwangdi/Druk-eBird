import { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { logo, google } from "../images";
import "../styles/login.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/google/callback`,
      "_self"
    );

    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      localStorage.setItem("token", data.token);
      window.location.reload();
      window.location = "/";
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = ({ currentTarget: input }) => {
    setError("");
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // const url = "http://localhost:8080/api/v1/users/login";
      const url = `${process.env.REACT_APP_API_URL}/auth/login`;

      const res = await axios.post(url, data);
      localStorage.setItem("token", res.data.token); // store the session token from jwt
      window.location = "/";
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

  // const googleAuth = () => {
  //   window.open(`http://localhost:8080/auth/google/callback`, "_self");
  // };

  // const googleAuth = () => {
  //   window.open(
  //     `${process.env.REACT_APP_API_URL}/auth/google/callback`,
  //     "_self"
  //   );
  // };

  return (
    <div className="login_container">
      <div className="login_form_container">
        <div className="login_left" style={{ flex: 1 }}>
          <form className="form_container" onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "150px",
                  height: "150px",
                  marginBottom: "20px",
                }}
              />
            </div>
            <p style={{ fontSize: "16px", paddingBottom: "40px" }}>
              Welcome back! Log in to your account.
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
            <button type="submit" className="green_btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text">or</p>
          </form>
          <div className="form_container">
            <button className="google_btn" onClick={handleGoogleLogin}>
              <img src={google} alt="google icon" />
              <span>Sign in with Google</span>
            </button>

            <div>
              <Link to="/forgot-password">Forgot Password? </Link>
              {/* <Link to="/signup">Sign Up</Link> */}
            </div>
          </div>
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

export default Login;
