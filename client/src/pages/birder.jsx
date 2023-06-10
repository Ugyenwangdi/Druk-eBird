import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import "../styles/birder.css";
import { profile } from "../images";

import { Link } from "react-router-dom";

import { Search, Dropdown, Pagination, DeactivateModal } from "../components";

function Birder() {
  const token = localStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState({});

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [foundTotal, setFoundTotal] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
  const [birderName, setBirderName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [countryOptions, setCountryOptions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState("");

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
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }, [token]);

  const toggleDeleteButton = (id) => {
    setShowDeleteId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, birderName, selectedCountry, deleteUserId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/birders?birder=${birderName}&country=${selectedCountry}&page=${page}&limit=${limit}`
      );

      // const response = await axios.get(
      //   `https://chekilhamo.serv00.net/api/v1/users`
      // );

      console.log("user data: ", response);
      setLimit(response.data.limit);
      setFoundTotal(response.data.foundTotal);
      setUsersTotal(response.data.birderTotal);
      setCountryOptions(response.data.distinctCountries);
      setData(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("birders: ", data);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const handleDeleteConfirmation = async () => {
    console.log("Confirming Delete birder with ID:", deleteUserId);

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/birders/${deleteUserId}`;
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
          console.log("Failed to send notification:", error);
        }
      };
      // Create a new notification
      const notificationMessage = `Birder **${deleteuseremail}** has been deleted by **${
        currentUser.email
      }** at ${new Date().toLocaleString()}.`;
      await sendNotification(notificationMessage);
      console.log(notificationMessage);
      setData(data.filter((item) => item._id !== deleteUserId));
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    console.log("Canceled Deleting birder");
  };

  const handleDeleteUser = (userId) => {
    console.log("Deleting birder with ID:", userId);
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <div className="birders-page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "26px",
        }}
      >
        {/* <div className="birder-button-container">
          <button className="birder-export-button">Export Data</button>
        </div> */}
        <h2 className="header">
          Total Birders <span className="birder-count">({usersTotal})</span>
        </h2>
      </div>

      <div className="birder-page-container">
        <div className="birder-filter-container">
          <div className="birder-search-bar">
            <span className="material-icons google-font-icon">search</span>
            <Search
              placeholder="Search bird observer name"
              setSearch={(birderName) => setBirderName(birderName)}
              className="darker-placeholder"
            />
          </div>
          <div className="birder-filter-select">
            <Dropdown
              option={selectedCountry}
              options={countryOptions ? countryOptions : []}
              setOption={(country) => setSelectedCountry(country)}
              title="Country"
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
        </div>
        {data.map((item, index) => (
          <div className="all-birder" key={item.birder._id}>
            <div className="checklist-link">
              <div className="birder-container">
                <span
                  className="material-symbols-outlined"
                  id="toggle"
                  onClick={() => toggleDeleteButton(item.birder._id)}
                >
                  more_horiz
                </span>
                <span className="birder-info">
                  <Link
                    to={`/birders/${item.birder._id}`}
                    state={{ BirderDetail: item }}
                  >
                    <img
                      src={item.birder.photo ? item.birder.photo : profile}
                      alt=""
                      className="birder-profile"
                    />
                  </Link>
                </span>
                <h2 className="birder-name">
                  {item.birder.name}
                  <p style={{ fontSize: "12px" }}>{item.birder.profession}</p>
                </h2>
                <div className="email-contact">
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">mail</span>
                      {item.birder.email}
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>
                      {convertDate(item.birder.dob) || "none"}
                    </li>
                  </ul>
                </div>

                <div className="locatio-date">
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">
                        emoji_flags
                      </span>
                      {item.birder.country}
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        fact_check
                      </span>
                      {item.entriesCount}{" "}
                      {item.entriesCount > 1 ? "entries" : "entry"} submitted
                    </li>
                  </ul>
                </div>
                {showDeleteId === item.birder._id && (
                  <button
                    className="delete-birder"
                    onClick={() => handleDeleteUser(item.birder._id)}
                  >
                    Delete Birder
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <DeactivateModal
          message="Are you sure you want to delete this birder?"
          onConfirm={handleDeleteConfirmation}
          onCancel={handleDeleteCancel}
        />
      )}
      <Pagination
        page={page}
        limit={limit ? limit : 0}
        total={foundTotal ? foundTotal : 0}
        setPage={(page) => setPage(page)}
      />
    </div>
  );
}

export default Birder;
