import { useState } from "react";
import axios from "axios";
import "../styles/forgotpassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8080/api/v1/password-reset`;
      // const url = `${process.env.REACT_APP_API_URL}/api/v1/password-reset`;

      const { data } = await axios.post(url, { email });
      setMsg(data.message);
      setError("");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };

  return (
    <div className="forgotpw_container">
      <form className="form_box" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          className="input"
        />
        {error && <div className="error_msg">{error}</div>}
        {msg && <div className="success_msg">{msg}</div>}
        <button type="submit" className="green_btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
