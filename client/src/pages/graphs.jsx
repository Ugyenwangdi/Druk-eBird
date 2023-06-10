import React, { useState, useEffect, useCallback } from "react";
import { CSVLink } from "react-csv";
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

import { VerditerFlycatcher } from "../images";
import "../styles/graphs.css";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getTrimmedLabel = (label, maxLength) => {
  if (label.length > maxLength) {
    return label.substring(0, maxLength) + "...)";
  }
  return label;
};

const BirdChart = ({ data, selectedYearData }) => {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: "Different birds observed",
        data: [],
        backgroundColor: "rgba(19, 109, 102, 1)",
      },
    ],
  };

  if (data && typeof data === "object") {
    chartData.labels = Object.keys(data);
    chartData.datasets[0].data = Object.values(data).map(
      (month) => month.totalBirdCount
    );
  }

  return (
    <>
      {chartData.labels.length > 0 ? (
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
                      labelText += `: ${context.parsed.y}`;
                      const index = context.dataIndex;
                      const label = context.chart.data.labels[index];
                      const birdNames =
                        selectedYearData[label]?.birdNames || [];
                      labelText += ` (${birdNames.join(", ")})`;
                    }
                    return getTrimmedLabel(labelText, 100);
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
            animation: false,
          }}
        />
      ) : (
        <p>No data available</p>
      )}
    </>
  );
};

const ChartComponent = ({ data }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    data[0]?.year || currentYear
  );

  // Get the selected dataset based on the year
  const selectedDataset = data.find((item) => item.year === selectedYear);

  // Prepare the chart data
  const chartData = {
    labels: selectedDataset?.labels || [],
    datasets: [
      {
        label: "Different birds observed",
        data: selectedDataset?.data || [],
        backgroundColor: "rgba(19, 109, 102, 1)",
      },
    ],
  };

  return (
    <>
      {chartData.labels.length > 0 ? (
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
                      labelText += `: ${context.parsed.y}`;
                      const index = context.dataIndex;
                      const label = context.chart.data.labels[index];
                      const birdNames = selectedDataset.birdNames[label] || [];
                      if (birdNames.length > 0) {
                        labelText += ` (${birdNames.join(", ")})`;
                      }
                    }
                    return getTrimmedLabel(labelText, 100);
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
            animation: false,
          }}
        />
      ) : (
        <p>No data available</p>
      )}
    </>
  );
};

