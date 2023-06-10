import React, { useState, useEffect } from "react";
import axios from "axios";

import "../styles/birder.css";
import { profile } from "../images";

import { Link } from "react-router-dom";

import { Search, Dropdown, Pagination } from "../components";

function Birder() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [foundTotal, setFoundTotal] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
  const [birderName, setBirderName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [countryOptions, setCountryOptions] = useState([]);

  const [showDeleteId, setShowDeleteId] = useState(null);

  const deleteBirder = (id) => {
    // Add your delete logic here using the id
    console.log("Deleting birder with ID:", id);
  };

  const toggleDeleteButton = (id) => {
    setShowDeleteId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, birderName, selectedCountry]);

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
  console.log("users: ", data);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

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
        {data.map((birder, index) => (
          <div className="all-birder" key={birder._id}>
            <div className="checklist-link">
              <div className="birder-container">
                <span
                  className="material-symbols-outlined"
                  id="toggle"
                  onClick={() => toggleDeleteButton(birder._id)}
                >
                  more_horiz
                </span>
                <span className="birder-info">
                  <Link
                    to={`/birders/${birder._id}`}
                    state={{ BirderDetail: birder }}
                  >
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
                      {birder.email}
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>
                      {convertDate(birder.dob) || "none"}
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
                {showDeleteId === birder._id && (
                  <button
                    className="delete-birder"
                    onClick={() => deleteBirder(birder._id)}
                  >
                    Delete Birder
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
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
