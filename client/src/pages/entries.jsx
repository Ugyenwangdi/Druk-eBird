import React, { useState } from "react";
import "../styles/entries.css";
import { logo } from "../images";

import { Pagination } from "../components";
function Entries() {
  // const [page, setPage] = useState(1);
  // const [obj, setObj] = useState({});
  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "26px",
        }}
      >
        <h2 className="total-header">
          Total Enteries <span className="enteries-count">({foundTotal})</span>
        </h2>
        <div className="entries-button-container">
          <button className="entries-export-button">Export Data</button>
        </div>
      </div>
      <div className="enteries-page-container">
        <div className="enteries-filter-container">
          <div className="species-search-bar">
            <span className="material-icons google-font-icon">search</span>
            <input type="text" className="" placeholder="Search" />
          </div>

          <div className="entries-filter-select">
            <select className="enteries-filter-dropdown">
              <option value="">Birder</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="entries-filter-select">
            <select className="enteries-filter-dropdown">
              <option value="">Date</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="entries-filter-select">
            <select className="enteries-filter-dropdown">
              <option value="">District</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="entries-filter-select">
            <select className="enteries-filter-dropdown">
              <option value="">Birding site</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
        </div>
        <table className="enteries-table">
          <thead>
            <tr>
              <th>Sl.no</th>
              <th>English Name</th>
              <th>Birder</th>
              <th>Birding Site</th>
              <th>Data/Time</th>
              <th>Photo</th>
              <th>Numbers observed</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td data-title="Sl.no">1</td>
              <td data-title="English Name">Spotted Dov</td>
              <td data-title="Birder">Sonam</td>
              <td data-title="Birding site">Gyalpozhing,Mongar highway</td>
              <td data-title="Date/Time">10.12.2022</td>
              <td data-title="Photo">
                <img src={logo} alt="" className="bird-img" />
              </td>
              <td data-title="Number Observed">2 male</td>
            </tr>

            <tr>
              <td data-title="Sl.no">1</td>
              <td data-title="English Name">Spotted Dov</td>
              <td data-title="Birder">Sonam</td>
              <td data-title="Birding site">Gyalpozhing,Mongar highway</td>
              <td data-title="Date/Time">10.12.2022</td>
              <td data-title="Photo">
                <img src={logo} alt="" className="bird-img" />
              </td>
              <td data-title="Number Observed">2 male</td>
            </tr>
            <tr>
              <td data-title="Sl.no">1</td>
              <td data-title="English Name">Spotted Dov</td>
              <td data-title="Birder">Sonam</td>
              <td data-title="Birding site">Gyalpozhing,Mongar highway</td>
              <td data-title="Date/Time">10.12.2022</td>
              <td data-title="Photo">
                <img src={logo} alt="" className="bird-img" />
              </td>
              <td data-title="Number Observed">2 male</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* <Pagination
        page={page}
        limit={obj.limit ? obj.limit : 0}
        total={obj.foundTotal ? obj.foundTotal : 0}
        setPage={(page) => setPage(page)}
      /> */}
    </div>
  );
}

export default Entries;
