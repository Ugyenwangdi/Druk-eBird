// import "bootstrap/dist/css/bootstrap.min.css";

// import { useState } from "react";
// import axios from "axios";

// import { Link } from "react-router-dom";
// import { logo, google, VerditerFlycatcher } from "../images";
// import "../styles/login.css";

// const Login = () => {
//   const [data, setData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = ({ currentTarget: input }) => {
//     setData({ ...data, [input.name]: input.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = "http://localhost:8080/api/v1/users/login";
//       // const url = `${process.env.REACT_APP_API_URL}/api/v1/users/login`;

//       const res = await axios.post(url, data);
//       // console.log("token: ", res.data.token);
//       localStorage.setItem("token", res.data.token);
//       window.location = "/";
//     } catch (error) {
//       if (
//         error.response &&
//         error.response.status >= 400 &&
//         error.response.status <= 500
//       ) {
//         setError(error.response.data.message);
//       }
//     }
//   };

//   const googleAuth = () => {
//     window.open(`http://localhost:8080/auth/google/callback`, "_self");
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center min-vh-100">
//       <div className="row border rounded-5 p-3 bg-white shadow box-area">
//         <div className="col-md-6 right-box">
//           <div className="row align-items-center">
//             <form onSubmit={handleSubmit} className="login_form">
//               <img src={logo} alt="logo" className="logo" />
//               <div className="header-text mb-4">
//                 <h6 style={{ color: "gray" }}>
//                   Welcome Back! Please enter your credentials
//                 </h6>
//               </div>
//               <p style={{ color: "gray" }}>Email</p>
//               <div className="input-group mb-3">
//                 <input
//                   type="email"
//                   name="email"
//                   onChange={handleChange}
//                   value={data.email}
//                   required
//                   className="form-control form-control-lg bg-light fs-6"
//                   placeholder="Email address"
//                 />
//               </div>
//               <p style={{ color: "gray" }}>Password</p>
//               <div className="input-group mb-1">
//                 <input
//                   type="password"
//                   className="form-control form-control-lg bg-light fs-6"
//                   placeholder="Password"
//                   name="password"
//                   onChange={handleChange}
//                   value={data.password}
//                   required
//                 />
//               </div>
//               <div className="input-group mb-5 d-flex justify-content-between">
//                 <div className="form-check">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="formCheck"
//                   />
//                   <label
//                     htmlFor="formCheck"
//                     className="form-check-label text-secondary"
//                   >
//                     <small>Remember Me</small>
//                   </label>
//                 </div>
//                 <div className="forgot">
//                   <small>
//                     <Link to="/forgot-password">Forgot Password?</Link>
//                   </small>
//                 </div>
//               </div>
//               {error && <div className="error_msg">{error}</div>}
//               <div className="input-group mb-3">
//                 <button type="submit" className="btn btn-lg w-100 fs-6 sign-in">
//                   Sign In
//                 </button>
//               </div>
//             </form>
//             <div className="input-group mb-3">
//               <button
//                 className="btn btn-lg btn-light w-100 fs-6"
//                 onClick={googleAuth}
//               >
//                 <img
//                   src={google}
//                   style={{ width: "20px" }}
//                   className="me-2"
//                   alt="google"
//                 />
//                 <small>Sign In with Google</small>
//               </button>
//             </div>
//             <div className="row">
//               <small>
//                 Don't have account? <Link to="/signup">Sign Up</Link>
//               </small>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-6">
//           <img src={VerditerFlycatcher} className="img-fluid bird" alt="bird" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

//  update

import { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { logo, google } from "../images";
import "../styles/login.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/v1/users/login";
      // const url = `${process.env.REACT_APP_API_URL}/api/v1/users/login`;

      const res = await axios.post(url, data);
      // console.log("token: ", res.data.token);
      localStorage.setItem("token", res.data.token);
      window.location = "/";
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

  const googleAuth = () => {
    window.open(`http://localhost:8080/auth/google/callback`, "_self");
  };

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
              Welcome back! Please enter your details.
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
            <button type="submit" className="green_btn">
              Sign In
            </button>

            <p className="text">or</p>
          </form>
          <div className="form_container">
            <button className="google_btn" onClick={googleAuth}>
              <img src={google} alt="google icon" />
              <span>Sign in with Google</span>
            </button>

            <div>
              <Link to="/forgot-password">Forgot Password? </Link>
              <Link to="/signup">Sign Up</Link>
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

//  update
