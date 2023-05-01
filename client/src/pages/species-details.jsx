import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { preview } from "../images";
import "../styles/speciesdetails.css";

function SpeciesDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [species, setSpecies] = useState(
    location.state?.speciesDetail || { photos: [] }
  );

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/species/${id}`
        );
        // const res = await axios.get(
        //   `${process.env.REACT_APP_API_URL}/api/v1/species/${id}`
        // );

        setSpecies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecies();
  }, [id]);

  // console.log(species.photos[0].caption);

  if (!species) {
    return <div>Loading...</div>;
  }

  return (
    <div className="species-details-container">
      <h2 className="species-details-header">
        <div>
          <Link to="/species">
            <span className="material-icons back-arrow">arrow_back_ios</span>
          </Link>
          Species Details
        </div>

        <Link to={`/species/${id}/edit`} state={{ speciesDetail: species }}>
          <button className="edit-button">Edit</button>
        </Link>
      </h2>
      <div className="species-images">
        <img
          className="species-image1"
          src={species.photos[0] ? species.photos[0].url : preview}
          alt="Speciesphoto1"
        />
        <div className="species-image-column">
          <img
            className="species-image"
            src={species.photos[1] ? species.photos[1].url : preview}
            alt="first"
          />
          <img
            className="species-image-more"
            src={species.photos[2] ? species.photos[2].url : preview}
            alt="second"
          />
        </div>
        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d113271.23452452681!2d89.64648174999999!3d27.477785949999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbt!4v1682098982303!5m2!1sen!2sbt"
            className="location"
            title="location-frame"
          ></iframe>
        </div>
      </div>
      <div className="species-text">Species</div>
      <div className="species-name">
        <span style={{ fontWeight: "bold" }}>{species.englishName}</span>
      </div>
      <div className="species-location">
        <span className="material-icons">location_on</span>Thrumshingla, Mongar
      </div>

      <div className="species-des">Scientific Name:</div>
      <div className="species-des-para">{species.scientificName}</div>

      <div className="species-des">Order:</div>
      <div className="species-des-para">{species.order}</div>

      <div className="species-des">Family Name:</div>
      <div className="species-des-para">{species.familyName}</div>

      <div className="species-des">Genus:</div>
      <div className="species-des-para">{species.genus}</div>

      <div className="species-des">Species:</div>
      <div className="species-des-para">{species.species}</div>

      <div className="species-des">Authority:</div>
      <div className="species-des-para">{species.authority}</div>

      <div className="species-des">Group:</div>
      <div className="species-des-para">{species.group}</div>

      <div className="species-des">Dzongkha Name:</div>
      <div className="species-des-para">{species.dzongkhaName}</div>

      <div className="species-des">Lho Name:</div>
      <div className="species-des-para">{species.lhoName}</div>

      <div className="species-des">Shar Name:</div>
      <div className="species-des-para">{species.sharName}</div>

      <div className="species-des">Kheng Name:</div>
      <div className="species-des-para">{species.khengName}</div>

      <div className="species-des">IUCN Status:</div>
      <div className="species-des-para">{species.iucnStatus}</div>

      <div className="species-des">Legislation:</div>
      <div className="species-des-para">{species.legislation}</div>

      <div className="species-des">Migratory/Non-migratory:</div>
      <div className="species-des-para">{species.migrationStatus}</div>

      <div className="species-des">Landbird/Waterbird/Seabird:</div>
      <div className="species-des-para">{species.birdType}</div>

      <div className="species-stats">Stats:</div>
      <div className="species-stats-obs">300 Observations</div>

      <div className="species-des">Description:</div>
      <div className="species-des-para">{species.description}</div>
      {/* 
      {species.photos &&
        species.photos.map((p) => (
          <div key={p._id} style={{ display: "flex" }}>
            <div>
              <img
                src={p.url}
                alt={p.englishName}
                style={{
                  width: "200px",
                }}
              />
            </div>
          </div>
        ))} */}
    </div>
  );
}

export default SpeciesDetails;

// import React, { useState, useEffect } from "react";
// import { Link, useParams, useLocation } from "react-router-dom";
// import axios from "axios";

// function SpeciesDetails() {
//   const { id } = useParams();
//   const location = useLocation();

//   const [species, setSpecies] = useState(
//     location.state?.speciesDetail || { photos: [] }
//   );

//   useEffect(() => {
//     const fetchSpecies = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:8080/api/v1/species/${id}`
//         );
//         setSpecies(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSpecies();
//   }, [id]);

//   // console.log(species.photos[0].caption);

//   if (!species) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Link to={`/species/${id}/edit`} state={{ speciesDetail: species }}>
//         <button className="add-button">Edit Species</button>
//       </Link>
//       <Link to="/species" className="add-button">
//         Back to List
//       </Link>

