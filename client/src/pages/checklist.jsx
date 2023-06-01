import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/checklist.css";

import { Pagination } from "../components";

function Checklist() {
  const [checklists, setChecklists] = useState([]);
  const [checklistTotal, setChecklistTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [foundTotal, setFoundTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists?page=${page}`
      );
      // console.log("response: ", response);
      setChecklistTotal(response.data.checklistTotal);
      setLimit(response.data.limit);
      setFoundTotal(response.data.foundTotal);
      setChecklists(Object.values(response.data.checklists));
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("chcklists: ", checklists);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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
          Total Checklist{" "}
          <span className="checklist-count">({checklistTotal})</span>
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
              <option value="">Date</option>
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

      <div className="checklist-table-container">
        {checklists.map((item, index) => {
          const serialNumber = (page - 1) * limit + index + 1;
          return (
            <div key={item._id}>
              <Link to="/checklist-detail" className="checklist-link" >
                <div>
                  <table className="checklist-table">
                    <tbody>
                      <tr>
                        <td data-label="Serial Number" className="custom-data">
                          {/* {serialNumber} */}
                          #1
                        </td>
                        <td data-label="Birder" className="custom-data">
                          {/* {item.birder} */}
                          sonam
                        </td>
                        <td data-label="Birding site" className="custom-data">
                          {/* Lat. {item.currentLocation.latitude} Lon.{" "}
                          {item.currentLocation.longitude} */}
                          Location
                        </td>
                        <td data-label="Date/Time" className="custom-data">
                          Date
                          {/* {convertDate(item.selectedDate)} */}
                        </td>
                        <td data-label="District" className="custom-data">
                          {/* {item.endpointLocation.split(",")[0]?.trim() ||
                            "none"} */}
                            District
                        </td>
                        <td data-label="Gewog" className="custom-data">
                          {/* {item.endpointLocation.split(",")[1]?.trim() ||
                            "none"} */}
                            Gewog
                        </td>
                        <td data-label="Chiwog" className="custom-data">
                          {/* {item.endpointLocation.split(",")[2]?.trim() ||
                            "none"} */}
                            chiwog
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "26px",
        }}
      >
        <Link to="/checklists/add">
          <button className="add-button">Add Checklist</button>
        </Link>

        <Link to="/checklists/analyze">
          <button className="add-button">Analyze Checklist</button>
        </Link>
      </div>

      <Pagination
        page={page}
        limit={limit ? limit : 0}
        total={foundTotal ? foundTotal : 0}
        setPage={(page) => setPage(page)}
      />
    </div>
  );
}

export default Checklist;
