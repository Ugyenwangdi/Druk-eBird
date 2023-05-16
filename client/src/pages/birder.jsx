import React, { useState, useEffect } from "react";
import axios from "axios";

import "../styles/birder.css";
import { profile } from "../images";

import { Link } from "react-router-dom";

import { Pagination } from "../components";

function Birder() {
  //   const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://druk-ebirds.onrender.com/api/v1/users"
      );
      console.log("rsponse: ", response);

      const jsonData = await response.json();
      setData(Object.values(jsonData.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="birders-page-container">
      <div className="birder-button-container">
        <button className="birder-export-button">Export Data</button>
      </div>
      <h2>
        Total Enteries <span className="birder-count">(700)</span>
      </h2>
      <div className="birder-page-container">
        <div className="birder-filter-container">
          <div className="birder-search-bar">
            <span className="material-icons google-font-icon">search</span>
            <input type="text" placeholder="Enter birder name" />
            {/* <Search setSearch={(search) => setSearch(search)} /> */}
          </div>
          <div className="birder-filter-select">
            <select className="birder-filter-dropdown">
              <option value="">District</option>
              <option value="1">District 1</option>
              <option value="2">District 2</option>
              <option value="3">District 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
        </div>
        {data.map((birder) => (
          <div className="all-birder" key={birder._id}>
            <Link to="/birder-detail" className="checklist-link">
              <div className="birder-container">
                <span
                  className="material-symbols-outlined"
                  style={{ marginLeft: "95%" }}
                >
                  more_horiz
                </span>
                <img
                  src={profile}
                  alt=""
                  style={{ borderRadius: "15px" }}
                  className="birder-profile"
                />

                <h2 className="birder-name">
                  {birder.name}
                  <p style={{ fontSize: "12px" }}>{birder.profession}</p>
                </h2>
                <div className="email-contact">
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">mail</span>
                      {birder.email}
                    </li>
                    <li>
                      <span className="material-symbols-outlined">call</span>
                      +975-00000000
                    </li>
                  </ul>
                </div>

                <div className="locatio-date">
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      {birder.country}
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        fact_check
                      </span>
                      10 completed checklists
                    </li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>
        ))}
        <div className="all-birder">
          <Link to="/birder-detail" className="checklist-link">
            <div className="birder-container">
              <span
                className="material-symbols-outlined"
                style={{ marginLeft: "95%" }}
              >
                more_horiz
              </span>

              <img src={profile} alt="" className="birder-profile" />

              <h2 className="birder-name">
                Sonam
                <p style={{ fontSize: "12px" }}>Photographer</p>
              </h2>
              <div className="email-contact">
                <ul>
                  <li>
                    <span className="material-symbols-outlined">mail</span>
                    ex@gmail.com
                  </li>
                  <li>
                    <span className="material-symbols-outlined">call</span>
                    +975-17728216
                  </li>
                </ul>
              </div>

              <div className="locatio-date">
                <ul>
                  <li>
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    Gyalpozhing
                  </li>
                  <li>
                    <span className="material-symbols-outlined">
                      fact_check
                    </span>
                    10 completed checklists
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* <Pagination
        page={page}
        limit={data.limit ? data.limit : 0}
        total={data.foundTotal ? data.foundTotal : 0}
        setPage={(page) => setPage(page)}
      /> */}
    </div>
  );
}

export default Birder;
