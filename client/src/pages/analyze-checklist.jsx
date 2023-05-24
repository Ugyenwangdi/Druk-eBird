import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "../styles/addspecies.css";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnalyzeChecklist() {
  const [file, setFile] = useState(null);
  const [checklistResult, setChecklistResult] = useState({});
  const [birders, setBirders] = useState([]);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [checklists, setChecklists] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [currentMonthCount, setCurrentMonthCount] = useState(0);
  const [previousMonthCount, setPreviousMonthCount] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists`
      );
      console.log("response: ", response);

      setChecklists(Object.values(response.data.checklists));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch the updated statistics every 5 seconds

    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
    };
  }, []);

  useEffect(() => {
    prepareChartData();
  }, [checklists]);

  // Perform real-time analysis and prepare data for charts
  const analyzeChecklists = () => {
    // Calculate the number of checklists submitted in the current month
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
    const currentYear = new Date().getFullYear();
    const currentMonthChecklists = checklists.filter(
      (checklist) =>
        new Date(checklist.selectedDate).getMonth() + 1 === currentMonth &&
        new Date(checklist.selectedDate).getFullYear() === currentYear
    );

    // Calculate the number of checklists submitted in the previous month
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1; // Get previous month (1-12)
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const previousMonthChecklists = checklists.filter(
      (checklist) =>
        new Date(checklist.selectedDate).getMonth() + 1 === previousMonth &&
        new Date(checklist.selectedDate).getFullYear() === previousYear
    );

    // Calculate the percentage increase or decrease in checklist submissions
    const currentMonthCount = currentMonthChecklists.length;
    const previousMonthCount = previousMonthChecklists.length;
    const percentageChange =
      currentMonthCount !== 0 && previousMonthCount !== 0
        ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
        : 0;

    setCurrentMonthCount(currentMonthCount);
    setPreviousMonthCount(previousMonthCount);
    setPercentageChange(percentageChange);

    console.log("Current Month Checklists:", currentMonthCount);
    console.log("Previous Month Checklists:", previousMonthCount);
    console.log("Percentage Change:", percentageChange);
  };

  useEffect(() => {
    analyzeChecklists();
  }, [checklists]);

  const prepareChartData = () => {
    if (!checklists.length) {
      return;
    }

    const groupedData = checklists.reduce((acc, checklist) => {
      const endpointLocation = checklist.endpointLocation.split(",")[0].trim();

      if (!acc[endpointLocation]) {
        acc[endpointLocation] = 0;
      }

      acc[endpointLocation]++;

      return acc;
    }, {});

    const sortedData = Object.entries(groupedData).sort((a, b) => b[1] - a[1]); // Sort the data based on the count in descending order

    const labels = sortedData.map((entry) => entry[0]);
    const data = sortedData.map((entry) => entry[1]);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Number of Checklists",
          data: data,
          backgroundColor: "rgba(19, 109, 102, 1)",
        },
      ],
    };

    setChartData(chartData);
  };

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

        <div className="chart-container">
          <h2>Checklist Chart</h2>
          {chartData ? (
            <Bar
              data={chartData}
              options={{
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
                          labelText += ": " + context.parsed.y + " checklists";
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
            <p>Loading chart data...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { AnalyzeChecklist };
