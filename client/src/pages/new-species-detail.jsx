import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/checklistdetail.css";
import "../styles/newspeciesdetail.css";
import { logo, profile } from "../images";

const Modal = ({ isOpen, onClose, itemId }) => {
  const { id } = useParams();
  const [newName, setNewName] = useState("");

  const handleSave = async (id) => {
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists/${itemId}`,
        {
          BirdName: "New bird - " + newName,
        }
      );
      console.log("Bird name updated:", data);

      onClose();
    } catch (error) {
      console.log("Error occurred while updating bird name:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <label htmlFor="newName">New Name:</label>
            <input
              type="text"
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function NewSpeciesDetail() {
  const { id } = useParams();
  console.log(id);
  const location = useLocation();
  const [showFullscreen, setShowFullscreen] = useState(false);

  const [newSpecies, setNewSpecies] = useState(
    [location.state?.NewSpeciesDetails] || [{ photo: [] }]
  );

  console.log(
    "bird count? ",
    newSpecies[0].entries[0].StartbirdingData[0].selectedTime
  );

  // Create a Set to store unique bird names
  const uniqueBirdNames = new Set();
  newSpecies[0].entries.forEach((item) => {
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
      setNewSpecies((prevChecklist) => {
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
      setNewSpecies((prevChecklist) => {
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

  const handleAdd = () => {
    console.log("Added");
  };

  const [showDialog, setShowDialog] = useState(false);

  const openDialog = (e) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="checklist-detail-page-container">
      <h2 className="checklist-details-header">
        <div>
          <Link to="/new-species">
            <span className="material-icons back-arrow">arrow_back_ios</span>
          </Link>
          New Species Details
        </div>
      </h2>

      <div className="checklist-detail-container">
        <span class="material-symbols-outlined" style={{ marginTop: ".5rem" }}>
          distance
        </span>
        <p className="checklist-detail-container-text">
          {newSpecies[0]._id.village && (
            <>
              {newSpecies[0]._id.village}
              {", "}
            </>
          )}

          {newSpecies[0]._id.gewog && (
            <>
              {newSpecies[0]._id.gewog}
              {", "}
            </>
          )}
          {newSpecies[0]._id.dzongkhag && (
            <>
              {newSpecies[0]._id.dzongkhag}
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
              {newSpecies[0].entries.map((item, index) => {
                return (
                  <tr key={index}>
                    <td data-label="Sl.no">{index + 1}</td>
                    <td>
                      <span style={{ marginRight: "0.5rem" }}>
                        {item.BirdName}
                      </span>
                      <a href="#" onClick={(event) => openDialog(event)}>
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "20px",
                            color: "black",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = "#ba760d";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = "black";
                          }}
                        >
                          edit
                        </span>
                      </a>
                      <Modal
                        isOpen={showDialog}
                        onClose={closeDialog}
                        itemId={item._id}
                      />
                    </td>
                    <td data-label="Description">
                      {" "}
                      {item.StartbirdingData[0].Remarks}
                    </td>
                    <td data-label="Count total">
                      {" "}
                      {item.StartbirdingData[0].Totalcount}
                    </td>
                    <td data-label="Photo">
                      <img
                        src={
                          item.StartbirdingData[0].photo
                            ? item.StartbirdingData[0].photo
                            : logo
                        }
                        alt="Bird"
                        className="bird-img"
                      />
                    </td>
                    <td data-label="Action">
                      <button
                        className={`${
                          newSpecies[0].entries[index].StartbirdingData[0]
                            .Approvedstatus === "rejected"
                            ? "reject-btn-disabled"
                            : "reject-btn"
                        }`}
                        onClick={() => handleReject(item._id)}
                        disabled={
                          newSpecies[0].entries[index].StartbirdingData[0]
                            .Approvedstatus === "rejected"
                        }
                      >
                        {newSpecies[0].entries[index].StartbirdingData[0]
                          .Approvedstatus === "rejected"
                          ? "Rejected"
                          : "Reject"}
                      </button>

                      <button
                        className={`${
                          newSpecies[0].entries[index].StartbirdingData[0]
                            .Approvedstatus === "approved"
                            ? "approve-btn-disabled"
                            : "approve-btn"
                        }`}
                        onClick={() => handleApprove(item._id)}
                        disabled={
                          newSpecies[0].entries[index].StartbirdingData[0]
                            .Approvedstatus === "approved"
                        }
                      >
                        {newSpecies[0].entries[index].StartbirdingData[0]
                          .Approvedstatus === "approved"
                          ? "Approved"
                          : "Approve"}
                      </button>
                      <Link to="/species/add">
                        <button className="add-btn" onClick={() => handleAdd()}>
                          Add
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {/* <tr>
                <td data-label="Sl.no">1</td>
                <td>
                  <span style={{ marginRight: "0.5rem" }}>Spotted Dov</span>
                  <a href="#" onClick={openDialog}>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "20px",
                        color: "black",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#ba760d";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "black";
                      }}
                    >
                      edit
                    </span>
                  </a>
                  <Modal isOpen={showDialog} onClose={closeDialog} />
                </td>
                <td data-label="Description">Sonam</td>
                <td data-label="Count total">2</td>
                <td data-label="Photo">
                  <img src={logo} alt="Bird" className="bird-img" />
                </td>
                <td data-label="Action">
                  <a href="/reject-request">
                    <button
                      className="reject-btn"
                      onClick={() => handleReject()}
                    >
                      Reject
                    </button>
                  </a>
                  <a href="/approved">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove()}
                    >
                      Approve
                    </button>
                  </a>
                  <a href="/add-species">
                    <button className="add-btn" onClick={() => handleAdd()}>
                      Add
                    </button>
                  </a>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
        <div className="card-container">
          <card className="card-detail">
            <article className="mt-10 mb-14 flex items-end justify-end">
              <ul>
                <li className="p-1 ">
                  <span className="font-bold">Species reported:</span>{" "}
                  {uniqueSpeciesCount}
                </li>
                <li className="p-1 bg-gray-100">
                  <span className="font-bold">Time</span>{" "}
                  {newSpecies[0].entries[0].StartbirdingData[0]
                    .selectedTime && (
                    <>
                      {
                        newSpecies[0].entries[0].StartbirdingData[0]
                          .selectedTime
                      }
                    </>
                  )}
                </li>
                <li className="p-1 ">
                  <span className="font-bold">Date</span>{" "}
                  {newSpecies[0]._id.selectedDate && (
                    <>{newSpecies[0]._id.selectedDate}</>
                  )}
                </li>
                <li className="p-1 ">
                  <span className="font-bold">Latitude</span>{" "}
                  {newSpecies[0].entries[0].StartbirdingData[0].currentLocation
                    .latitude && (
                    <>
                      {
                        newSpecies[0].entries[0].StartbirdingData[0]
                          .currentLocation.latitude
                      }
                    </>
                  )}
                </li>
                <li className="p-1 ">
                  <span className="font-bold">Longitude</span>{" "}
                  {newSpecies[0].entries[0].StartbirdingData[0].currentLocation
                    .longitude && (
                    <>
                      {
                        newSpecies[0].entries[0].StartbirdingData[0]
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
                        {" "}
                        {newSpecies[0]._id.village && (
                          <>{newSpecies[0]._id.observer}</>
                        )}
                      </p>
                      <p className="description">Birder</p>
                    </div>
                  </div>
                </li>
              </ul>
            </article>
          </card>
        </div>
      </div>
    </div>
  );
}
export default NewSpeciesDetail;
