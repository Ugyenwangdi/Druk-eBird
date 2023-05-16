import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/addspecies.css";

function AddSpecies() {
  const [form, setForm] = useState({
    englishName: "",
    scientificName: "",
    order: "",
    familyName: "",
    genus: "",
    species: "",
    authority: "",
    group: "",
    dzongkhaName: "",
    lhoName: "",
    sharName: "",
    khengName: "",
    iucnStatus: "",
    citesAppendix: "",
    bhutanSchedule: "",
    residency: "",
    habitat: "",
    description: "",
    observations: 0,
    photos: [],
  });
  const [file, setFile] = useState(null);
  const [speciesImg, setSpeciesImg] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  // console.log(speciesImg);

  const handleChange = (event) => {
    setMsg("");
    setError("");
    if (event.target.name === "photo") {
      const file = event.target.files[0];
      TransformImgFileData(file);
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const TransformImgFileData = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSpeciesImg(reader.result);
      };
    } else {
      setSpeciesImg("");
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
        `${process.env.REACT_APP_API_URL}/api/v1/species`,
        {
          ...form,
          photos: [speciesImg],
        }
      ); // post data to server

      setForm({
        englishName: "",
        scientificName: "",
        order: "",
        familyName: "",
        genus: "",
        species: "",
        authority: "",
        group: "",
        dzongkhaName: "",
        lhoName: "",
        sharName: "",
        khengName: "",
        iucnStatus: "",
        citesAppendix: "",
        bhutanSchedule: "",
        residency: "",
        habitat: "",
        description: "",
        observations: 0,
        photos: [],
      }); // reset form
      setSpeciesImg("");
      document.getElementById("photo").value = "";

      setMsg(res.data.message);
      console.log(res.data.message);
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
      // const response = await axios.post(
      //   "http://localhost:8080/api/v1/species/fileupload",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      // Deployed
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/species/fileupload`,
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
          <img src={speciesImg} alt="Species" />
        </div>
      )}

      <div className="species-header">
        <Link to="/species">
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
            <div>English Name</div>
            <input
              type="text"
              name="englishName"
              value={form.englishName}
              onChange={handleChange}
              placeholder="Enter English Name"
              required
            />

            <div>Order</div>
            <input
              type="text"
              name="order"
              value={form.order}
              onChange={handleChange}
              placeholder="Enter Order"
            />

            <div>Genus</div>
            <input
              type="text"
              name="genus"
              value={form.genus}
              onChange={handleChange}
              placeholder="Enter Genus"
            />

            <div>Authority</div>
            <input
              type="text"
              name="authority"
              value={form.authority}
              onChange={handleChange}
              placeholder="Enter Authority"
            />

            <div>Dzongkha Name</div>
            <input
              type="text"
              name="dzongkhaName"
              value={form.dzongkhaName}
              onChange={handleChange}
              placeholder="Enter Dzongkha Name"
            />

            <div>Shar Name</div>
            <input
              type="text"
              name="sharName"
              value={form.sharName}
              onChange={handleChange}
              placeholder="Enter Shar Name"
            />

            <div>IUCN Status</div>
            <input
              type="text"
              name="iucnStatus"
              value={form.iucnStatus}
              onChange={handleChange}
              placeholder="Enter IUCN Status"
            />

            <div>Bhutan Schedule</div>
            <input
              type="text"
              name="bhutanSchedule"
              value={form.bhutanSchedule}
              onChange={handleChange}
              placeholder="Bhutan Schedule"
            />

            <div>Habitat</div>
            <input
              type="text"
              name="habitat"
              value={form.habitat}
              onChange={handleChange}
              placeholder="Habitat"
            />

            <div>Species Description</div>
            <input
              className="description"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter Species Description"
            />
          </div>
          <div className="column3">
            <div>Scientific Name</div>

            <input
              type="text"
              name="scientificName"
              value={form.scientificName}
              onChange={handleChange}
              placeholder="Enter Scientific Name"
            />

            <div>Family Name</div>
            <input
              type="text"
              name="familyName"
              value={form.familyName}
              onChange={handleChange}
              placeholder="Enter Family Name"
            />

            <div>Species</div>
            <input
              type="text"
              name="species"
              value={form.species}
              onChange={handleChange}
              placeholder="Enter Species"
            />
            <div>Group</div>
            <input
              type="text"
              name="group"
              value={form.group}
              onChange={handleChange}
              placeholder="Enter Group"
            />

            <div>Lho Name</div>
            <input
              type="text"
              name="lhoName"
              value={form.lhoName}
              onChange={handleChange}
              placeholder="Enter Lho Name"
            />

            <div>Kheng Name</div>
            <input
              type="text"
              name="khengName"
              value={form.khengName}
              onChange={handleChange}
              placeholder="Enter Kheng Name"
            />

            <div>Cites Appendix</div>
            <input
              type="text"
              name="citesAppendix"
              value={form.citesAppendix}
              onChange={handleChange}
              placeholder="Enter cites appendix"
            />

            <div>Residency</div>
            <input
              type="text"
              name="residency"
              value={form.residency}
              onChange={handleChange}
              placeholder="Enter residency"
            />

            <div>No. of Observation</div>
            <div className="number-input">
              <input
                min="0"
                name="observations"
                value={form.observations}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>
        </div>
        <div className="speciescontainer">
          <div className="column1">2. Media</div>
          <div className="column2">
            <div>Image</div>
            <input
              className="select-photo"
              id="photo"
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
            <Link to="/species">
              <button className="cancle-button">Cancel</button>
            </Link>
            <button className="addnew-button" type="submit">
              Add Species
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
          {speciesImg ? (
            <>
              <img
                src={speciesImg}
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
          <div>Upload Excel File</div>
          <form onSubmit={handleFileSubmit}>
            <input
              className="select-file"
              type="file"
              id="file"
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

export { AddSpecies };
