import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/settings.css";
import { logo } from "../images";
import { DeactivateModal } from "../components";

function Settings() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchCurrentUserLoading, setFetchCurrentUserLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [userProfileImg, setUserProfileImg] = useState("");
  const [userProfilePreview, setUserProfilePreview] = useState("");
  const [checkedDeactivatedUser, setCheckedDeactivatedUser] = useState(false);
  const [isNotAdmin, setIsNotAdmin] = useState(false);
  const [photoFieldChanged, setPhotoFieldChanged] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
  });

  const deactivatedUser = currentUser.isDeactivated;

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

  const fetchCurrentUser = useCallback(async () => {
    try {
      setFetchCurrentUserLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/checkLoggedIn`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentUser(response.data.user);
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setCheckedDeactivatedUser(true);
      setFetchCurrentUserLoading(false);
    }
  }, [token]);

  const handleDeactivateConfirmation = async () => {
    try {
      setDeactivateLoading(true);
      const url = `${process.env.REACT_APP_API_URL}/users/${currentUser.id}/deactivate`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.patch(url, {}, { headers });
      setMsg(res.data.message);
      console.log("Account deactivated successfully!");
      localStorage.removeItem("token");
    } catch (error) {
      console.log(error);
    } finally {
      setDeactivateLoading(false);
      setShowDeactivateModal(false);
    }
  };

  const handleDeactivateCancel = () => {
    setShowDeactivateModal(false);
  };

  const handleDeactivateAccount = () => {
    setShowDeactivateModal(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      setDeactivateLoading(true);
      const url = `${process.env.REACT_APP_API_URL}/users/${deleteUserId}`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      const deleteuseremail = response.data.email;

      await axios.delete(url, { headers });
      console.log("User deleted successfully!");
      const sendNotification = async (message) => {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/notifications`, {
            message: message,
          });
        } catch (error) {
          console.error("Failed to send notification:", error);
        }
      };      
      // Create a new notification
      const notificationMessage = `${currentUser.email} has deleted the ${deleteuseremail} at ${new Date().toLocaleString()}`;
      await sendNotification(notificationMessage);
      console.log(notificationMessage);
      setData(data.filter((item) => item._id !== deleteUserId));
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const handleChange = ({ currentTarget: input }) => {
    setMsg("");
    setError("");

    setFormData((prevState) => ({
      ...prevState,
      [input.name]: input.value,
    }));
  };

  const handleFileInputChange = (event) => {
    setMsg("");
    setError("");
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setUserProfilePreview(reader.result);
        setUserProfileImg(reader.result);
        setPhotoFieldChanged(true);
      };
    } else {
      setUserProfilePreview("");
      setPhotoFieldChanged(false);
    }
  };

  const cropImage = (imageDataUrl) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const image = new Image();

      image.onload = () => {
        const size = Math.min(image.width, image.height);
        const x = (image.width - size) / 2;
        const y = (image.height - size) / 2;

        canvas.width = size;
        canvas.height = size;

        context.drawImage(image, x, y, size, size, 0, 0, size, size);
        const croppedImageDataUrl = canvas.toDataURL("image/jpeg");
        resolve(croppedImageDataUrl);
      };

      image.onerror = (error) => {
        reject(error);
      };

      image.crossOrigin = "anonymous"; // Set crossOrigin attribute to enable CORS
      image.src = imageDataUrl;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser.id) {
      setError("User ID is missing. Please try again later.");
      return;
    }

    try {
      setLoading(true);

      if (!currentUser.googleId) {
        // add your JWT token to the headers object
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        let croppedImage = null;
        console.log("userProfileImg:", userProfileImg);

        // Check if the photo field has changed
        console.log("changed: ", photoFieldChanged);

        if (photoFieldChanged) {
          // Only crop the image if the photo field has changed
          croppedImage = await cropImage(userProfilePreview);
        }

        console.log("id: ", currentUser.id);

        const res = await axios.patch(
          `${process.env.REACT_APP_API_URL}/users/${currentUser.id}/update-profile`,
          {
            ...formData,
            photo: photoFieldChanged ? croppedImage : "",
          },
          { headers }
        ); // send patch request to server

        const data = await res.data.data;
        setFormData(data);
        fetchCurrentUser();
        setMsg(res.data.message);
        // console.log(res.data.message);
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
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchData();

    if (deactivatedUser) {
      window.location = "/login";
    }
  }, [fetchCurrentUser, deactivatedUser]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser?.name,
        email: currentUser?.email,
        photo: currentUser?.profile,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser.id) {
      const getAdminDetails = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${currentUser.id}`
        );
        const data = await response.json();
        // console.log(data);
        setFormData(data);
        setUserProfileImg(data.profile);
        setIsNotAdmin(data.userType === "user");
      };

      getAdminDetails();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!checkedDeactivatedUser) return;
    if (isNotAdmin) {
      localStorage.removeItem("token");
      window.location = "/not-admin";
    }
  }, [checkedDeactivatedUser, isNotAdmin]);

  return (
    <div className="setting-box">
      <div className="form-container">
        {error && <div className="error_msg">{error}</div>}
        {msg && <div className="success_msg">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              onChange={handleChange}
              placeholder="Name"
              value={formData.name}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="profile-pic">
            <img
              src={userProfileImg ? userProfileImg : logo}
              id="photo"
              alt="profile"
            />
            <div className="camera">
              <label htmlFor="file" id="uploadBtn">
                <span className="material-symbols-outlined">photo_camera</span>
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                id="file"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="submit">
            <button type="submit" className="form-button" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="parent">
        <div className="box-1">
          <br></br>
          <p style={{ fontSize: "16px" }}>Update Password</p> <br></br>
          <p style={{ fontSize: "15px" }}>
            You can update your password by clicking here <br></br>
          </p>{" "}
          <br></br>
          <Link to="/password-update">
            <button type="submit" className="btn">
              Change
            </button>
          </Link>
        </div>
        <div className="box-2">
          <br></br>
          <p style={{ fontSize: "16px" }}>Deactivate account</p>
          <br></br>
          <p style={{ fontSize: "15px" }}>
            Once you deactivate your account, there is no going back please be
            certain
          </p>{" "}
          <br></br>
          <button
            type="submit"
            className="deactivate-btn"
            disabled={deactivateLoading}
            onClick={handleDeactivateAccount}
          >
            {deactivateLoading ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>{" "}
      {showDeactivateModal && (
        <DeactivateModal
          message="Are you sure you want to deactivate your account?"
          onConfirm={handleDeactivateConfirmation}
          onCancel={handleDeactivateCancel}
        />
      )}
      <br></br>
      <br></br>
      {currentUser.userType === "root-user" && (
        <>
          <div className="admin-button">
            <Link to="/add-admin">
              <button className="addAdmin-btn">Add Admin</button>
            </Link>
          </div>
          <br></br>
          {/* admin table */}
          <h3 style={{ fontSize: "16px", textAlign: "center" }}>
            Druk eBird Admins
          </h3>{" "}
          <br></br>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>User Type</th>
                <th style={{ width: "15%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id}>
                  <td data-label="SLNO">{index + 1}</td>
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Email">{item.email}</td>
                  <td data-label="UserType">{item.userType}</td>
                  <td data-label="Action">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <button
                        className="deleteBtn"
                        onClick={() => handleDeleteUser(item._id)}
                      >
                        Delete
                      </button>

                      <button className="editBtn">
                        <Link
                          to={`/admins/${item._id}/edit`}
                          state={{ adminDetail: item }}
                          className="editLink"
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
      {showDeleteModal && (
        <DeactivateModal
          message="Are you sure you want to delete this user?"
          onConfirm={handleDeleteConfirmation}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}
export default Settings;
