import React, { useState } from "react";
import "../styles/checklistdetail.css";
import "../styles/newspeciesdetail.css";
import { logo, profile } from "../images";

import { Link } from "react-router-dom";

const Modal = ({ isOpen, onClose }) => {
  const [newName, setNewName] = useState("");

  const handleSave = () => {
    // Handle save logic here
    onClose();
  };

  const handleCancel = () => {
    // Handle cancel logic here
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

function NewSpeciesDetails() {
  const handleApprove = () => {
    console.log("Approved");
  };

  const handleReject = () => {
    console.log("Rejected");
  };

  const handleAdd = () => {
    console.log("Added");
  };

  const [showDialog, setShowDialog] = useState(false);

  const openDialog = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="checklist-detail-page-container">
      <h2 className="checklist-details-header">
        <div>
          <Link to="/checklist">
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
          Gyalpozhing Mongar Highway
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
              <tr>
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
                  <button className="reject-btn" onClick={() => handleReject()}>
                    Reject
                  </button>
                  <a href="/add-species">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove()}
                    >
                      Approve
                    </button>
                  </a>
                  <button className="add-btn" onClick={() => handleAdd()}>
                    Add
                  </button>
                </td>
              </tr>
              <tr>
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
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-container">
          <card className="card-detail">
            <article className="mt-10 mb-14 flex items-end justify-end">
              <ul>
                <li className="p-1 ">
                  <span className="font-bold">Species reported:</span> {3}
                </li>
                <li className="p-1 bg-gray-100">
                  <span className="font-bold">Duration</span> {"2hrs"}
                </li>
                <li className="p-1 ">
                  <span className="font-bold">Kilometer</span> {"3km"}
                </li>
                <li className="p-1 ">
                  <span className="font-bold">Altitude</span> {"1400m"}
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
                      <p className="name">Wangchuk</p>
                      <p className="description">Nature photographer</p>
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
export default NewSpeciesDetails;
