import React from "react";
import { Link } from "react-router-dom";
import { preview } from "../images";

const SpeciesListComponent = ({ speciesObj, deleteSpecies }) => {
  return (
    <>
      {speciesObj.map((species) => (
        <div key={species._id} className="species-card">
          <span className="species-card-more material-icons">more_horiz</span>

          <Link
            to={`/species/${species._id}`}
            state={{ speciesDetail: species }}
          >
            {species.photos[0] ? (
              <span
                style={{
                  display: "inline-block",
                  width: "200px",
                  height: "130px",
                  border: "1px solid #dee4ed",
                  borderRadius: "10px",
                }}
              >
                <img src={species.photos[0].url} alt={species.englishName} />
              </span>
            ) : (
              <span
                style={{
                  display: "inline-block",
                  width: "200px",
                  height: "130px",
                  border: "1px solid #dee4ed",
                  borderRadius: "10px",
                }}
              >
                <img src={preview} alt="placeholder" />
              </span>
            )}
          </Link>

          <div className="species-card-content">
            <h3 className="species-card-name">{species.englishName}</h3>
            <div className="species-card-sname"> {species.scientificName}</div>
            <div className="species-card-IUCNStatus">
              IUCN Status: {species.iucnStatus}
            </div>
          </div>
          <div className="species-card-options">
            <ul>
              <li>
                <Link
                  to={`/species/${species._id}/edit`}
                  state={{ speciesDetail: species }}
                >
                  <p>Edit</p>
                </Link>
              </li>
              <li>
                <p onClick={() => deleteSpecies(species._id)}>Delete</p>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default SpeciesListComponent;
