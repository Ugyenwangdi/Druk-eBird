import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import "../styles/birderdetail.css";
import { profile } from "../images";

function BirderDetail() {
  const { id } = useParams();
  const location = useLocation();
  
  const [birder, setBirder] = useState(location.state?.birderDetail || {});

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        // const res = await axios.get(
        //   `http://localhost:8080/api/v1/species/${id}`
        // );
        const res = await axios.get(
          `https://druk-ebirds.onrender.com/api/v1/users/${id}`
        );

        setBirder(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecies();
  }, [id]);

    return (
        <div className='birder-detail-page-container'>
            <h2 className="birder-details-header">
                <div>
                    <Link to="/birder">
                        <span className="material-icons back-arrow">arrow_back_ios</span>
                    </Link>
                    Birder Details
                </div>
            </h2>
            <div className="parent-container">
                <div className="birder-detail-profile">
                    <img src="VerditerFlycatcher2.jpg" className="cover-img"/>
                    <div className="profile-img">
                        <img src={profile} ></img>
                    </div>
                    <div className="name-description" >
                        <h2>{birder.name}</h2>
            <p>{birder.profession}</p>
                    </div>
                    <div className="birder-detail">
                        <article className="mt-10 mb-14 flex items-end justify-end">
                            <ul>
                                <li className="p-1">
                                    <span className="font-bold">DOB:</span>
                                    <span className="ml-auto">{birder.dob}</span>
                                </li>
                                {/* <li className="p-1 bg-gray-100">
                                    <span className="font-bold">City:</span>
                                    <span className="ml-auto" >
                                        Thimphu
                                    </span>
                                </li> */}
                                <li className="p-1">
                                    <span className="font-bold">Country:</span>
                                    <span className="ml-auto" >
                                        {birder.country}
                                    </span>
                                </li>
                                <li className="p-1">
                                    <span className="font-bold">Birder:</span>
                                    <span className="ml-auto" >
                                        1400m
                                    </span>
                                </li>
                                <li className="p-1">
                                    <span className="font-bold">Birder ID:</span>
                                    <span className="ml-auto">#783747747</span>
                                </li>
                                {/* <li className="p-1">
                                    <span className="font-bold">Phone:</span>
                                    <span className="ml-auto">17532757</span>
                                </li> */}
                                <li className="p-1">
                                    <span className="font-bold">Email:</span>
                                    <span className="ml-auto">{birder.email}</span>
                                </li>
                            </ul>
                        </article>
                    </div>
                </div>
                <div className="birder-description">
                    <span class="material-symbols-outlined" style={{ marginLeft: '95%', }}>
                        more_horiz
                    </span>
                    <div className="all-bio">
                        <h2 className="birder-bio">Bio</h2>
                        <hr />
                        <p className="bio-text">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. </p>
                        <hr />
                    </div>
                    <div className="birder-states">
                        <h2 style={{ marginLeft: '2rem' }}>States</h2>
                        <div className="states-checklist">
                            <p className="states-checklist-text">Total Checklists</p>
                            <span class="material-symbols-outlined"
                                style={{
                                    fontSize: '4rem',
                                    marginTop: '5rem',
                                    marginLeft: '-6rem'
                                }}>
                                fact_check
                            </span>
                            <h1 style={{

                                marginTop: '10rem',
                                marginLeft: '-25%',
                                textAlign: 'center',
                            }}>
                                200</h1>

            </div>
          </div>
        </div>
      </div>

      <div className="total-species-observed">
        <div className="viewall-button-container">
          <button className="view-all-button">View all</button>
        </div>
        <h2 className="submitted-checklist">Submitted Checklists </h2>
        <div className="submitted-species">
          <div className="first-species">
            <img
              src="VerditerFlycatcher2.jpg"
              style={{
                width: "170px",
                height: "110px",
                borderRadius: "15px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            />

            <span className="first-span">
              <h4>Tropical kingbird</h4>
              <p className="first-location">
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
                  Gyalpozhing
                </span>
              </p>
              <h5 style={{ marginTop: "1rem" }}>08 March 2023</h5>
            </span>
          </div>
          <div className="second-species">
            <img
              src="VerditerFlycatcher2.jpg"
              style={{
                width: "170px",
                height: "110px",
                borderRadius: "15px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            />
            <span className="second-span">
              <h4>Tropical kingbird</h4>
              <p className="second-location">
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
                  Gyalpozhing
                </span>
              </p>
              <h5 style={{ marginTop: "1rem" }}>08 March 2023</h5>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BirderDetail;
