import React from "react";
import "../styles/checklistdetail.css";
import { logo, profile } from "../images";

import { Link } from "react-router-dom";

function NewSpeciesDetails() {
  const handleApprove = () => {
    // Add logic to handle approve action
    console.log("Approved");
  };

  // Define handleReject function
  const handleReject = () => {
    // Add logic to handle reject action
    console.log("Rejected");
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
                <td data-label="Bird">Spotted Dov</td>
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
                </td>
              </tr>
              <tr>
                <td data-label="Sl.no">1</td>
                <td data-label="Bird">Spotted Dov</td>
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
                  <a href="/add-species">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove()}
                    >
                      Approve
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
