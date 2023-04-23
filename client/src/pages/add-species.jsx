// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// import axios from "axios";

// function AddSpecies() {
//   const [form, setForm] = useState({
//     englishName: "",
//     scientificName: "",
//     order: "",
//     familyName: "",
//     genus: "",
//     species: "",
//     authority: "",
//     group: "",
//     dzongkhaName: "",
//     lhoName: "",
//     sharName: "",
//     khengName: "",
//     iucnStatus: "",
//     legislation: "",
//     migrationStatus: "",
//     birdType: "",
//     description: "",
//     observations: 0,
//     photos: [],
//   });
//   const [file, setFile] = useState(null);
//   const [speciesImg, setSpeciesImg] = useState("");
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   // console.log(speciesImg);

//   const handleChange = (event) => {
//     setMsg("");
//     setError("");
//     if (event.target.name === "photo") {
//       const file = event.target.files[0];
//       TransformImgFileData(file);
//     } else {
//       setForm({ ...form, [event.target.name]: event.target.value });
//     }
//   };

//   const TransformImgFileData = (file) => {
//     const reader = new FileReader();
//     if (file) {
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         setSpeciesImg(reader.result);
//       };
//     } else {
//       setSpeciesImg("");
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       setLoading(true);
//       const res = await axios.post("http://localhost:8080/api/v1/species", {
//         ...form,
//         photos: [speciesImg],
//       }); // post data to server
//       setForm({
//         englishName: "",
//         scientificName: "",
//         order: "",
//         familyName: "",
//         genus: "",
//         species: "",
//         authority: "",
//         group: "",
//         dzongkhaName: "",
//         lhoName: "",
//         sharName: "",
//         khengName: "",
//         iucnStatus: "",
//         legislation: "",
//         migrationStatus: "",
//         birdType: "",
//         description: "",
//         observations: 0,
//         photos: [],
//       }); // reset form
//       setSpeciesImg("");
//       setMsg(res.data.message);
//       console.log(res.data.message);
//     } catch (err) {
//       setError("Server error! Problem adding species");
//     } finally {
//       setLoading(false); // set loading to false once user object is available or error occurs
//     }
//   };

//   const handleFileChange = (e) => {
//     setMsg("");
//     setError("");
//     setFile(e.target.files[0]);
//   };

//   const handleFileSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/v1/species/fileupload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setMsg(`Uploaded ${response.data.length} species`);
//     } catch (error) {
//       console.log(error);
//       setError(error.message);
//     }
//   };

//   return (
//     <div>
//       <div style={{ display: "flex" }}>
//         <Link to="/species">
//           <span className="material-icons">arrow_back_ios</span>
//         </Link>
//         <h1>Add New Species</h1>
//       </div>
//       <br></br>
//       <br></br>

//       <div>
//         <h2>Upload Excel File</h2>
//         <form onSubmit={handleFileSubmit}>
//           <input type="file" onChange={handleFileChange} />
//           <button type="submit" disabled={!file}>
//             Submit
//           </button>
//         </form>
//       </div>
//       {error && <div className="error_msg">{error}</div>}
//       {msg && <div className="success_msg">{msg}</div>}
//       <br></br>
//       <br></br>
//       <br></br>

