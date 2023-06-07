import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../styles/checklist.css";
import { Pagination } from "../components";

function NewSpecies() {
  const [newSpecies, setNewSpecies] = useState([]);
  const [newSpeciesTotal, setNewSpeciesTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [foundTotal, setFoundTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/newspecies?page=${page}&limit=${limit}`
      );
      console.log("response: ", response.data);
      setLimit(response.data.limit);
      setFoundTotal(response.data.foundTotal);
      setNewSpeciesTotal(response.data.totalChecklists);
      setNewSpecies(Object.values(response.data.checklists));
    } catch (error) {
      console.log(error);
    }
  };

  console.log("limit: ", limit);

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
        <h2 className="total-header">
          New Species <span className="checklist-count">(10)</span>
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

      <div className="checklist-table-container">
        {newSpecies.map((item, index) => {
          const serialNumber = (page - 1) * limit + index + 1;
          return (
            <div key={index}>
              <Link
                to={`/new-species/${item._id.checklistName}`}
                className="checklist-link"
                state={{ NewSpeciesDetails: item }}
              >
                <div>
                  <table className="checklist-table">
                    <tbody>
                      <tr>
                        <td data-label="Birder" className="custom-data">
                          #{serialNumber} {item._id.observer}
                        </td>
                        <td data-label="Birding site" className="custom-data">
                          {item._id.village && (
                            <>
                              {item._id.village}
                              {", "}
                            </>
                          )}

                          {item._id.gewog && (
                            <>
                              {item._id.gewog}
                              {", "}
                            </>
                          )}
                          {item._id.dzongkhag && (
                            <>
                              {item._id.dzongkhag}
                              {", "}
                            </>
                          )}
                        </td>
                        <td data-label="Date/Time" className="custom-data">
                          {convertDate(item._id.selectedDate) || "none"}
                        </td>
                        <td data-label="District" className="custom-data">
                          {item._id.dzongkhag || "none"}
                        </td>
                        <td data-label="Gewog" className="custom-data">
                          {item._id.gewog || "none"}
                        </td>
                        <td data-label="Chiwog" className="custom-data">
                          {item._id.village || "none"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Link>
            </div>
          );
        })}

        {/* <div>
          <Link to="/new-species-detail" className="checklist-link">
            <div>
              <table className="checklist-table">
                <tbody>
                  <td data-label="Birder" className="custom-data">
                    #1 Birder
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
          <Link to="/new-species-detail" className="checklist-link">
            <div>
              <table className="checklist-table">
                <tbody>
                  <td data-label="Birder" className="custom-data">
                    #2 Birder
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
        </div> */}

        <Pagination
          page={page}
          limit={limit ? limit : 0}
          total={newSpeciesTotal ? newSpeciesTotal : 0}
          setPage={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}

export default NewSpecies;
