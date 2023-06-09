import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/checklistdetail.css";
import { logo, profile } from "../images";

function ChecklistDetail() {
  const { id } = useParams();
  console.log(id);
  const location = useLocation();
  const [showFullscreen, setShowFullscreen] = useState(false);

  const [checklist, setChecklist] = useState(
    [location.state?.ChecklistDetail] || [{ photo: [] }]
  );

  console.log(
    "bird count? ",
    checklist[0].entries[0].StartbirdingData[0].selectedTime
  );

  // Create a Set to store unique bird names
  const uniqueBirdNames = new Set();
  checklist[0].entries.forEach((item) => {
    uniqueBirdNames.add(item.BirdName);
  });

  const uniqueSpeciesCount = uniqueBirdNames.size;
  const handleApprove = async (id) => {
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists/${id}`,
        {
          approvalStatus: "approved",
        }
      );
      console.log("Approved", data);

      // Update the checklist state
      setChecklist((prevChecklist) => {
        const updatedChecklist = [...prevChecklist];
        const entryIndex = updatedChecklist[0].entries.findIndex(
          (entry) => entry._id === id
        );
        updatedChecklist[0].entries[
          entryIndex
        ].StartbirdingData[0].Approvedstatus = "approved";
        return updatedChecklist;
      });
    } catch (error) {
      console.log("Error occurred while approving checklist:", error);
    }
  };

  // Define handleReject function
  const handleReject = async (id) => {
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists/${id}`,
        {
          approvalStatus: "rejected",
        }
      );
      console.log("Rejected", data);

      // Update the checklist state
      setChecklist((prevChecklist) => {
        const updatedChecklist = [...prevChecklist];
        const entryIndex = updatedChecklist[0].entries.findIndex(
          (entry) => entry._id === id
        );
        updatedChecklist[0].entries[
          entryIndex
        ].StartbirdingData[0].Approvedstatus = "rejected";
        return updatedChecklist;
      });
    } catch (error) {
      console.log("Error occurred while rejecting checklist:", error);
    }
  };

  const [enlargedImageVisible, setEnlargedImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setEnlargedImageVisible(true);
  };

  

  return (
    <div className="checklist-detail-page-container">
      <h2 className="checklist-details-header">
        <div className="header1">
          <Link to="/checklists">
            <span className="material-icons back-arrow">arrow_back_ios</span>
          </Link>
          Checklist Details
        </div>
      </h2>

      <div className="checklist-detail-container">
        <span
          className="material-symbols-outlined"
          style={{ marginTop: ".5rem" }}
        >
          distance
        </span>
        <p className="checklist-detail-container-text">
          {checklist[0]._id.village && (
            <>
              {checklist[0]._id.village}
              {", "}
            </>
          )}

          {checklist[0]._id.gewog && (
            <>
              {checklist[0]._id.gewog}
              {", "}
            </>
          )}
          {checklist[0]._id.dzongkhag && (
            <>
              {checklist[0]._id.dzongkhag}
              {", "}
            </>
          )}
        </p>
      </div>
      <div className="checklistdetail-container">
        <div className="container-table">
          <table className="checklist-detail">
            <thead>
              <tr>
                <th>
                  <div style={{ paddingTop: "20px", paddingLeft: "10px" }}>
                    Sl.no
                  </div>
                </th>
                <th>
                  <div style={{ paddingTop: "20px" }}>Bird</div>
                </th>
                <th>
                  <div style={{ paddingTop: "20px" }}>Description</div>
                </th>
                <th>
                  <div style={{ paddingTop: "20px" }}>Count total</div>
                </th>
                <th>
                  <div style={{ paddingTop: "20px" }}>Photo</div>
                </th>
                <th>
                  <div style={{ paddingTop: "20px" }}>Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {checklist[0].entries.map((item, index) => {
                return (
                  <tr key={index}>
                    <td data-label="Sl.no">{index + 1}</td>
                    <td data-label="Bird">{item.BirdName}</td>
                    <td data-label="Description">
                      {item.StartbirdingData[0].Remarks}
                    </td>
                    <td data-label="Count total">
                      {item.StartbirdingData[0].Totalcount}
                    </td>
                    <td data-label="Photo">
                      {item.StartbirdingData[0].photo &&
                      item.StartbirdingData[0].photo !== "null" ? (
                        <img
                          src={item.StartbirdingData[0].photo}
                          alt="Bird"
                          className="bird-img"
                          onClick={() =>
                            handleImageClick(item.StartbirdingData[0]?.photo)
                          }
                        />
                      ) : (
                        <span>No photo available</span>

                      )}
                      {enlargedImageVisible && (
                      <div className="enlarged-image-container">
                        <img
                          src={selectedImage}
                          alt=""
                          className="enlarged-img"
                        />
                        <button
                          className="close-button"
                          onClick={() => setEnlargedImageVisible(false)}
                        >
                          &#10005;
                        </button>
                      </div>
                    )}
                    </td>
                    <td data-label="Action">
                      <button
                        className={`${
                          checklist[0].entries[index].StartbirdingData[0]
                            .Approvedstatus === "rejected"
                            ? "reject-btn-disabled"
                            : "reject-btn"
                        }`}
                        onClick={() => handleReject(item._id)}
                        disabled={
                          checklist[0].entries[index].StartbirdingData[0]
                            .Approvedstatus === "rejected"
                        }
                      >
                        {checklist[0].entries[index].StartbirdingData[0]
                          .Approvedstatus === "rejected"
                          ? "Rejected"
                          : "Reject"}
                      </button>

                      <button
                        className={`${
                          checklist[0].entries[index].StartbirdingData[0]
                            .Approvedstatus === "approved"
                            ? "approve-btn-disabled"
                            : "approve-btn"
                        }`}
                        onClick={() => handleApprove(item._id)}
                        disabled={
                          checklist[0].entries[index].StartbirdingData[0]
                            .Approvedstatus === "approved"
                        }
                      >
                        {checklist[0].entries[index].StartbirdingData[0]
                          .Approvedstatus === "approved"
                          ? "Approved"
                          : "Approve"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-container">
          <div className="card-detail">
            <article className="mt-10 mb-14 flex items-end justify-end">
              <ul>
                <li className="p-1 ">
                  <span className="font-bold">Species reported:</span>{" "}
                  {uniqueSpeciesCount}
                </li>
                <li className="p-1 bg-gray-100">
                  <span className="font-bold">Time</span>{" "}
                  {checklist[0].entries[0].StartbirdingData[0].selectedTime && (
                    <>
                      {checklist[0].entries[0].StartbirdingData[0].selectedTime}
                    </>
                  )}
                </li>
                <li className="p-1 ">
                  <span className="font-bold">Date</span>{" "}
                  {checklist[0]._id.selectedDate && (
                    <>{checklist[0]._id.selectedDate}</>
                  )}
                </li>
                <li className="p-1 ">
                  <span className="font-bold">Latitude</span>{" "}
                  {checklist[0].entries[0].StartbirdingData[0]
                    .currentLocation &&
                    checklist[0].entries[0].StartbirdingData[0].currentLocation
                      .latitude && (
                      <>
                        {
                          checklist[0].entries[0].StartbirdingData[0]
                            .currentLocation.latitude
                        }
                      </>
                    )}
                </li>

                <li className="p-1 ">
                  <span className="font-bold">Longitude</span>{" "}
                  {checklist[0].entries[0].StartbirdingData[0]
                    .currentLocation &&
                    checklist[0].entries[0].StartbirdingData[0].currentLocation
                      .longitude && (
                      <>
                        {
                          checklist[0].entries[0].StartbirdingData[0]
                            .currentLocation.longitude
                        }
                      </>
                    )}
                </li>

                <li className="p-1">
                  <div className="detail-container">
                    <span className="font-bold">Observer: </span>

                    <div className="detail-text">
                      <img
                        src={profile}
                        className="detail-profile"
                        alt="detail"
                      />
                      <p className="name">
                        {checklist[0]._id.village && (
                          <>{checklist[0]._id.observer}</>
                        )}
                      </p>
                      <p className="description">Birder</p>
                    </div>
                  </div>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChecklistDetail;