//       <form onSubmit={handleSubmit}>
//         <label>
//           English Name:
//           <input
//             type="text"
//             name="englishName"
//             value={form.englishName}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Scientific Name:
//           <input
//             type="text"
//             name="scientificName"
//             value={form.scientificName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Order:
//           <input
//             type="text"
//             name="order"
//             value={form.order}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Family Name:
//           <input
//             type="text"
//             name="familyName"
//             value={form.familyName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Genus:
//           <input
//             type="text"
//             name="genus"
//             value={form.genus}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Species:
//           <input
//             type="text"
//             name="species"
//             value={form.species}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Authority:
//           <input
//             type="text"
//             name="authority"
//             value={form.authority}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Group:
//           <input
//             type="text"
//             name="group"
//             value={form.group}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Dzongkha Name:
//           <input
//             type="text"
//             name="dzongkhaName"
//             value={form.dzongkhaName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Lho Name:
//           <input
//             type="text"
//             name="lhoName"
//             value={form.lhoName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Shar Name:
//           <input
//             type="text"
//             name="sharName"
//             value={form.sharName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Kheng Name:
//           <input
//             type="text"
//             name="khengName"
//             value={form.khengName}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           IUCN Status:
//           <input
//             type="text"
//             name="iucnStatus"
//             value={form.iucnStatus}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Legislation:
//           <input
//             type="text"
//             name="legislation"
//             value={form.legislation}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Migration Status:
//           <select name="migrationStatus" onChange={handleChange}>
//             <option value="">Select status</option>
//             <option value="Migratory">Migratory</option>
//             <option value="Non-migratory">Non Migratory</option>
//           </select>
//         </label>

//         <br></br>
//         <br></br>
//         <label>
//           Waterbird/Landbird/Seabird:
//           <select name="birdType" onChange={handleChange}>
//             <option value="">Select type</option>
//             <option value="Waterbird">Waterbird</option>
//             <option value="Landbird">Landbird</option>
//             <option value="Seabird">Seabird</option>
//           </select>
//         </label>
//         <br></br>
//         <br></br>
//         <label>
//           Description:
//           <input
//             type="text"
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Observations:
//           <input
//             type="text"
//             name="observations"
//             value={form.observations}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Photo:
//           <input
//             name="photo"
//             accept="image/*"
//             type="file"
//             onChange={handleChange}
//           />
//         </label>

//         <button type="submit">Submit</button>
//       </form>
//       <br></br>
//       <br></br>
//       {loading && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             fontSize: "18px",
//           }}
//         >
//           <p>Loading....</p>
//         </div>
//       )}

//       <br></br>
//       <br></br>
//       <div>
//         Image Preview:
//         {speciesImg ? (
//           <>
//             <img src={speciesImg} alt="Species" />
//           </>
//         ) : (
//           <p>Product image upload preview will appear here!</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AddSpecies;

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
    legislation: "",
    migrationStatus: "",
    birdType: "",
    description: "",
    observations: 0,
    photos: [],
  });
  const [file, setFile] = useState(null);
  const [speciesImg, setSpeciesImg] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      const res = await axios.post("http://localhost:8080/api/v1/species", {
        ...form,
        photos: [speciesImg],
      }); // post data to server
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
        legislation: "",
        migrationStatus: "",
        birdType: "",
        description: "",
        observations: 0,
        photos: [],
      }); // reset form
      setSpeciesImg("");
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
      const response = await axios.post(
        "http://localhost:8080/api/v1/species/fileupload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMsg(`Uploaded ${response.data.length} species`);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="add-species-container">
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

            <div>Migratory/Non-migratory</div>
            {/* <input type="text" placeholder="Enter Migratory/Non-migratory" /> */}
            <select
              className="select-status"
              name="migrationStatus"
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="Migratory">Migratory</option>
              <option value="Non-migratory">Non Migratory</option>
            </select>

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

            <div>Legislation</div>
            <input
              type="text"
              name="legislation"
              value={form.legislation}
              onChange={handleChange}
              placeholder="Enter Legislation"
            />

            <div>Waterbird/Landbird/Seabird</div>
            {/* <input type="text" placeholder="Enter Waterbird/Landbird/Seabird" /> */}
            <select
              className="select-status"
              name="birdType"
              onChange={handleChange}
            >
              <option className="select-status-item" value="">
                Select type
              </option>
              <option className="select-status-item" value="Waterbird">
                Waterbird
              </option>
              <option className="select-status-item" value="Landbird">
                Landbird
              </option>
              <option className="select-status-item" value="Seabird">
                Seabird
              </option>
            </select>

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
              <img src={speciesImg} alt="Species" style={{ width: "400px" }} />
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
