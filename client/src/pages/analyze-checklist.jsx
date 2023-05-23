import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/addspecies.css";

function AnalyzeChecklist() {
  const [file, setFile] = useState(null);
  const [checklistResult, setChecklistResult] = useState({});
  const [birders, setBirders] = useState([]);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Deployed
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
        <Link to="/species">
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
    </div>
  );
}

export { AnalyzeChecklist };
