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
        <div className="header">
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
        <div className="img-bird">
          <img
            className="species-image1"
            src={species.photos[0] ? species.photos[0].url : preview}
            alt="species1"
            onClick={toggleFullscreen}
          />
        </div>

        <div className="species-image-column1">
          <h3 className="bird-name">{species.englishName}</h3>
          <div className="scientific-name">{species.scientificName}</div>
          <div className="IUCNStatus">IUCN Status: {species.iucnStatus}</div>
        </div>
      </div>

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
    </div>
  );
}

export default SpeciesDetails;
