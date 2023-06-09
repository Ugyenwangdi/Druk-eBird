import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../styles/entries.css";
import { logo } from "../images";

import { Search, Dropdown, Pagination } from "../components";
function Entries() {
  const [entries, setEntries] = useState([]);
  const [entriesTotal, setEntriesTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [foundTotal, setFoundTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [birdingSite, setBirdingSite] = useState("");
  const [selectedDzongkhag, setSelectedDzongkhag] = useState("");
  const [selectedGewog, setSelectedGewog] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedBirder, setSelectedBirder] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dzongkhagOptions, setDzongkhagOptions] = useState([]);
  const [gewogOptions, setGewogOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [birderOptions, setBirderOptions] = useState([]);

  const [enlargedImageVisible, setEnlargedImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setEnlargedImageVisible(true);
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    limit,
    selectedBirder,
    search,
    birdingSite,
    selectedDate,
    selectedDzongkhag,
    selectedVillage,
    selectedGewog,
  ]);

  const fetchData = async () => {
    try {
      const formattedDate = selectedDate
        ? moment(selectedDate).format("YYYY-MM-DD")
        : "";

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/entries?page=${page}&limit=${limit}&birder=${selectedBirder}&birding_site=${birdingSite}&dzongkhag=${selectedDzongkhag}&gewog=${selectedGewog}&village=${selectedVillage}&search=${search}&date=${formattedDate}`
      );
      console.log("response: ", response.data);
      setLimit(response.data.limit);
      setFoundTotal(response.data.foundTotal);
      setEntriesTotal(response.data.entriesTotal);
      setDzongkhagOptions(response.data.distinctDzongkhags);
      setBirderOptions(response.data.distinctObservers);
      setGewogOptions(response.data.distinctGewogs);
      setVillageOptions(response.data.distinctVillages);
      setEntries(Object.values(response.data.checklists));
    } catch (error) {
      console.log(error);
    }
  };

  console.log("limit: ", limit);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
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
            <Search
              placeholder="Search bird name, birder"
              setSearch={(search) => setSearch(search)}
              className="darker-placeholder"
            />
          </div>

          <div className="entries-filter-select" style={{ width: "10rem" }}>
            <Dropdown
              option={selectedBirder}
              options={birderOptions ? birderOptions : []}
              setOption={(birder) => setSelectedBirder(birder)}
              title="Birder"
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="date-filter-select">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Select Date"
              className="species-filter-dropdown"
              style={{
                width: "100px",
                maxWidth: "100%",
                color: "black",
                "::placeholder": {
                  color: "black",
                },
              }}
            />
          </div>
          <div className="entries-filter-select" style={{ width: "10rem" }}>
            <Dropdown
              option={selectedDzongkhag}
              options={dzongkhagOptions ? dzongkhagOptions : []}
              setOption={(dzongkhag) => setSelectedDzongkhag(dzongkhag)}
              title="Dzongkhag"
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="entries-filter-select" style={{ width: "10rem" }}>
            <Dropdown
              option={selectedGewog}
              options={gewogOptions ? gewogOptions : []}
              setOption={(gewog) => setSelectedGewog(gewog)}
              title="Gewog"
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="entries-filter-select" style={{ width: "10rem" }}>
            <Dropdown
              option={selectedVillage}
              options={villageOptions ? villageOptions : []}
              setOption={(village) => setSelectedVillage(village)}
              title="Village"
            />
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
            {entries.map((item, index) => {
              const serialNumber = (page - 1) * limit + index + 1;
              return (
                <tr key={index}>
                  <td data-title="Sl.no">{serialNumber}</td>
                  <td data-title="English Name">{item.BirdName}</td>
                  <td data-title="Birder">
                    {item.StartbirdingData[0].observer}
                  </td>
                  <td data-title="Birding site">
                    {item.StartbirdingData[0].EndpointLocation[0].village && (
                      <>
                        {item.StartbirdingData[0].EndpointLocation[0].village}
                        {", "}
                      </>
                    )}

                    {item.StartbirdingData[0].EndpointLocation[0].gewog && (
                      <>
                        {item.StartbirdingData[0].EndpointLocation[0].gewog}
                        {", "}
                      </>
                    )}
                    {item.StartbirdingData[0].EndpointLocation[0].dzongkhag && (
                      <>
                        {item.StartbirdingData[0].EndpointLocation[0].dzongkhag}
                        {", "}
                      </>
                    )}
                  </td>
                  <td data-title="Date/Time">
                    {convertDate(item.StartbirdingData[0].selectedDate) ||
                      "none"}
                  </td>
                  <td data-title="Photo">
                    <img
                      src={
                        item.StartbirdingData[0]?.photo === "null" ||
                        item.StartbirdingData[0]?.photo === undefined
                          ? logo
                          : item.StartbirdingData[0].photo
                      }
                      alt=""
                      className="bird-img"
                      onClick={() =>
                        handleImageClick(item.StartbirdingData[0]?.photo)
                      }
                    />
                    {enlargedImageVisible && (
                      <div className="enlarged-image-container">
                        <img
                          src={selectedImage}
                          alt=""
                          className="enlarged-img"
                        />
                        <button
                          className="close-button"
                          onClick={() => setEnlargedImageVisible(false)}
                        >
                          &#10005;
                        </button>
                      </div>
                    )}
                  </td>
                  <td data-title="Number Observed">
                    {item.StartbirdingData[0].JAcount &&
                    item.StartbirdingData[0].JAcount.Adult === 0 &&
                    item.StartbirdingData[0].JAcount.Juvenile === 0 ? (
                      "Total: " + item.StartbirdingData[0].Totalcount
                    ) : (
                      <>
                        Adult:{" "}
                        {item.StartbirdingData[0].JAcount &&
                        item.StartbirdingData[0].JAcount.Adult
                          ? item.StartbirdingData[0].JAcount.Adult
                          : item.StartbirdingData[0].Totalcount}
                        , Juvenile:{" "}
                        {item.StartbirdingData[0].JAcount &&
                        item.StartbirdingData[0].JAcount.Juvenile
                          ? item.StartbirdingData[0].JAcount.Juvenile
                          : item.StartbirdingData[0].Totalcount}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* <tr>
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
            </tr> */}
          </tbody>
        </table>
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

export default Entries;
