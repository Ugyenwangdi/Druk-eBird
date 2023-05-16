// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// import {
//   Search,
//   SpeciesListComponent,
//   Pagination,
//   Orders,
// } from "../components";
// import "../styles/species.css";

// function Species() {
//   const [speciesList, setSpeciesList] = useState([]);
//   const [obj, setObj] = useState({});
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const [speciesCount, setSpeciesCount] = useState(0);
//   const [filterOrder, setFilterOrder] = useState([]);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");


//   useEffect(() => {
//     const fetchSpeciesList = async () => {
//       try {
//         const url = `http://localhost:8080/api/v1/species?page=${page}&order=${filterOrder.toString()}&search=${search}`;
//         // console.log("url: ", url);
//         const { data } = await axios.get(url);

//         setSpeciesCount(data.speciesTotal);
//         setObj(data);
//         setSpeciesList(data.species);
//       } catch (err) {
//         setError("Failed to fetch species list. Please try again later.");
//       }
//     };
//     fetchSpeciesList();
//   }, [filterOrder, page, search]);

//   const handleDelete = async (id) => {
//     try {
//       const speciesToDelete = speciesList.find((species) => species._id === id);
//       const confirmation = window.confirm(
//         `Are you sure you want to delete ${speciesToDelete.englishName}?`
//       );
//       if (confirmation) {
//         const res = await axios.delete(
//           `http://localhost:8080/api/v1/species/${id}`
//         );

//         // const res = await axios.delete(
//         //   `${process.env.REACT_APP_API_URL}/api/v1/species/${id}`
//         // );

//         setSpeciesList((prevSpeciesList) =>
//           prevSpeciesList.filter((species) => species._id !== id)
//         );
//         setSpeciesCount(speciesList.length);
//         setMsg(res.data.message);
//         setError("");
//       }
//     } catch (err) {
//       setError(err.response.data.error);
//       setMsg("");
//     } finally {
//       setError("");
//       setMsg("");
//     }
//   };

//   return (
//     <div className="total-species-container">
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <h2 className="header">
//           Total Species <span className="species-count">({speciesCount})</span>
//         </h2>
//         <div>
//           <button className="export-button">Export Data</button>
//           <Link to="/species/add">
//             <button className="add-button">Add Species</button>
//           </Link>
//         </div>
//       </div>

//       {error && <div className="error_msg">{error}</div>}
//       {msg && <div className="success_msg">{msg}</div>}

//       <div className="species-page-container">
//         <div className="species-filter-container">
//           <div className="species-search-bar">
//             <span className="material-icons google-font-icon">search</span>
//             <Search setSearch={(search) => setSearch(search)} />
//           </div>
//           <div className="filter-select-order">
//             {/* <select className="species-filter-dropdown">
//               <option value="">Order</option>
//               <option value="1">Order 1</option>
//               <option value="2">Order 2</option>
//               <option value="3">Order 3</option>
//             </select> */}
//             <Orders
//               filterOrder={filterOrder}
//               orders={obj.orders ? obj.orders : []}
//               setFilterOrder={(order) => setFilterOrder(order)}
//             />
//             <span className="material-icons google-font-icon">
//               arrow_drop_down
//             </span>
//           </div>
//           <div className="filter-select">
//             <select className="species-filter-dropdown">
//               <option value="">Family</option>
//               <option value="1">Family 1</option>
//               <option value="2">Family 2</option>
//               <option value="3">Family 3</option>
//             </select>
//             <span className="material-icons google-font-icon">
//               arrow_drop_down
//             </span>
//           </div>
//           <div className="filter-select">
//             <select className="species-filter-dropdown">
//               <option value="">Genus</option>
//               <option value="1">Genus 1</option>
//               <option value="2">Genus 2</option>
//               <option value="3">Genus 3</option>
//             </select>
//             <span className="material-icons google-font-icon">
//               arrow_drop_down
//             </span>
//           </div>
//           <div className="filter-select-s">
//             <select className="species-filter-dropdown">
//               <option value="">IUCN Status</option>
//               <option value="1">IUCN Status 1</option>
//               <option value="2">IUCN Status 2</option>
//               <option value="3">IUCN Status 3</option>
//             </select>
//             <span className="material-icons google-font-icon">
//               arrow_drop_down
//             </span>
//           </div>
//           <div className="filter-button">
//             <button className="filter-more-btn">
//               More
//               <span className="material-symbols-outlined google-font-icon">
//                 page_info
//               </span>
//             </button>
//           </div>
//         </div>
//         <div className="species-container">
//           <SpeciesListComponent
//             speciesObj={speciesList ? speciesList : []}
//             deleteSpecies={handleDelete}
//           />
//         </div>
//       </div>
//       <Pagination
//         page={page}
//         limit={obj.limit ? obj.limit : 0}
//         total={obj.foundTotal ? obj.foundTotal : 0}
//         setPage={(page) => setPage(page)}
//       />
//     </div>
//   );
// }