function Graphs() {
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

  const [monthSpeciesCounts, setMonthSpeciesCounts] = useState({});
  const [districtSpeciesCounts, setDistrictSpeciesCounts] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchMonthSpeciesCount = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/species-count-months`;

        const response = await axios.get(url);
        console.log("month species counts: ", response.data);
        setMonthSpeciesCounts(response.data);
      } catch (err) {
        setError("Failed to fetch species list. Please try again later.");
      }
    };
    fetchMonthSpeciesCount();
  }, []);

  const years = Object.keys(monthSpeciesCounts); // Get the available years from the data object
  const [selectedYear, setSelectedYear] = useState(years[0] || currentYear); // Set the initial selected year to the first year
  const [selectedYearData, setSelectedYearData] = useState(
    monthSpeciesCounts[selectedYear]
  );

  useEffect(() => {
    if (!selectedYearData) {
      setSelectedYearData(monthSpeciesCounts[selectedYear]);
    }
  }, [monthSpeciesCounts, selectedYear, selectedYearData]);

  // Handle year change
  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  useEffect(() => {
    const fetchDistrictSpeciesCount = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/district-species-count`;

        const response = await axios.get(url);
        console.log("district species counts: ", response.data);
        setDistrictSpeciesCounts(response.data);
      } catch (err) {
        setError("Failed to fetch species list. Please try again later.");
      }
    };
    fetchDistrictSpeciesCount();
  }, []);

  const [selectedType, setSelectedType] = useState("dzongkhag");
  const selectedResult = districtSpeciesCounts[selectedType + "Result"] || [];

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const [countsYearData, setCountsYearData] = useState({});
  const [selectedCountsYear, setSelectedCountsYear] = useState(
    countsYearData[0] || currentYear
  );
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchDistrictSpeciesCount = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/birds-count-year`;

        const response = await axios.get(url);
        console.log("district species counts: ", response.data);
        setCountsYearData(response.data);
      } catch (err) {
        setError("Failed to fetch species list. Please try again later.");
      }
    };
    fetchDistrictSpeciesCount();
  }, []);

  useEffect(() => {
    const createChartData = () => {
      if (selectedCountsYear && countsYearData[selectedCountsYear]) {
        const birdNames = countsYearData[selectedCountsYear].birdNames;
        const totalCounts = countsYearData[selectedCountsYear].totalCounts;

        const chartData = {
          labels: birdNames,
          datasets: [
            {
              label: selectedCountsYear,
              data: totalCounts,
              backgroundColor: "rgba(19, 109, 102, 1)",
            },
          ],
        };

        setChartData(chartData);
      } else {
        setChartData(null);
      }
    };

    createChartData();
  }, [selectedCountsYear, countsYearData]);

  const handleCountsYearChange = (e) => {
    setSelectedCountsYear(e.target.value);
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

  const getTrimmedLabel = (label, maxLength) => {
    if (label.length > maxLength) {
      return label.substring(0, maxLength) + "...";
    }
    return label;
  };

  const ExportMonthCSVButton = () => {
    // Sample data returned from the API
    const apiData = {
      2023: {
        June: {
          totalBirdCount: 5,
          birdNames: [
            "New bird - small bird",
            "Pallid Harrier",
            "Caspian Gull",
            "Taiwan Vivid Niltava",
            "New bird - Bull Bull",
          ],
        },
      },
    };

    // Extract the data from the API response
    const {
      2023: {
        June: { totalBirdCount, birdNames },
      },
    } = apiData;

    // Prepare the CSV data
    const csvData = [
      ["Year", "Month", "Total Bird Count", "Bird Names"],
      ["2023", "June", totalBirdCount.toString(), birdNames.join(", ")],
    ];

    return (
      <CSVLink data={csvData} filename="api_data.csv">
        Export CSV
      </CSVLink>
    );
  };

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
        <h2 className="total-header">No. of Species Observed</h2>
      </div>

      <div className="mainn-content">
        <div className="graphs-graphBox">
          <div className="box">
            <div className="grid-item">
              <h3>Months</h3>
              <span>
                <label htmlFor="year">Select Year: </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={handleChangeYear}
                  className="year-select"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {/* <ExportMonthCSVButton /> */}
              </span>
            </div>

            <div className="chart-wrapper">
              <div className="chart-container">
                {selectedYearData !== null ? (
                  <BirdChart
                    data={selectedYearData}
                    selectedYear={selectedYear}
                    handleChangeYear={handleChangeYear}
                    years={years}
                    selectedYearData={selectedYearData}
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
              <h3>Districts</h3>
              <span>
                <label htmlFor="year">Select Year:</label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="year-select"
                >
                  {selectedResult.map((item) => (
                    <option key={item.year} value={item.year}>
                      {item.year}
                    </option>
                  ))}
                </select>
                {"  "}
                <label htmlFor="type">Select Type:</label>
                <select
                  id="type"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="year-select"
                >
                  <option value="dzongkhag">Dzongkhag</option>
                  <option value="gewog">Gewog</option>
                  <option value="village">Village</option>
                </select>{" "}
              </span>
            </div>

            <div className="chart-wrapper">
              <div className="chart-container">
                {selectedResult !== null ? (
                  <ChartComponent
                    data={selectedResult}
                    handleYearChange={handleYearChange}
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

        <div className="explore-birds">
          <div className="section-header grid-item">
            <h3>
              Species
              <small
                style={{
                  fontSize: "12px",
                  marginLeft: "10px",
                  color: "gray",
                  fontWeight: "400",
                }}
              >
                No. of observations
              </small>
            </h3>

            <span>
              <label htmlFor="year">Select Year: </label>
              <select
                value={selectedCountsYear}
                onChange={handleCountsYearChange}
                className="year-select"
              >
                {Object.keys(countsYearData).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </span>
          </div>
          <div className="popularImg-section">
            {chartData ? (
              // <Bar
              //   data={chartData}
              //   options={{
              //     indexAxis: "y",
              //     scales: {
              //       x: {
              //         beginAtZero: true,
              //       },
              //     },
              //   }}
              // />

              <Bar
                data={chartData}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        beginAtZero: true,
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
                          // if (context.parsed.y !== null) {
                          //   labelText += `: ${context.parsed.y}`;
                          //   const index = context.dataIndex;
                          //   const label = context.chart.data.labels[index];
                          //   const birdNames =
                          //     selectedDataset[label]?.birdNames || [];
                          //   labelText += ` (${birdNames.join(", ")})`;
                          // }
                          // return labelText;
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
                  animation: false,
                }}
              />
            ) : (
              <p>No data available for the selected year.</p>
            )}
            <div className="popular-img">
              <img
                src={VerditerFlycatcher}
                className="b-img"
                style={{ visibility: "hidden" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Graphs;
