import React, { useState, useEffect } from "react";
import axios from "axios";

import "../styles/birder.css";
import { profile } from "../images";

import { Link } from "react-router-dom";

import { Pagination } from "../components";

function Birder() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [foundTotal, setFoundTotal] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/birders?search=${search}&page=${page}&limit=${limit}`
      );
      console.log("rsponse: ", response);
      setLimit(response.data.limit);
      setFoundTotal(response.data.foundTotal);
      setUsersTotal(response.data.birderTotal);
      setData(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("users: ", data);

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
        <div className="birder-button-container">
          <button className="birder-export-button">Export Data</button>
        </div>
        <h2 className="header">
          Total Birders <span className="birder-count">({usersTotal})</span>
        </h2>
      </div>
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
            <div className="checklist-link">
              <div className="birder-container">
                <span className="material-symbols-outlined">more_horiz</span>
                <span>
                  <Link to="/birder-detail">
                    <img
                      src={birder.photo ? birder.photo : profile}
                      alt=""
                      className="birder-profile"
                    />
                  </Link>
                </span>
                <h2 className="birder-name">
                  {birder.name}
                  <p style={{ fontSize: "12px" }}>{birder.profession}</p>
                </h2>
                <div className="email-contact">
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">mail</span>
                      <div
                        style={{
                          display: "inline-block",
                          wordBreak: "break-all",
                        }}
                      >
                        {" "}
                        {birder.email}
                      </div>
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>
                      {birder.dob}
                    </li>
                  </ul>
                </div>

                <div className="locatio-date">
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">
                        emoji_flags
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
            </div>
          </div>
        ))}

        {/* <div className="all-birder">
          <div className="checklist-link">
            <div className="birder-container">
              <span
                className="material-symbols-outlined"
                style={{ marginLeft: "95%", paddingRight: "18px" }}
              >
                more_horiz
              </span>

              <span>
                <Link to="/birder-detail">
                  <img src={profile} alt="" className="birder-profile" />
                </Link>
              </span>
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
                    <span className="material-symbols-outlined">
                      calendar_month
                    </span>
                    02/03/2000
                  </li>
                </ul>
              </div>

              <div className="locatio-date">
                <ul>
                  <li>
                    <span className="material-symbols-outlined">
                      emoji_flags
                    </span>
                    Bhutan
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
          </div>
        </div>

        <div className="all-birder">
          <div className="checklist-link">
            <div className="birder-container">
              <span
                className="material-symbols-outlined"
                style={{
                  marginLeft: "95%",
                  paddingRight: "18px",
                  cursor: "pointer",
                }}
              >
                more_horiz
              </span>

              <span>
                <Link to="/birder-detail">
                  <img src={profile} alt="" className="birder-profile" />
                </Link>
              </span>
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
                    <span className="material-symbols-outlined">
                      calendar_month
                    </span>
                    02/03/2000
                  </li>
                </ul>
              </div>

              <div className="locatio-date">
                <ul>
                  <li>
                    <span className="material-symbols-outlined">
                      emoji_flags
                    </span>
                    Bhutan
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
          </div>
        </div> */}
      </div>
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
