import React, { useState, useEffect } from "react";
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

import "../styles/addspecies.css";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnalyzeChecklist() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = getMonthName(currentDate.getMonth() + 1);

  const [file, setFile] = useState(null);
  const [checklistResult, setChecklistResult] = useState([]);
  const [birders, setBirders] = useState([]);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [checklists, setChecklists] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [currentMonthCount, setCurrentMonthCount] = useState(0);
  const [previousMonthCount, setPreviousMonthCount] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists`
      );
      // console.log("response: ", response);

      setChecklists(Object.values(response.data.checklists));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Fetch the updated statistics every 10 seconds

    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
    };
  }, []);

  useEffect(() => {
    prepareChartData();
  }, [checklists, selectedYear, selectedMonth]);

  console.log(years);

  const prepareChartData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze/district-checklists`
    );

    const responseData = await response.json();
    console.log("district checklists: ", responseData);

    if (!response.ok) {
      setError(response.message);
    }
    const { changeResult, result, overallTotalCount } = responseData;

    setCurrentMonthCount(changeResult.currentMonthCount);
    setPreviousMonthCount(changeResult.previousMonthCount);
    setPercentageChange(changeResult.percentageChange);
    setChecklistResult(result);

    // Filter the result data based on the selected year and month
    const filteredData = result.filter(
      (data) => data.year === selectedYear && data.month === selectedMonth
    );

    console.log("filteredData: ", filteredData);
    console.log("selectedYear: ", selectedYear);
    console.log("selectedMonth: ", selectedMonth);
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
            label: `Number of Checklists: ${filteredData[0].year} (year), month: ${filteredData[0].month} (month)`,
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

  // const prepareChartData = () => {
  //   if (!checklists.length) {
  //     return;
  //   }

  //   const dzongkhags = [
  //     "Thimphu",
  //     "Paro",
  //     "Punakha",
  //     "Wangdue Phodrang",
  //     "Trongsa",
  //     "Bumthang",
  //     "Lhuentse",
  //     "Mongar",
  //     "Trashigang",
  //     "Trashiyangtse",
  //     "Samdrup Jongkhar",
  //     "Pemagatshel",
  //     "Zhemgang",
  //     "Sarpang",
  //     "Tsirang",
  //     "Dagana",
  //     "Chukha",
  //     "Haa",
  //     "Gasa",
  //     "Samtse",
  //   ];

  //   const groupedData = checklists.reduce((acc, checklist) => {
  //     const endpointLocation = checklist.endpointLocation.split(",")[0].trim();

  //     if (!dzongkhags.includes(endpointLocation)) {
  //       return acc; // Skip if endpointLocation is not in dzongkhags
  //     }

  //     if (!acc[endpointLocation]) {
  //       acc[endpointLocation] = 0;
  //     }

  //     acc[endpointLocation]++;

  //     return acc;
  //   }, {});

  //   const sortedData = Object.entries(groupedData).sort((a, b) => b[1] - a[1]); // Sort the data based on the count in descending order

  //   const labels = sortedData.map((entry) => entry[0]);
  //   const data = sortedData.map((entry) => entry[1]);

  //   const chartData = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: "Number of Checklists",
  //         data: data,
  //         backgroundColor: "rgba(19, 109, 102, 1)",
  //       },
  //     ],
  //   };

  //   setChartData(chartData);
  // };

  const handleFileChange = (e) => {
    setMsg("");
    setError("");
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);

      console.log(formData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      setChecklistResult(response.data);
      setBirders(response.data.topBirders);

      setMsg(`Uploaded file!`);
      setFile(null);
      document.getElementById("file").value = "";
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-species-container">
      <div className="species-header">
        <Link to="/checklist">
          <span className="material-icons back-arrow">arrow_back_ios</span>
        </Link>
        <h2>Checklist Analysis</h2>
      </div>

      <div className="previewcontainer">
        {error && <div className="error_msg">{error}</div>}
        {msg && <div className="success_msg">{msg}</div>}

        <div className="file-upload-container">
          <div>Upload checklist data (*.xlsx)</div>
          <form onSubmit={handleFileSubmit}>
            <input
              className="select-file"
              type="file"
              id="file"
              accept=".xlsx"
              onChange={handleFileChange}
            />
            <button
              className={file ? "addnew-button" : "addnew-button-disabled"}
              type="submit"
              disabled={loading}
            >
              Submit
            </button>
          </form>

          <div style={{ padding: "20px", textAlign: "left" }}>
            <h3>Top birder: </h3>
            <ul>
              {birders.map((birder) => (
                <li key={birder.name}>
                  {birder.name} - {birder.checklistCount} checklists
                </li>
              ))}
            </ul>

            <h3>
              Highest birds location: {checklistResult.highestBirdsLocation}
            </h3>
          </div>
        </div>
      </div>

      <div>
        <div>
          <h2>Checklist Submissions</h2>
          <p>Total Checklists: {checklists.length}</p>
        </div>
        <div>
          <h2>Checklist Comparison</h2>
          <p>Current Month Count: {currentMonthCount}</p>
          <p>Previous Month Count: {previousMonthCount}</p>
          <p>Change: {percentageChange}% from prvious month</p>
        </div>

        <div>
          <label htmlFor="year">Select Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="month">Select Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
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
  );
}

export { AnalyzeChecklist };
