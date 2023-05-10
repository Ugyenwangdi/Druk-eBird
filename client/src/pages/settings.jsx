import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/settings.css";
import { logo } from "../images";

function Settings() {
  const token = localStorage.getItem("token");

  const [previewImage, setPreviewImage] = useState(logo);
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name,
    email: currentUser?.email,
    country: currentUser?.country,
  });

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      setPreviewImage(reader.result);
    });

    reader.readAsDataURL(file);
  };

  const fetchData = async () => {
    try {
      // const response = await fetch("http://localhost:8080/api/v1/users/");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/`);

      const jsonData = await response.json();
      setData(Object.values(jsonData));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentUser = async () => {
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
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Deleted successfully!");
        setData(data.filter((item) => item._id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setMsg("");
    setError("");
    setFormData((prevState) => ({
      ...prevState,
      [input.name]: input.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // const url = "http://localhost:8080/api/v1/users/register";
      const url = `${process.env.REACT_APP_API_URL}/users/${currentUser.id}`;

      // add your JWT token to the headers object
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log(formData);

      const res = await axios.patch(url, formData, { headers });
      setMsg(res.data.message);
      console.log(res);
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
    <div class="setting-box">
      <div class="form-container">
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-input"
              onChange={handleChange}
              placeholder="Name"
              value={currentUser.name}
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input"
              placeholder="Email"
              onChange={handleChange}
              value={currentUser.email}
            />
          </div>
          <div class="profile-pic">
            <img src={previewImage} id="photo"></img>
            <input
              type="file"
              id="file"
              onChange={handleFileInputChange}
            ></input>
            <label for="file" id="uploadBtn">
              Choose Photo
            </label>
          </div>

          {error && <div className="error_msg">{error}</div>}
          {msg && <div className="success_msg">{msg}</div>}

          <div class="submit">
            <button type="submit" class="form-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div class="parent">
        <div class="box-1">
          <br></br>
          <p style={{ fontSize: "16px" }}>Password</p> <br></br>
          <p style={{ fontSize: "15px" }}>
            You can reset or change your password <br></br> by clicking here{" "}
          </p>{" "}
          <br></br>
          <button type="submit" class="btn">
            Change
          </button>
        </div>
        <div class="box-2">
          <br></br>
          <p style={{ fontSize: "16px" }}>Deactivate account</p>
          <br></br>
          <p style={{ fontSize: "15px" }}>
            Once you deactivate your account, there is no going back please be
            certain
          </p>{" "}
          <br></br>
          <button type="submit" class="deactivate-btn">
            Deactivate
          </button>
        </div>
      </div>{" "}
      <br></br>
      <br></br>
      {currentUser.userType === "root-user" && (
        <>
          <div class="admin-button">
            <Link to="/add-admin">
              <button class="addAdmin-btn">Add Admin</button>
            </Link>
          </div>
          <br></br>
          {/* admin table */}
          <h3 style={{ fontSize: "16px", textAlign: "center" }}>
            Druk eBird Admins
          </h3>{" "}
          <br></br>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: "15%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Email">{item.email}</td>
                  <td data-label="Action">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <button
                        class="deleteBtn"
                        onClick={() => deleteUser(item._id)}
                      >
                        Delete
                      </button>

                      <button class="editBtn">
                        <Link
                          to={`/admins/${item._id}/edit`}
                          state={{ adminDetail: item }}
                        >
                          Edit
                        </Link>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br></br>
        </>
      )}
    </div>
  );
}
export default Settings;
