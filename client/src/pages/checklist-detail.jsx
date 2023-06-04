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

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/checklists/${id}`
        );

        setChecklist(Object.values(response.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecies();
  }, [id]);

  console.log("checklist detail? ", checklist);

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
          Dzongkhag
          {/* {checklist.StartbirdingData[0].EndpointLocation[0].dzongkhag} {", "}
          {checklist.StartbirdingData[0].EndpointLocation[0].gewog}
          {", "}
          {checklist.StartbirdingData[0].EndpointLocation[0].village} */}
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
                <td data-label="Count total">
                  4{/* {checklist.StartbirdingData[0].count} */}
                </td>
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
                <td data-label="Count total">
                  {String(checklist[3][0].Totalcount)}
                </td>
                <td data-label="Photo">
                  <img src={logo} alt="Bird " className="bird-img" />
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
          <div className="card-detail">
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
                        // src={
                        //   checklist.StartbirdingData[0].photo
                        //     ? checklist.StartbirdingData[0].photo
                        //     : profile
                        // }
                        src={profile}
                        className="detail-profile"
                        alt="detail"
                      />
                      <p className="name">
                        Birder
                        {/* {checklist.StartbirdingData[0].observer} */}
                      </p>
                      <p className="description">Nature photographer</p>
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
