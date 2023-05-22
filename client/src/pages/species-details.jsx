import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { preview } from "../images";
import "../styles/speciesdetails.css";

function SpeciesDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [showFullscreen, setShowFullscreen] = useState(false);

  const [species, setSpecies] = useState(
    location.state?.speciesDetails || { photos: [] }
  );

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        // const res = await axios.get(
        //   `http://localhost:8080/api/v1/species/${id}`
        // );
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/species/${id}`
        );

        setSpecies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecies();
  }, [id]);

  // console.log(species.photos[0].caption);

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  if (!species) {
    return <div>Loading...</div>;
  }

  return (
    <div className="species-details-container">
      {showFullscreen && (
        <div className="fullscreen-container">
          <button className="close-button" onClick={toggleFullscreen}>
            <span className="material-icons">close</span>
          </button>
          <img src={species.photos[0].url} alt="Species" />
        </div>
      )}
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
          alt="species1"
          onClick={toggleFullscreen}
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
      {/* <div className="species-container"> */}
      {/* <div className="species-text">Species: </div>
      <div className="species-name">
        <span style={{ paddingTop: "40px" }}>{species.englishName}</span>
      </div>
      <div className="species-location">
        <span className="material-icons" style={{ color: "black" }}>
          location_on
        </span>
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

      <div className="species-des">Cites Appendix:</div>
      <div className="species-des-para">{species.citesAppendix}</div>

      <div className="species-des">Bhutan Schedule:</div>
      <div className="species-des-para">{species.bhutanSchedule}</div>

      <div className="species-des">Residency:</div>
      <div className="species-des-para">{species.residency}</div>

      <div className="species-des">Habitat:</div>
      <div className="species-des-para">{species.habitat}</div>

      <div className="species-des">Stats:</div>
      <div className="species-des-para">300 Observations</div>

      <div className="species-des">Description:</div>
      <div className="species-des-para">{species.description}</div> */}


{/* <table class="species-table">
  
  <tr>
    <td>Species Name</td>
    <td>{species.englishName}</td>
  </tr>
  <tr>
    <td>
    <span className="material-icons" style={{ color: "black" }}>
        location_on
      </span>Location
      </td>
      <td></td>

  </tr>
  <tr>
    <td>Scientific Name</td>
    <td>{species.scientificName}</td>
  </tr>
  <tr>
    <td>Order</td>
    <td>{species.order}</td>
  </tr>
  <tr>
    <td>Family Name</td>
    <td>{species.familyName}</td>
  </tr>
  <tr>
    <td>Genus</td>
    <td>{species.genus}</td>
  </tr>
  <tr>
    <td>Species</td>
    <td>{species.species}</td>
  </tr>
  <tr>
    <td>Authority</td>
    <td>{species.authority}</td>
  </tr>
  <tr>
    <td>Group</td>
    <td>{species.group}</td>
  </tr>
  <tr>
    <td>Dzongkha Name</td>
    <td>{species.dzongkhaName}</td>
  </tr>
  <tr>
    <td>Lho Name</td>
    <td>{species.lhoName}</td>
  </tr>
  <tr>
    <td>Shar Name</td>
    <td>{species.sharName}</td>
  </tr>
  <tr>
    <td>Kheng Name</td>
    <td>{species.khengName}</td>
  </tr>
  <tr>
    <td>IUCN Status</td>
    <td>{species.iucnStatus}</td>
  </tr>
  <tr>
    <td>Cites Appendix</td>
    <td>{species.citesAppendix}</td>
  </tr>
  <tr>
    <td>Bhutan Schedule</td>
    <td>{species.bhutanSchedule}</td>
  </tr>
  <tr>
    <td>Residency</td>
    <td>{species.residency}</td>
  </tr>
  <tr>
    <td>Habitat</td>
    <td>{species.habitat}</td>
  </tr>
  <tr>
    <td>Stats</td>
    <td>300 Observations</td>
  </tr>
  <tr>
    <td>Description</td>
    <td>{species.description}</td>
  </tr>
</table> */}
<div className="species-table">
  <div className="table-row">
    <div className="table-cell">Species Name</div>
    <div className="table-cell">{species.englishName}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">
      <span className="material-icons" style={{ color: "black" }}>
        location_on
      </span>
      Location
    </div>
    <div className="table-cell"></div>
  </div>
  <div className="table-row">
    <div className="table-cell">Scientific Name</div>
    <div className="table-cell">{species.scientificName}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Order</div>
    <div className="table-cell">{species.order}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Family Name</div>
    <div className="table-cell">{species.familyName}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Genus</div>
    <div className="table-cell">{species.genus}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Species</div>
    <div className="table-cell">{species.species}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Authority</div>
    <div className="table-cell">{species.authority}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Group</div>
    <div className="table-cell">{species.group}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Dzongkha Name</div>
    <div className="table-cell">{species.dzongkhaName}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Lho Name</div>
    <div className="table-cell">{species.lhoName}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Shar Name</div>
    <div className="table-cell">{species.sharName}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Kheng Name</div>
    <div className="table-cell">{species.khengName}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">IUCN Status</div>
    <div className="table-cell">{species.iucnStatus}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Cites Appendix</div>
    <div className="table-cell">{species.citesAppendix}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Bhutan Schedule</div>
    <div className="table-cell">{species.bhutanSchedule}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Residency</div>
    <div className="table-cell">{species.residency}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Habitat</div>
    <div className="table-cell">{species.habitat}</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Stats</div>
    <div className="table-cell">300 Observations</div>
  </div>
  <div className="table-row">
    <div className="table-cell">Description</div>
    <div className="table-cell">{species.description}</div>
  </div>
</div>




      {/* </div> */}

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