//       <h1>{species.englishName}</h1>
//       <p>
//         <strong>Scientific Name:</strong> {species.scientificName}
//       </p>
//       <p>
//         <strong>Order:</strong> {species.order}
//       </p>
//       <p>
//         <strong>Family Name:</strong> {species.familyName}
//       </p>
//       <p>
//         <strong>Genus:</strong> {species.genus}
//       </p>
//       <p>
//         <strong>Species:</strong> {species.species}
//       </p>
//       <p>
//         <strong>Authority:</strong> {species.authority}
//       </p>
//       <p>
//         <strong>Group:</strong> {species.group}
//       </p>
//       <p>
//         <strong>Dzongkha Name:</strong> {species.dzongkhaName}
//       </p>
//       <p>
//         <strong>Lho Name:</strong> {species.lhoName}
//       </p>
//       <p>
//         <strong>Shar Name:</strong> {species.sharName}
//       </p>
//       <p>
//         <strong>Kheng Name:</strong> {species.khengName}
//       </p>
//       <p>
//         <strong>IUCN Status:</strong> {species.iucnStatus}
//       </p>
//       <p>
//         <strong>Legislation:</strong> {species.legislation}
//       </p>
//       <p>
//         <strong>Migration Status:</strong> {species.migrationStatus}
//       </p>
//       <p>
//         <strong>Bird Type:</strong> {species.birdType}
//       </p>
//       <p>
//         <strong>Description:</strong> {species.description}
//       </p>
//       <p>
//         <strong>Observations:</strong> {species.observations}
//       </p>

//       {species.photos &&
//         species.photos.map((p) => (
//           <div key={p._id} style={{ display: "flex" }}>
//             <div>
//               <img
//                 src={p.url}
//                 alt={p.englishName}
//                 style={{
//                   width: "200px",
//                 }}
//               />
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// }

// export default SpeciesDetails;

// import React, { useState, useEffect } from "react";
// import { Link, useParams, useLocation } from "react-router-dom";
// import axios from "axios";

// function SpeciesDetail() {
//   const { id } = useParams();
//   const location = useLocation();

//   const [species, setSpecies] = useState(location.state?.speciesDetail);
//   const [isLoading, setIsLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchSpecies = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:8080/api/v1/species/${id}`
//         );
//         setSpecies(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSpecies();
//   }, [id]);

//   // console.log(species.photos[0].caption);

//   const handleDeleteClick = async (photoId) => {
//     setIsLoading(true);

//     try {
//       const res = await axios.delete(
//         `http://localhost:8080/api/v1/species/${id}/photos/${photoId}`
//       );

//       setMsg(res.data.message);
//       console.log(res);
//       setError("");
//     } catch (error) {
//       console.error(error);
//       setError("Server error!");
//     }

//     setIsLoading(false);
//   };

//   if (!species) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Link to={`/species/${id}/edit`} state={{ speciesDetail: species }}>
//         <button className="add-button">Edit Species</button>
//       </Link>
//       <Link to="/species" className="add-button">
//         Back to List
//       </Link>

//       <h1>{species.englishName}</h1>
//       <p>
//         <strong>Scientific Name:</strong> {species.scientificName}
//       </p>
//       <p>
//         <strong>Order:</strong> {species.order}
//       </p>
//       <p>
//         <strong>Family Name:</strong> {species.familyName}
//       </p>
//       <p>
//         <strong>Genus:</strong> {species.genus}
//       </p>
//       <p>
//         <strong>Species:</strong> {species.species}
//       </p>
//       <p>
//         <strong>Authority:</strong> {species.authority}
//       </p>
//       <p>
//         <strong>Group:</strong> {species.group}
//       </p>
//       <p>
//         <strong>Dzongkha Name:</strong> {species.dzongkhaName}
//       </p>
//       <p>
//         <strong>Lho Name:</strong> {species.lhoName}
//       </p>
//       <p>
//         <strong>Shar Name:</strong> {species.sharName}
//       </p>
//       <p>
//         <strong>Kheng Name:</strong> {species.khengName}
//       </p>
//       <p>
//         <strong>IUCN Status:</strong> {species.iucnStatus}
//       </p>
//       <p>
//         <strong>Legislation:</strong> {species.legislation}
//       </p>
//       <p>
//         <strong>Migration Status:</strong> {species.migrationStatus}
//       </p>
//       <p>
//         <strong>Bird Type:</strong> {species.birdType}
//       </p>
//       <p>
//         <strong>Description:</strong> {species.description}
//       </p>
//       <p>
//         <strong>Observations:</strong> {species.observations}
//       </p>
//       {error && <div className="error_msg">{error}</div>}
//       {msg && <div className="success_msg">{msg}</div>}
//       {species.photos.map((p) => (
//         <div key={p._id} style={{ display: "flex" }}>
//           <div>
//             <img
//               src={p.url}
//               alt={p.caption}
//               style={{
//                 width: "200px",
//               }}
//             />
//             <p>{p.caption}</p>

//             <div className="button-container">
//               <button
//                 disabled={isLoading}
//                 onClick={() => handleDeleteClick(p._id)}
//               >
//                 Delete Photo
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default SpeciesDetail;
