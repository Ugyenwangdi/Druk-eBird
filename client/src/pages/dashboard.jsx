import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { BarController } from "chart.js";
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
  const [checklistResult, setChecklistResult] = useState([]);
  const [entriesCount, setEntriesCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [topBirders, setTopBirders] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [chartData, setChartData] = useState(null);
  const [currentMonthChecklistCount, setCurrentMonthChecklistCount] =
    useState(0);
  const [previousMonthCount, setPreviousMonthCount] = useState(0);
  const [checklistPercentageChange, setChecklistPercentageChange] = useState(0);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

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
        console.log(data);
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

  // const chartRef1 = useRef(null);
  // const chartRef2 = useRef(null);
  // let chartInstance1 = null;
  // let chartInstance2 = null;

  // const createChart = (canvasRef, type, data, options) => {
  //   Chart.register(
  //     CategoryScale,
  //     LinearScale,
  //     BarElement,
  //     Title,
  //     Tooltip,
  //     Legend
  //   );

  //   return new Chart(canvasRef, {
  //     type: type,
  //     data: data,
  //     options: options,
  //   });
  // };

  // const createCharts = () => {
  //   const chart1 = createChart(chartRef1.current, "bar", {
  //     labels: [
  //       "Mongar",
  //       "Bumthang",
  //       "Thimphu",
  //       "Trongsa",
  //       "Gasa",
  //       "Paro",
  //       "Tashigang",
  //     ],
  //     datasets: [
  //       {
  //         label: "#No. of checklists",
  //         data: [12, 19, 3, 5, 2, 3, 20],
  //         borderWidth: 1,
  //         backgroundColor: "rgba(128, 128, 128, 0.6)",
  //       },
  //     ],
  //   });

  //   const chart2 = createChart(chartRef2.current, "bar", {
  //     labels: [
  //       "Mongar",
  //       "Bumthang",
  //       "Thimphu",
  //       "Trongsa",
  //       "Gasa",
  //       "Paro",
  //       "Tashigang",
  //     ],
  //     datasets: [
  //       {
  //         label: "#No. of checklists",
  //         data: [12, 19, 3, 5, 2, 3, 20],
  //         borderWidth: 1,
  //         backgroundColor: "rgba(19, 109, 102, 1)",
  //       },
  //     ],
  //   });

  //   chartInstance1 = chart1;
  //   chartInstance2 = chart2;
  // };

  // const destroyCharts = () => {
  //   if (chartInstance1) {
  //     chartInstance1.destroy();
  //     chartInstance1 = null;
  //   }
  //   if (chartInstance2) {
  //     chartInstance2.destroy();
  //     chartInstance2 = null;
  //   }
  // };

  // const handleResize = () => {
  //   destroyCharts();
  //   createCharts();
  // };

  // useEffect(() => {
  //   createCharts();
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     destroyCharts();
  //   };
  // }, []);

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

  const fetchTopBirders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/top-birders`
      );
      console.log("response: ", response);

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
        `${process.env.REACT_APP_API_URL}/api/v1/checklists?limit=5`
      );
      // console.log("response: ", response);
      setEntriesCount(response.data.checklistTotal);

      setChecklists(Object.values(response.data.checklists));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChecklistData();
    const interval = setInterval(fetchChecklistData, 10000);

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

  const prepareSpeciesChartData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/district-checklists`
    );

    const responseData = await response.json();
    console.log("district checklists: ", responseData);

    if (!response.ok) {
      setError(response.message);
    }
    const { changeResult, result, overallTotalCount } = responseData;

    setChecklistCount(overallTotalCount);
    setCurrentMonthChecklistCount(changeResult.currentMonthCount);
    setPreviousMonthCount(changeResult.previousMonthCount);
    setChecklistPercentageChange(changeResult.percentageChange);
    setChecklistResult(result);

    // Filter the result data based on the selected year and month
    const filteredData = result.filter(
      (data) =>
        data.year === speciesSelectedYear && data.month === speciesSelectedMonth
    );

    console.log("filteredData: ", filteredData);
    console.log("selectedYear: ", checklistSelectedYear);
    console.log("selectedMonth: ", checklistSelectedMonth);
    console.log("result: ", result);

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
            label: `Number of Checklists:  ${filteredData[0].month}, ${filteredData[0].year}`,
            data: data,
            backgroundColor: "rgba(19, 109, 102, 1)",
          },
        ],
      };

      setChartData(chartData);
    } else {
      setChartData(null); // Set chartData to null to display an empty chart
    }
  };

  useEffect(() => {
    prepareChecklistChartData();
  }, [checklists, checklistSelectedYear, checklistSelectedMonth]);

  const prepareChecklistChartData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/district-checklists`
    );

    const responseData = await response.json();
    console.log("district checklists: ", responseData);

    if (!response.ok) {
      setError(response.message);
    }
    const { changeResult, result, overallTotalCount } = responseData;

    setChecklistCount(overallTotalCount);
    setCurrentMonthChecklistCount(changeResult.currentMonthCount);
    setPreviousMonthCount(changeResult.previousMonthCount);
    setChecklistPercentageChange(changeResult.percentageChange);
    setChecklistResult(result);

    // Filter the result data based on the selected year and month
    const filteredData = result.filter(
      (data) =>
        data.year === checklistSelectedYear &&
        data.month === checklistSelectedMonth
    );

    console.log("filteredData: ", filteredData);
    console.log("selectedYear: ", checklistSelectedYear);
    console.log("selectedMonth: ", checklistSelectedMonth);
    console.log("result: ", result);

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
            label: `Number of Checklists:  ${filteredData[0].month}, ${filteredData[0].year}`,
            data: data,
            backgroundColor: "rgba(19, 109, 102, 1)",
          },
        ],
      };

      setChartData(chartData);
    } else {
      setChartData(null); // Set chartData to null to display an empty chart
    }
  };

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
        <h2 className="header">Dashboard</h2>
        <div className="checklist-button-container">
          <button className="checklist-export-button">Export Data</button>
        </div>
      </div>

      <div class="mainn-content">
        <div class="dashboard-cards">
          <div class="card-single">
            <div>
              <span>Entries</span>
              <h1>{entriesCount}</h1>
            </div>
            <div>
              <span className="material-icons">login</span>
            </div>
          </div>
          <div class="card-single">
            <div>
              <span>Species</span>
              <h1>{speciesCount}</h1>
            </div>
            <div>
              <span className="material-icons">flutter_dash</span>
            </div>
          </div>
          <div class="card-single">
            <div>
              <span>Checklists</span>
              <h1>{checklistCount}</h1>
            </div>
            <div>
              <span className="material-icons">fact_check</span>
            </div>
          </div>
          <div class="card-single">
            <div>
              <span>Birding sites</span>
              <h1>546</h1>
            </div>
            <div>
              <span className="material-icons">language</span>
            </div>
          </div>
          <div class="card-single">
            <div>
              <span>eBirders</span>
              <h1>5,732</h1>
            </div>
            <div>
              <span className="material-icons">groups</span>
            </div>
          </div>
        </div>
        <div className="graphBox">
          <div className="box">
            <div className="grid-item">
              <h3>Species Leader</h3>
              <span>
                <label htmlFor="year">Current Year</label>{" "}
                <select
                  id="year"
                  value={speciesSelectedYear}
                  onChange={(e) =>
                    setSpeciesSelectedYear(parseInt(e.target.value))
                  }
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>{" "}
                <label htmlFor="month">Current Month:</label>{" "}
                <select
                  id="month"
                  value={speciesSelectedMonth}
                  onChange={(e) => setSpeciesSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>{" "}
              </span>
            </div>
            <div class="percentage-container">
              <div class="percentage-value">{currentMonthChecklistCount}</div>
              <span className="up-arrow-icon">
                <span className="material-icons">
                  {" "}
                  {checklistPercentageChange > 0
                    ? "arrow_upward"
                    : "arrow_downward"}
                </span>
              </span>
              <div class="percentage-change">{checklistPercentageChange}%</div>
              <div class="comparison-text">than last month</div>
            </div>
            <div className="chart-wrapper">
              <div className="chart-container">
                <h2>Checklist Chart</h2>
                {chartData !== null ? (
                  <Bar
                    data={chartData}
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
          <div className="box">
            <div className="grid-item">
              <h3>Checklists Leader</h3>
              <span>
                <label htmlFor="year">Current Year</label>{" "}
                <select
                  id="year"
                  value={checklistSelectedYear}
                  onChange={(e) =>
                    setChecklistSelectedYear(parseInt(e.target.value))
                  }
                >
                  {years.map((year) => (
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
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>{" "}
              </span>
            </div>
            <div class="percentage-container">
              <div class="percentage-value"> {currentMonthChecklistCount}</div>
              <span className="up-arrow-icon">
                <span className="material-icons">
                  {checklistPercentageChange > 0
                    ? "arrow_upward"
                    : "arrow_downward"}
                </span>
              </span>
              <div class="percentage-change">{checklistPercentageChange}%</div>
              <div class="comparison-text">than last month</div>
            </div>
            <div className="chart-wrapper">
              <div className="chart-container">
                <h2>Checklist Chart</h2>
                {chartData !== null ? (
                  <Bar
                    data={chartData}
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
        <div class="recent-grid">
          <div class="top-eBirders">
            <div class="card">
              <div class="card-header">
                <h3>Top eBirders</h3>
                <button>View all</button>
              </div>
              <div class="card-body">
                {topBirders.map((birder) => (
                  <div class="eBirder">
                    <div class="info">
                      <img src={profile} class="birders-pic" />
                      <div>
                        <h4>{birder.birder}</h4>
                        <small>
                          {birder.totalChecklists}{" "}
                          {birder.totalChecklists > 1 ? "entries" : "entry"}
                        </small>
                      </div>
                    </div>
                    <div class="more-info">
                      <span className="material-icons">more_vert</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div class="latest-sights">
            <div class="card">
              <div class="card-header">
                <h3>Latest Sightings</h3>
                <span className="material-icons">arrow_forward</span>
              </div>
              <div class="card-body">
                {checklists.map((item, index) => (
                  <div class="eBirder">
                    <div class="info">
                      <img
                        src={
                          item.photos[0]
                            ? item.photos[0].url
                            : VerditerFlycatcher
                        }
                        class="bird-pic"
                      />
                      <div>
                        <h4>{item.birdName}</h4>
                        <small>{item.endpointLocation}</small>
                      </div>
                    </div>
                    <div class="sighting-date">
                      <span>{convertDate(item.selectedDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div class="explore-birds">
          <div class="section-header">
            <h3>Explore Birds</h3>
            <div class="buttons-container">
              <button>All</button>
              <button>Popular</button>
              <span class="material-icons">arrow_forward</span>
            </div>
          </div>
          <div class="popularImg-section">
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
            <span class="material-icons arrow">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
