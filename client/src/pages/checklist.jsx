import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/checklist.css";

import { Search, Pagination } from "../components";

function Checklist() {
  const [checklists, setChecklists] = useState([]);
  const [checklistTotal, setChecklistTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [foundTotal, setFoundTotal] = useState(0);
  const [birderName, setBirderName] = useState("");
  const [birdingSite, setBirdingSite] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, limit, birderName]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists?page=${page}&limit=${limit}&birder=${birderName}&birding_site=${birdingSite}`
      );
      console.log("response: ", response.data);
      setLimit(response.data.limit);
      setFoundTotal(response.data.foundTotal);
      setChecklistTotal(response.data.totalChecklists);
      setChecklists(Object.values(response.data.checklists));
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
          Total Checklist
          <span className="checklist-count">({checklistTotal})</span>
        </h2>
        <div className="checklist-button-container">
          <button className="checklist-export-button">Export Data</button>
        </div>
      </div>
      <div className="checklist-page-container">
        <div className="checklist-filter-container">
          {/* <div className="checklist-filter-select">
            <select className="checklist-filter-dropdown">
              <option value="">Birder</option>
              <option value="1">option 1</option>
              <option value="2">option 2</option>
              <option value="3">option 3</option>
            </select>
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div> */}
          <div className="checklist-name-search">
            <Search
              placeholder="Birder"
              setSearch={(birderName) => setBirderName(birderName)}
            />
          </div>
          <div className="checklist-name-search">
            <Search
              placeholder="Birding sites"
              setSearch={(birdingSite) => setBirdingSite(birdingSite)}
            />
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
              <option value="">Village</option>
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
            <div key={index}>
              <Link
                to={`/checklists/${item._id.checklistName}`}
                className="checklist-link"
                state={{ ChecklistDetail: item }}
              >
                <div className="retrived-table">
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
      </div>

      {/* <div
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
      </div> */}

      <Pagination
        page={page}
        limit={limit ? limit : 0}
        total={checklistTotal ? checklistTotal : 0}
        setPage={(page) => setPage(page)}
      />
    </div>
  );
}

export default Checklist;
