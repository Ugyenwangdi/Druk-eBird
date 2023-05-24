import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/addspecies.css";

function AddChecklist() {
  const token = localStorage.getItem("token");

  const [checklistData, setChecklistData] = useState({
    checklistName: "My Checklist 2",
    birdName: "Bird Name 2",
    count: {
      adult: 2,
      juvenile: 3,
      total: 5,
    },
    selectedDate: "2023-05-21",
    selectedTime: "10:00 AM",
    currentLocation: {
      latitude: "123.456",
      longitude: "789.012",
    },
    birder: "John Doe 2",
    endpointLocation: "Mongar, Gyalpozhing, chiwog",
    photos: [],
  });

  const [file, setFile] = useState(null);
  const [birdImg, setBirdImg] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleChange = (e) => {
    setMsg("");
    setError("");
    const { name, value } = e.target;

    if (e.target.name === "photo") {
      const file = e.target.files[0];
      TransformImgFileData(file);
    } else {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setChecklistData((prevData) => ({
          ...prevData,
          [parent]: {
            ...prevData[parent],
            [child]: value,
          },
        }));
      } else {
        setChecklistData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const TransformImgFileData = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBirdImg(reader.result);
      };
    } else {
      setBirdImg("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      // Localhost
      // const res = await axios.post("http://localhost:8080/api/v1/species", {
      //   ...form,
      //   photos: [speciesImg],
      // }); // post data to server

      // // Deployed
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists`,
        {
          ...checklistData,
          photos: [birdImg],
        }
      ); // post data to server
      console.log("res:", res.data.message);
      setMsg(res.data.message);
      setError("");

      setChecklistData({
        checklistName: "My Checklist 2",
        birdName: "Bird Name 2",
        count: {
          adult: 2,
          juvenile: 3,
          total: 5,
        },
        selectedDate: "2023-05-21",
        selectedTime: "10:00 AM",
        currentLocation: {
          latitude: "123.456",
          longitude: "789.012",
        },
        birder: "John Doe 2",
        endpointLocation: "Mongar, Kengkhar, chiwog",
        photos: [],
      }); // reset form
      setBirdImg("");
    } catch (err) {
      setError("Server error! Problem adding species");
    } finally {
      setLoading(false); // set loading to false once user object is available or error occurs
    }
  };

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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists/fileupload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMsg(`Uploaded ${response.data.data.length} species`);
      setFile(null);
      document.getElementById("file").value = "";
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  return (
    <div className="add-species-container">
      {showFullscreen && (
        <div className="fullscreen-container">
          <button className="close-button" onClick={toggleFullscreen}>
            <span className="material-icons">close</span>
          </button>
          <img src={birdImg} alt="Species" />
        </div>
      )}

      <div className="species-header">
        <Link to="/checklist">
          <span className="material-icons back-arrow">arrow_back_ios</span>
        </Link>
        <h2>Add Species</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="speciescontainer">
          <div className="column1">
            <b>1. General Info</b>
          </div>
          <div className="column2">
            <div>Checklist Name</div>
            <input
              type="text"
              name="checklistName"
              value={checklistData.checklistName}
              onChange={handleChange}
              placeholder="Checklist Name"
              required
            />

            <div>Bird Name</div>
            <input
              type="text"
              name="birdName"
              value={checklistData.birdName}
              onChange={handleChange}
              placeholder="Enter Bird Name"
            />

            <div>Selected Date</div>
            <input
              type="text"
              name="selectedDate"
              value={checklistData.selectedDate}
              onChange={handleChange}
              placeholder="Enter selected Date"
            />

            <div>Selected Time</div>
            <input
              type="text"
              name="selectedTime"
              value={checklistData.selectedTime}
              onChange={handleChange}
              placeholder="Enter selected Time"
            />

            <div>Birder</div>
            <input
              type="text"
              name="birder"
              value={checklistData.birder}
              onChange={handleChange}
              placeholder="Enter Birder name"
            />

            <div>Endpoint location</div>
            <input
              type="text"
              name="endpointLocation"
              value={checklistData.endpointLocation}
              onChange={handleChange}
              placeholder="Enter endpoint location"
            />
          </div>
          <div className="column3">
            <div>Adult count</div>
            <input
              type="number"
              name="count.adult"
              value={checklistData.count.adult}
              onChange={handleChange}
              placeholder="Adult Count"
            />

            <div>Juvenile count</div>
            <input
              type="number"
              name="count.juvenile"
              value={checklistData.count.juvenile}
              onChange={handleChange}
              placeholder="Juvenile Count"
            />

            <div>Total count</div>
            <input
              type="number"
              name="count.total"
              value={checklistData.count.total}
              onChange={handleChange}
              placeholder="Total Count"
            />

            <div>Current location latitude</div>
            <input
              type="text"
              name="currentLocation.latitude"
              value={checklistData.currentLocation.latitude}
              onChange={handleChange}
              placeholder="Latitude"
            />

            <div>Current location longitude</div>
            <input
              type="text"
              name="currentLocation.longitude"
              value={checklistData.currentLocation.longitude}
              onChange={handleChange}
              placeholder="Longitude"
            />
          </div>
        </div>
        <div className="speciescontainer">
          <div className="column1">2. Media</div>
          <div className="column2">
            <div>Image</div>
            <input
              className="select-photo"
              name="photo"
              accept="image/*"
              type="file"
              onChange={handleChange}
            />
          </div>
          <div className="column3"></div>
        </div>
        <div className="speciesbuttoncontainer">
          <div className="button-container-addspecies">
            <Link to="/checklist">
              <button className="cancle-button">Cancel</button>
            </Link>
            <button className="addnew-button" type="submit">
              Add checklist
            </button>
          </div>
        </div>
      </form>

      <div className="previewcontainer">
        {error && <div className="error_msg">{error}</div>}
        {msg && <div className="success_msg">{msg}</div>}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            <p>Loading....</p>
          </div>
        )}

        <div className="imgpreview">
          <div>Image Preview:</div>
          {birdImg ? (
            <>
              <img
                src={birdImg}
                alt="Species"
                style={{ width: "400px", cursor: "pointer" }}
                onClick={toggleFullscreen}
              />
            </>
          ) : (
            <p>Product image upload preview will appear here!</p>
          )}
        </div>

        <span>OR</span>

        <div className="file-upload-container">
          <div>Upload Excel File (*.xlsx)</div>
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
              disabled={!file}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export { AddChecklist };
