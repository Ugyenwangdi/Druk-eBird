import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { profile, VerditerFlycatcher } from "../images";
import "../styles/dashboard.css";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const token = localStorage.getItem("token");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = getMonthName(currentDate.getMonth());

  const [isValidToken, setIsValidtoken] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [isDeactivatedUser, setIsDeactivatedUser] = useState(false);
  const [isNotAdmin, setIsNotAdmin] = useState(false);
  const [checkedDeactivatedUser, setCheckedDeactivatedUser] = useState(false);
  const [checklistCount, setChecklistCount] = useState(0);
  const [entriesCount, setEntriesCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [birdingSitesCount, setBirdingSitesCount] = useState(0);
  const [topBirders, setTopBirders] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [birdersCount, setBirdersCount] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [checklistChartData, setChecklistChartData] = useState(null);
  const [speciesChartData, setSpeciesChartData] = useState(null);

  const [currentMonthChecklistCount, setCurrentMonthChecklistCount] =
    useState(0);
  const [previousMonthChecklistCount, setPreviousMonthChecklistCount] =
    useState(0);

  const [currentMonthSpeciesCount, setCurrentMonthSpeciesCount] = useState(0);
  const [previousMonthSpeciesCount, setPreviousMonthSpeciesCount] = useState(0);

  const [checklistPercentageChange, setChecklistPercentageChange] = useState(0);
  const [speciesPercentageChange, setSpeciesPercentageChange] = useState(0);

  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

  const [checklistYears, setChecklistYears] = useState([]);
  const [checklistMonths, setChecklistMonths] = useState([]);

  const [speciesSelectedYear, setSpeciesSelectedYear] = useState(currentYear);
  const [speciesSelectedMonth, setSpeciesSelectedMonth] =
    useState(currentMonth);

  const [checklistSelectedYear, setChecklistSelectedYear] =
    useState(currentYear);
  const [checklistSelectedMonth, setChecklistSelectedMonth] =
    useState(currentMonth);

  const validateToken = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/checkLoggedIn`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 && res.data.valid) {
        setIsValidtoken(true);
      } else {
        localStorage.removeItem("token");
        setIsValidtoken(false);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      setIsValidtoken(false);
    } finally {
      setTokenValidated(true); // set the state variable to true once validation is complete
    }
  }, [token]);

  const fetchCurrentUser = useCallback(async () => {
    if (!tokenValidated) return; // skip the API call if the token has not been validated yet

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
      setIsDeactivatedUser(response.data.user.isDeactivated);
      setIsNotAdmin(response.data.user.userType === "user");
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setCheckedDeactivatedUser(true);
    }
  }, [token, tokenValidated]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (currentUser.id) {
      const getAdminDetails = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${currentUser.id}`
        );
        const data = await response.json();
        // console.log(data);
        setIsNotAdmin(data.userType === "user");
      };

      getAdminDetails();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!checkedDeactivatedUser) return;
    if (isDeactivatedUser) {
      localStorage.removeItem("token");
      window.location = "/deactivated";
    }
  }, [checkedDeactivatedUser, isDeactivatedUser]);

  useEffect(() => {
    if (!checkedDeactivatedUser) return;
    if (isNotAdmin) {
      localStorage.removeItem("token");
      window.location = "/not-admin";
    }
  }, [checkedDeactivatedUser, isNotAdmin]);

  const fetchCount = async () => {
    // Fetch species count
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/species/get-count`)
      .then((response) => response.json())
      .then((data) => {
        setSpeciesCount(data.count);
      })
      .catch((error) => {
        setError("Failed to fetch species count:", error);
      });
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchBirders = async () => {
    // Fetch species count
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/birders-count`)
      .then((response) => response.json())
      .then((data) => {
        setBirdersCount(data.count);
      })
      .catch((error) => {
        setError("Failed to fetch birders:", error);
      });
  };

  useEffect(() => {
    fetchBirders();
  }, []);

  const fetchBirdingSitesCount = async () => {
    // Fetch species count
    fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/birdingsites-count`
    )
      .then((response) => response.json())
      .then((data) => {
        setBirdingSitesCount(data.count);
      })
      .catch((error) => {
        setError("Failed to fetch species count:", error);
      });
  };

  useEffect(() => {
    fetchBirdingSitesCount();
  }, []);

  const fetchTopBirders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/top-birders`
      );
      // console.log("response: ", response);

      setTopBirders(Object.values(response.data.slice(0, 5)));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopBirders();
  }, []);

  const fetchChecklistData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/entries?limit=5`
      );
      console.log("response: ", response);
      setEntriesCount(response.data.entriesTotal);

      setChecklists(Object.values(response.data.checklists));
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Checklists: ", checklists);

  useEffect(() => {
    fetchChecklistData();
    const interval = setInterval(fetchChecklistData, 10000); // 60 seconds
    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
    };
  }, []);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    prepareSpeciesChartData();
  }, [checklists, speciesSelectedYear, speciesSelectedMonth]);

  // useEffect(() => {
  //   if (!months.includes(currentMonth)) {
  //     if (months.length > 0) {
  //       if (!speciesSelectedMonth) {
  //         setSpeciesSelectedMonth(months[months.length - 1]);
  //       }
  //       if (!speciesSelectedYear) {
  //         setSpeciesSelectedYear(years[years.length - 1]);
  //       }
  //     }
  //   }
  // }, [currentMonth, months, years]);

  const prepareSpeciesChartData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/district-species`
    );

    const responseData = await response.json();
    // console.log("district checklists: ", responseData);

    if (!response.ok) {
      setError(response.message);
    }
    const { changeResult, result, overallTotalCount } = responseData;

    // setSpeciesCount(overallTotalCount);
    setCurrentMonthSpeciesCount(changeResult.currentMonthCount);
    setPreviousMonthSpeciesCount(changeResult.previousMonthCount);
    setSpeciesPercentageChange(changeResult.percentageChange);

    // Filter the result data based on the selected year and month
    const filteredData = result.filter(
      (data) =>
        data.year === speciesSelectedYear && data.month === speciesSelectedMonth
    );

    setSelectedData(filteredData);

    // console.log("filteredData: ", filteredData);
    // console.log("species selectedYear: ", speciesSelectedYear);
    // console.log("species selectedMonth: ", speciesSelectedMonth);
    // console.log("result: ", result);

    const uniqueYears = [...new Set(result.map((data) => data.year))];
    const uniqueMonths = [...new Set(result.map((data) => data.month))];
    setYears(uniqueYears);
    setMonths(uniqueMonths);

    if (filteredData.length > 0) {
      // Extract the labels and data for the selected year and month
      const labels = filteredData[0].labels;
      const data = filteredData[0].data;

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: `No. of Species observed:  ${filteredData[0].month}, ${filteredData[0].year}`,
            data: data,
            backgroundColor: "rgba(19, 109, 102, 1)",
          },
        ],
      };

      setSpeciesChartData(chartData);
    } else {
      setSpeciesChartData(null); // Set chartData to null to display an empty chart
    }
  };

  useEffect(() => {
    prepareChecklistChartData();
  }, [checklists, checklistSelectedYear, checklistSelectedMonth]);

  // useEffect(() => {
  //   if (!checklistMonths.includes(currentMonth)) {
  //     if (checklistMonths.length > 0) {
  //       if (!checklistSelectedMonth) {
  //         setChecklistSelectedMonth(
  //           checklistMonths[checklistMonths.length - 1]
  //         );
  //       }
  //       if (!checklistSelectedYear) {
  //         setChecklistSelectedYear(checklistYears[checklistYears.length - 1]);
  //       }
  //     }
  //   }
  // }, [currentMonth, checklistMonths, checklistYears]);

  const prepareChecklistChartData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/district-checklists`
    );

    const responseData = await response.json();
    // console.log("district checklists: ", responseData);

    if (!response.ok) {
      setError(response.message);
    }
    const { changeResult, result, overallTotalCount } = responseData;

    setChecklistCount(overallTotalCount);
    setCurrentMonthChecklistCount(changeResult.currentMonthCount);
    setPreviousMonthChecklistCount(changeResult.previousMonthCount);
    setChecklistPercentageChange(changeResult.percentageChange);

    // Filter the result data based on the selected year and month
    const filteredData = result.filter(
      (data) =>
        data.year === checklistSelectedYear &&
        data.month === checklistSelectedMonth
    );

    // console.log("filteredData: ", filteredData);
    // console.log("selectedYear: ", checklistSelectedYear);
    // console.log("selectedMonth: ", checklistSelectedMonth);
    // console.log("result: ", result);

    const uniqueYears = [...new Set(result.map((data) => data.year))];
    const uniqueMonths = [...new Set(result.map((data) => data.month))];
    setChecklistYears(uniqueYears);
    setChecklistMonths(uniqueMonths);

    if (filteredData.length > 0) {
      // Extract the labels and data for the selected year and month
      const labels = filteredData[0].labels;
      const data = filteredData[0].data;

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: `No. of Checklists:  ${filteredData[0].month}, ${filteredData[0].year}`,
            data: data,
            backgroundColor: "rgba(19, 109, 102, 1)",
          },
        ],
      };

      setChecklistChartData(chartData);
    } else {
      setChecklistChartData(null); // Set chartData to null to display an empty chart
    }
  };

  useEffect(() => {
    const fetchSpeciesList = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/v1/species/get?limit=3`;

        const { data } = await axios.get(url);
        setSpeciesList(data.species);
      } catch (err) {
        setError("Failed to fetch species list. Please try again later.");
      }
    };
    fetchSpeciesList();
  }, []);

  // Helper function to get the month name
  function getMonthName(month) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "26px",
        }}
      >
        <h2 className="total-header">Dashboard</h2>
      </div>

      <div className="mainn-content">
        <div className="dashboard-cards">
          <div className="card-single">
            <div>
              <span>Entries</span>
              <h1>{entriesCount}</h1>
            </div>
            <div>
              <span className="material-icons">login</span>
            </div>
          </div>
          <div className="card-single">
            <div>
              <span>Species</span>
              <h1>{speciesCount}</h1>
            </div>
            <div>
              <span className="material-icons">flutter_dash</span>
            </div>
          </div>
          <div className="card-single">
            <div>
              <span>Checklists</span>
              <h1>{checklistCount}</h1>
            </div>
            <div>
              <span className="material-icons">fact_check</span>
            </div>
          </div>
          <div className="card-single">
            <div>
              <span>Birding sites</span>
              <h1>{birdingSitesCount}</h1>
            </div>
            <div>
              <span className="material-icons">language</span>
            </div>
          </div>
          <div className="card-single">
            <div>
              <span>eBirders</span>
              <h1>{birdersCount}</h1>
            </div>
            <div>
              <span className="material-icons">groups</span>
            </div>
          </div>
        </div>
        <div className="graphBox">
          <div className="box">
            <div className="grid-item">
              <h3>Species Leaders</h3>
              <span>
                <label htmlFor="year">Current Year</label>{" "}
                <select
                  id="year"
                  value={speciesSelectedYear}
                  onChange={(e) =>
                    setSpeciesSelectedYear(parseInt(e.target.value))
                  }
                  className="year-select"
                >
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>{" "}
                <label htmlFor="month">Current Month:</label>{" "}
                <select
                  id="month"
                  value={speciesSelectedMonth}
                  onChange={(e) => setSpeciesSelectedMonth(e.target.value)}
                  className="year-select"
                >
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>{" "}
              </span>
            </div>
            <div className="percentage-container">
              <div className="percentage-value">{currentMonthSpeciesCount}</div>
              <span className="up-arrow-icon">
                <span className="material-icons">
                  {" "}
                  {speciesPercentageChange >= 0
                    ? "arrow_upward"
                    : "arrow_downward"}
                </span>
              </span>
              <div className="percentage-change">
                {speciesPercentageChange}%
              </div>
              <div className="comparison-text">than last month</div>
            </div>
            <div className="chart-wrapper">
              <div className="chart-container">
                {speciesChartData !== null ? (
                  <Bar
                    data={speciesChartData}
                    options={{
                      responsive: true,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: true,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              let labelText = context.dataset.label || "";
                              if (context.parsed.y !== null) {
                                labelText +=
                                  ", " + context.parsed.y + " species";
                                const index = context.dataIndex;
                                const label = context.chart.data.labels[index];
                                const birdNames =
                                  selectedData[0].birdNames[label];
                                labelText += " (" + birdNames.join(", ") + ")";
                              }
                              return labelText;
                            },
                          },
                        },
                      },
                      layout: {
                        padding: {
                          left: 10,
                          right: 10,
                          top: 10,
                          bottom: 10,
                        },
                      },
                    }}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: [],
                      datasets: [],
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        x: {
                          display: true,
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          display: true,
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="box">
            <div className="grid-item">
              <h3>Checklists Leaders</h3>
              <span>
                <label htmlFor="year">Current Year</label>{" "}
                <select
                  id="year"
                  value={checklistSelectedYear}
                  onChange={(e) =>
                    setChecklistSelectedYear(parseInt(e.target.value))
                  }
                  className="year-select"
                >
                  {checklistYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>{" "}
                <label htmlFor="month">Current Month:</label>{" "}
                <select
                  id="month"
                  value={checklistSelectedMonth}
                  onChange={(e) => setChecklistSelectedMonth(e.target.value)}
                  className="year-select"
                >
                  {checklistMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>{" "}
              </span>
            </div>
            <div className="percentage-container">
              <div className="percentage-value">
                {" "}
                {currentMonthChecklistCount}
              </div>
              <span className="up-arrow-icon">
                <span className="material-icons">
                  {checklistPercentageChange >= 0
                    ? "arrow_upward"
                    : "arrow_downward"}
                </span>
              </span>
              <div className="percentage-change">
                {checklistPercentageChange}%
              </div>
              <div className="comparison-text">than last month</div>
            </div>
            <div className="chart-wrapper">
              <div className="chart-container">
                {checklistChartData !== null ? (
                  <Bar
                    data={checklistChartData}
                    options={{
                      responsive: true,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: true,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              let labelText = context.dataset.label || "";
                              if (context.parsed.y !== null) {
                                labelText +=
                                  ": " + context.parsed.y + " checklists";
                              }
                              return labelText;
                            },
                          },
                        },
                      },
                      layout: {
                        padding: {
                          left: 10,
                          right: 10,
                          top: 10,
                          bottom: 10,
                        },
                      },
                    }}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: [],
                      datasets: [],
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        x: {
                          display: true,
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          display: true,
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="recent-grid">
          <div className="top-eBirders">
            <div className="card">
              <div className="card-header">
                <h3>Top eBirders</h3>
                <Link to="/top-birders">
                  <button>View all</button>
                </Link>
              </div>
              <div className="card-body">
                {topBirders.map((birder, index) => (
                  <div className="eBirder" key={index}>
                    <div className="info">
                      <img src={profile} className="birders-pic" />
                      <div>
                        <h4>{birder.birder}</h4>
                        <small>
                          {birder.totalChecklists}{" "}
                          {birder.totalChecklists > 1 ? "entries" : "entry"}
                        </small>
                      </div>
                    </div>
                    <div className="more-info">
                      <span className="material-icons">more_vert</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="latest-sights">
            <div className="card">
              <div className="card-header">
                <h3>Latest Sightings</h3>
                <a href="/entries">
                  <span className="material-icons">arrow_forward</span>
                </a>
              </div>
              <div className="card-body">
                {checklists.map((item, index) => (
                  <div className="eBirder" key={index}>
                    <div className="info">
                      <img
                        src={
                          item.StartbirdingData[0].photo
                            ? item.StartbirdingData[0].photo
                            : VerditerFlycatcher
                        }
                        className="bird-pic"
                      />
                      <div>
                        <h4>{item.BirdName}</h4>
                        <small>
                          {
                            item.StartbirdingData[0].EndpointLocation[0]
                              .dzongkhag
                          }{" "}
                          {item.StartbirdingData[0].EndpointLocation[0].gewog}{" "}
                          {item.StartbirdingData[0].EndpointLocation[0].village}
                        </small>
                      </div>
                    </div>
                    <div className="sighting-date">
                      <span>
                        {convertDate(item.StartbirdingData[0].selectedDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="explore-birds">
          <div className="section-header">
            <h3>Explore Birds</h3>
            <a href="/species">
              {" "}
              <div className="buttons-container">
                <span className="material-icons">arrow_forward</span>
              </div>
            </a>
          </div>
          <div className="popularImg-section">
            {speciesList.map((species) => (
              <div className="popular-img" key={species._id}>
                {species.photos[0] ? (
                  <img
                    src={species.photos[0].url}
                    alt={species.englishName}
                    className="b-img"
                  />
                ) : (
                  <img src={VerditerFlycatcher} className="b-img" />
                )}

                <div className="name-button-container">
                  <h3>{species.englishName}</h3>
                  <button>{species.iucnStatus}</button>
                </div>
              </div>
            ))}

            {/* <div class="popular-img">
              <img src={VerditerFlycatcher} class="b-img" />

              <div className="name-button-container">
                <h3>Dove</h3>
                <button>Landbird</button>
              </div>
              <span class="material-icons">
                location_on <small>Dochula</small>
              </span>
            </div>
            <div class="popular-img">
              <img src={VerditerFlycatcher} class="b-img" />
              <div className="name-button-container">
                <h3>Dove</h3>
                <button>Landbird</button>
              </div>
              <span class="material-icons">
                location_on <small>Dochula</small>
              </span>
            </div>
            <div class="popular-img">
              <img src={VerditerFlycatcher} class="b-img" />
              <div className="name-button-container">
                <h3>Dove</h3>
                <button>Landbird</button>
              </div>
              <span class="material-icons">
                location_on <small>Dochula</small>
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
