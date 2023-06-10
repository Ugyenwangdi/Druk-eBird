import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import "../styles/birderdetail.css";
import { profile, VerditerFlycatcher } from "../images";
import { DeactivateModal } from "../components";

function BirderDetail() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [birder, setBirder] = useState(
    location.state?.BirderDetail?.birder || [{}]
  );
  const [entries, setEntries] = useState(
    location.state?.BirderDetail?.entries || [{}]
  );

  const [totalEntries, setTotalEntries] = useState(
    location.state?.BirderDetail?.entriesCount || 0
  );

  console.log("Entries : ", entries);

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
    <div className="birder-detail-page-container">
      <h2 className="birder-details-header">
        <div>
          <Link to="/birders">
            <span className="material-icons back-arrow">arrow_back_ios</span>
          </Link>
          Birder Details
        </div>
      </h2>
      <div className="parent-container">
        <span
          className="material-symbols-outlined"
          id="toggle1"
          onClick={() => toggleDeleteButton(birder._id)}
        >
          more_horiz
        </span>
        {showDeleteId === birder._id && (
          <button
            className="delete-birder1"
            onClick={() => handleDeleteUser(birder._id)}
          >
            Delete Birder
          </button>
        )}
        {showDeleteModal && (
          <DeactivateModal
            message="Are you sure you want to delete this birder?"
            onConfirm={handleDeleteConfirmation}
            onCancel={handleDeleteCancel}
          />
        )}
        <div className="birder-detail-profile">
          <img src={VerditerFlycatcher} className="cover-img" alt="cover" />
          <div className="profile-img">
            {birder.photo && birder.photo !== "null" ? (
              <img src={birder.photo} alt="profile" className="bird-img" />
            ) : (
              <img src={profile} alt="Logo" className="bird-img" />
            )}
          </div>
          <div className="name-description">
            <h2>{birder.name}</h2>
            <p>{birder.profession}</p>
          </div>
          <div className="birder-detail">
            <article className="mt-10 mb-14 flex items-end justify-end">
              <ul>
                <li className="p-1">
                  <span className="font-bold">DOB:</span>
                  <span className="ml-auto">
                    {convertDate(birder.dob) || "none"}
                  </span>
                </li>
                <li className="p-1">
                  <span className="font-bold">Country:</span>
                  <span className="ml-auto">{birder.country}</span>
                </li>

                <li className="p-1">
                  <span className="font-bold">Birder ID:</span>
                  <span className="ml-auto">#783747747</span>
                </li>

                <li className="p-1">
                  <span className="font-bold">Email:</span>
                  <span className="ml-auto">{birder.email}</span>
                </li>
              </ul>
            </article>
            <div className="states-row">
              <div className="states">States:</div>
              <div className="states-checklist">
                <p className="states-checklist-text">Total Entries</p>
                <span className="material-symbols-outlined">fact_check</span>
                <h1>{totalEntries}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="entries-species">
        <h2>Submitted Checklists</h2>
        <div className="entries-container">
          {entries.map((item, index) => {
            return (
              <div className="species-card2">
                <span
                  style={{
                    display: "inline-block",
                    width: "200px",
                    height: "130px",
                    border: "1px solid #dee4ed",
                    borderRadius: "10px",
                  }}
                >
                  <img src={VerditerFlycatcher} alt="placeholder" />
                </span>

                <div className="species-card2-content">
                  <h3 className="species-card2-name">{item.BirdName}</h3>
                  <div className="species-card-location">
                    <span
                      class="material-symbols-outlined"
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        fontSize: "16px",
                      }}
                    >
                      location_on
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        fontSize: "11px",
                        paddingLeft: "5px",
                      }}
                    >
                      {item.StartbirdingData[0].EndpointLocation[0].village && (
                        <>
                          {item.StartbirdingData[0].EndpointLocation[0].village}
                          {", "}
                        </>
                      )}

                      {item.StartbirdingData[0].EndpointLocation[0].gewog && (
                        <>
                          {item.StartbirdingData[0].EndpointLocation[0].gewog}
                          {", "}
                        </>
                      )}
                      {item.StartbirdingData[0].EndpointLocation[0]
                        .dzongkhag && (
                        <>
                          {
                            item.StartbirdingData[0].EndpointLocation[0]
                              .dzongkhag
                          }
                          {", "}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="species-card-date">
                    {convertDate(item.StartbirdingData[0].selectedDate) ||
                      "none"}
                  </div>
                </div>
              </div>
            );
          })}
          {/* <div className="species-card2">
            <span
              style={{
                display: "inline-block",
                width: "200px",
                height: "130px",
                border: "1px solid #dee4ed",
                borderRadius: "10px",
              }}
            >
              <img src={VerditerFlycatcher} alt="placeholder" />
            </span>

            <div className="species-card2-content">
              <h3 className="species-card2-name">Tropical kingbird</h3>
              <div className="species-card-location">
                <span class="material-symbols-outlined">location_on</span>
                <span>Gyalpozhing</span>
              </div>
              <div className="species-card-date">08 March 2023</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
export default BirderDetail;
