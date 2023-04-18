import React from "react";
import { Link } from "react-router-dom";
import "../styles/species.css";

function Species() {
  return (
    <div>
      <div className="button-container">
        <button className="export-button">Export Data</button>
        <Link to="/add-species">
          <button className="add-button">Add Species</button>
        </Link>
      </div>
      <h2>
        Total Species <span className="species-count">(700)</span>
      </h2>
      <div className="species-page-container">
        <div className="species-filter-container">
          <input
            type="text"
            className="species-search-bar"
            placeholder="Search"
          />
          <select className="species-filter-dropdown">
            <option value="">Order</option>
            <option value="1">Order 1</option>
            <option value="2">Order 2</option>
            <option value="3">Order 3</option>
          </select>
          <select className="species-filter-dropdown">
            <option value="">Family</option>
            <option value="1">Family 1</option>
            <option value="2">Family 2</option>
            <option value="3">Family 3</option>
          </select>
          <select className="species-filter-dropdown">
            <option value="">Genus</option>
            <option value="1">Genus 1</option>
            <option value="2">Genus 2</option>
            <option value="3">Genus 3</option>
          </select>
          <select className="species-filter-dropdown">
            <option value="">IUCN Status</option>
            <option value="1">IUCN Status 1</option>
            <option value="2">IUCN Status 2</option>
            <option value="3">IUCN Status 3</option>
          </select>
          <button className="more-btn">More</button>
        </div>
        <div className="species-container">
          <div className="species-card">
            <img src="https://via.placeholder.com/400x200" alt="Bird" />
            <div className="species-card-content">
              <h2 className="species-card-title">Bird Name</h2>
              <div className="species-card-location">
                <span>Location:</span> City, State, Country
              </div>
            </div>
          </div>
          <div className="species-card">
            <img src="https://via.placeholder.com/400x200" alt="Bird" />
            <div className="species-card-content">
              <h2 className="species-card-title">Bird Name</h2>
              <div className="species-card-location">
                <span>Location:</span> City, State, Country
              </div>
            </div>
          </div>
          <div className="species-card">
            <img src="https://via.placeholder.com/400x200" alt="Bird" />
            <div className="species-card-content">
              <h2 className="species-card-title">Bird Name</h2>
              <div className="species-card-location">
                <span>Location:</span> City, State, Country
              </div>
            </div>
          </div>
          <div className="species-card">
            <img src="https://via.placeholder.com/400x200" alt="Bird" />
            <div className="species-card-content">
              <h2 className="species-card-title">Bird Name</h2>
              <div className="species-card-location">
                <span>Location:</span> City, State, Country
              </div>
            </div>
          </div>
          <div className="species-card">
            <img src="https://via.placeholder.com/400x200" alt="Bird" />
            <div className="species-card-content">
              <h2 className="species-card-title">Bird Name</h2>
              <div className="species-card-location">
                <span>Location:</span> City, State, Country
              </div>
            </div>
          </div>
          <div className="species-card">
            <img src="https://via.placeholder.com/400x200" alt="Bird" />
            <div className="species-card-content">
              <h2 className="species-card-title">Bird Name</h2>
              <div className="species-card-location">
                <span>Location:</span> City, State, Country
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Species;