// export default Species;

// // import React, { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import axios from "axios";

// // import "../styles/species.css";

// // function SpeciesList() {
// //   const [speciesList, setSpeciesList] = useState([]);
// //   const [msg, setMsg] = useState("");
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     const fetchSpeciesList = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:8080/api/v1/species");
// //         setSpeciesList(res.data);
// //       } catch (err) {
// //         setError("Failed to fetch species list. Please try again later.");
// //       }
// //     };
// //     fetchSpeciesList();
// //   }, []);

// //   const handleDelete = async (id) => {
// //     try {
// //       const speciesToDelete = speciesList.find((species) => species._id === id);
// //       const confirmation = window.confirm(
// //         `Are you sure you want to delete ${speciesToDelete.englishName}?`
// //       );
// //       if (confirmation) {
// //         const res = await axios.delete(
// //           `http://localhost:8080/api/v1/species/${id}`
// //         );
// //         setSpeciesList((prevSpeciesList) =>
// //           prevSpeciesList.filter((species) => species._id !== id)
// //         );
// //         setMsg(res.data.message);
// //         setError("");
// //       }
// //     } catch (err) {
// //       setError(err.response.data.error);
// //       setMsg("");
// //     } finally {
// //       setError("");
// //       setMsg("");
// //     }
// //   };

// //   // const handleDelete = async (id) => {
// //   //   try {
// //   //     const res = await axios.delete(
// //   //       `http://localhost:8080/api/v1/species/${id}`
// //   //     );
// //   //     setSpeciesList((prevSpeciesList) =>
// //   //       prevSpeciesList.filter((species) => species._id !== id)
// //   //     );
// //   //     setMsg(res.data.message);
// //   //     setError("");
// //   //   } catch (err) {
// //   //     setError(err.response.data.error);
// //   //     setMsg("");
// //   //   }
// //   // };
// //   return (
// //     <div>
// //       <h1>Species List</h1>
// //       <br></br>
// //       <br></br>

// //       <br></br>
// //       <Link to="/species/add">
// //         <button className="add-button">Add Species</button>
// //       </Link>
// //       <br></br>
// //       <br></br>
// //       {error && <div className="error_msg">{error}</div>}
// //       {msg && <div className="success_msg">{msg}</div>}

// //       <ul>
// //         {speciesList.map((species) => (
// //           <li key={species._id} className="species-card">
// //             <div className="button-container">
// //               <button onClick={() => handleDelete(species._id)}>Delete</button>
// //             </div>

// //             <Link
// //               to={`/species/${species._id}`}
// //               state={{ speciesDetail: species }}
// //             >
// //               <h2>{species.englishName}</h2>
// //             </Link>
// //             <p>
// //               <strong>Scientific Name:</strong> {species.scientificName}
// //             </p>
// //             <p>
// //               <strong>Order:</strong> {species.order}
// //             </p>
// //             <p>
// //               <strong>Family Name:</strong> {species.familyName}
// //             </p>
// //             <p>
// //               <strong>Genus:</strong> {species.genus}
// //             </p>
// //             <p>
// //               <strong>Species:</strong> {species.species}
// //             </p>
// //             <p>
// //               <strong>Authority:</strong> {species.authority}
// //             </p>
// //             <p>
// //               <strong>Group:</strong> {species.group}
// //             </p>
// //             <p>
// //               <strong>Dzongkha Name:</strong> {species.dzongkhaName}
// //             </p>
// //             <p>
// //               <strong>Lho Name:</strong> {species.lhoName}
// //             </p>
// //             <p>
// //               <strong>Shar Name:</strong> {species.sharName}
// //             </p>
// //             <p>
// //               <strong>Kheng Name:</strong> {species.khengName}
// //             </p>
// //             <p>
// //               <strong>IUCN Status:</strong> {species.iucnStatus}
// //             </p>
// //             <p>
// //               <strong>Legislation:</strong> {species.legislation}
// //             </p>
// //             <p>
// //               <strong>Migration Status:</strong> {species.migrationStatus}
// //             </p>
// //             <p>
// //               <strong>Bird Type:</strong> {species.birdType}
// //             </p>
// //             <p>
// //               <strong>Description:</strong> {species.description}
// //             </p>
// //             <p>
// //               <strong>Observations:</strong> {species.observations}
// //             </p>
// //             {species.photos[0] && (
// //               <img
// //                 src={species.photos[0].url}
// //                 alt={species.photos[0].caption}
// //               />
// //             )}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // export default SpeciesList;
