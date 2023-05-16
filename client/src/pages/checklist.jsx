import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/checklist.css";

function Checklist() {
  // const[record,setRecord] = useState([])

  //  const getData = () =>
  //  {
  //      fetch('https://jsonplaceholder.typicode.com/users')
  //      .then(resposne=> resposne.json())
  //      .then(res=>setRecord(res))
  //  }

  //  useEffect(() => {
  //     getData();
  //  },)
  return (
    <div className="checklists-page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "26px",
        }}
      >
        <h2 className="header">
          Total Checklist <span className="checklist-count">(700)</span>
        </h2>
        <div className="checklist-button-container">
          <button className="checklist-export-button">Export Data</button>
        </div>
      </div>
      <div className="checklist-page-container">
        <div className="checklist-filter-container">
          <div className="checklist-filter-select">
            <select className="checklist-filter-dropdown">
              <option value="">Birder</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="checklist-filter-select">
            <select className="checklist-filter-dropdown">
              <option value="">Birding site</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="checklist-filter-select">
            <select className="checklist-filter-dropdown">
              <option value="">Date/Time</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="checklist-filter-select">
            <select className="checklist-filter-dropdown">
              <option value="">District</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="checklist-filter-select">
            <select className="checklist-filter-dropdown">
              <option value="">Gewog</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="checklist-filter-select">
            <select className="checklist-filter-dropdown">
              <option value="">Chiwog</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      <div>
        <Link to="/checklist-detail" className="checklist-link">
          <div>
            <table className="checklist-table">
              <thead className="main-head">
                <tr>
                  <th>Sl.no</th>
                  <th>Birder</th>
                  <th>Birding site</th>
                  <th>Data/Time</th>
                  <th>District</th>
                  <th>Gewog</th>
                  <th>Chiwog</th>
                </tr>
              </thead>
              <tbody>
                <td data-label="Birder" className="custom-data">
                  #Birder
                </td>
                <td data-label="Birding site" className="custom-data">
                  Gyalpozhing,Mongar
                </td>
                <td data-label="Date/Time" className="custom-data">
                  10.08.2022
                </td>
                <td data-label="District" className="custom-data">
                  Mongar
                </td>
                <td data-label="Gewog" className="custom-data">
                  Gyalppozhing
                </td>
                <td data-label="Chiwog" className="custom-data">
                  Gyalpozhing
                </td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>

      <div>
        <Link to="/checklist-detail" className="checklist-link">
          <div>
            <table className="checklist-table">
              <tbody>
                <td data-label="Birder" className="custom-data">
                  #Birder
                </td>
                <td data-label="Birding site" className="custom-data">
                  Gyalpozhing,Mongar
                </td>
                <td data-label="Date/Time" className="custom-data">
                  10.08.2022
                </td>
                <td data-label="District" className="custom-data">
                  Mongar
                </td>
                <td data-label="Gewog" className="custom-data">
                  Gyalppozhing
                </td>
                <td data-label="Chiwog" className="custom-data">
                  Gyalpozhing
                </td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>
      <div>
        <Link to="/checklist-detail" className="checklist-link">
          <div>
            <table className="checklist-table">
              <tbody>
                <td data-label="Birder" className="custom-data">
                  #Birder
                </td>
                <td data-label="Birding site" className="custom-data">
                  Gyalpozhing,Mongar
                </td>
                <td data-label="Date/Time" className="custom-data">
                  10.08.2022
                </td>
                <td data-label="District" className="custom-data">
                  Mongar
                </td>
                <td data-label="Gewog" className="custom-data">
                  Gyalppozhing
                </td>
                <td data-label="Chiwog" className="custom-data">
                  Gyalpozhing
                </td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Checklist;
