import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";

import {
  Search,
  Searchspecies,
  Searchscientific,
  SpeciesListComponent,
  Pagination,
  Orders,
  Families,
  Genuses,
  Iucnstatuses,
  Groups,
  Residencies,
  DeleteSpeciesModal,
} from "../components";
import "../styles/species.css";

function Species({ searchQuery, setSearchClickId }) {
  const token = localStorage.getItem("token");

  const apiToken = {
    Authorization: `Bearer ${token}`,
  };

  const [speciesList, setSpeciesList] = useState([]);
  const [exportList, setExportList] = useState([]);

  const [obj, setObj] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [speciesCount, setSpeciesCount] = useState(0);
  const [filterOrder, setFilterOrder] = useState([]);
  const [filterFamily, setFilterFamily] = useState([]);
  const [filterGenus, setFilterGenus] = useState([]);
  const [filterIucnstatus, setFilterIucnstatus] = useState([]);
  const [filterGroup, setFilterGroup] = useState([]);
  const [filterResidency, setFilterResidency] = useState([]);
  const [page, setPage] = useState(1);
  const [englishName, setEnglishName] = useState("");
  const [searchspecies, setSearchspecies] = useState("");
  const [searchscientific, setSearchscientific] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [speciesToDelete, setSpeciesToDelete] = useState(null);
  const [exportClick, setExportClick] = useState(false);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  console.log(filterGenus);

  useEffect(() => {
    const fetchExportList = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/v1/species?export_limit=all`;

        // console.log("url: ", url);
        const { data } = await axios.get(url);
        console.log("Species data:", data.species);

        setExportList(data.species);
      } catch (err) {
        setError("Failed to fetch species list. Please try again later.");
      }
    };
    fetchExportList();
  }, [exportClick]);

  useEffect(() => {
    const fetchSpeciesList = async () => {
      try {
        // const url = `http://localhost:8080/api/v1/species?page=${page}&order=${filterOrder.toString()}&search=${search}`;
        const url = `${
          process.env.REACT_APP_API_URL
        }/api/v1/species/get?page=${page}&order=${filterOrder.toString()}&family=${filterFamily.toString()}&genus=${filterGenus.toString()}&iucn_status=${filterIucnstatus.toString()}&group=${filterGroup.toString()}&residency=${filterResidency.toString()}&search=${
          englishName || searchQuery
        }&species=${searchspecies}&scientific_name=${searchscientific}`;

        // console.log("url: ", url);
        const { data } = await axios.get(url);
        console.log("Species data:", data.species);

        setSpeciesCount(data.speciesTotal);
        setObj(data);
        setSpeciesList(data.species);
      } catch (err) {
        setError("Failed to fetch species list. Please try again later.");
      }
    };
    fetchSpeciesList();
  }, [
    filterOrder,
    filterFamily,
    filterIucnstatus,
    filterGenus,
    filterGroup,
    filterResidency,
    page,
    englishName,
    searchspecies,
    searchscientific,
    searchQuery,
  ]);

  // console.log("obj:", obj)
  // console.log("Species List:", speciesList)

  const [currentUser, setCurrentUser] = useState({});
  const [fetchCurrentUserLoading, setFetchCurrentUserLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
  });

  const fetchData = async () => {
    try {
      // const response = await fetch("http://localhost:8080/api/v1/users/");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/`);

      const jsonData = await response.json();
      setFormData(Object.values(jsonData));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentUser = useCallback(async () => {
    try {
      setFetchCurrentUserLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/checkLoggedIn`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentUser(response.data.user);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser?.name,
        email: currentUser?.email,
        photo: currentUser?.profile,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser.id) {
      const getAdminDetails = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/`
        );
        const data = await response.json();
        // console.log(data);
        setFormData(data);
      };

      getAdminDetails();
    }
  }, [currentUser]);

  const handleDelete = async (id) => {
    try {
      const speciesToDelete = speciesList.find((species) => species._id === id);
      setSpeciesToDelete(speciesToDelete);
      setShowDeleteModal(true);
    } catch (err) {
      setError(err.response.data.error);
      setMsg("");
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/species/${speciesToDelete._id}`,
        { headers: apiToken }
      );

      setSpeciesList((prevSpeciesList) =>
        prevSpeciesList.filter((species) => species._id !== speciesToDelete._id)
      );
      setSpeciesCount(speciesList.length);
      setMsg(res.data.message);
      setError("");
      const sendNotification = async (message) => {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/notifications`, {
            message: message,
          });
        } catch (error) {
          console.error("Failed to send notification:", error);
        }
      };
      // Create a new notification
      const notificationMessage = `A Bird name **${
        speciesToDelete.englishName
      }** has been deleted by **${
        currentUser.email
      }** at ${new Date().toLocaleString()}.`;
      await sendNotification(notificationMessage);
      console.log(notificationMessage);
    } catch (err) {
      setError(err.response.data.error);
      setMsg("");
    } finally {
      setShowDeleteModal(false);
      setSpeciesToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSpeciesToDelete(null);
  };

  const headers = [
    { label: "English Name", key: "englishName" },
    { label: "Scientific Name", key: "scientificName" },
    { label: "Order", key: "order" },
    { label: "Family Name", key: "familyName" },
    { label: "Genus", key: "genus" },
    { label: "Species", key: "species" },
    { label: "Authority", key: "authority" },
    { label: "Group", key: "group" },
    { label: "Dzongkha Name", key: "dzongkhaName" },
    { label: "Lho Name", key: "lhoName" },
    { label: "Shar Name", key: "sharName" },
    { label: "Kheng Name", key: "khengName" },
    { label: "IUCN Status", key: "iucnStatus" },
    { label: "Cites Appendix", key: "citesAppendix" },
    { label: "Bhutan Schedule", key: "bhutanSchedule" },
    { label: "Residency", key: "residency" },
    { label: "Habitat", key: "habitat" },
  ];

  const csvData = exportList.map((species) => {
    return {
      englishName: species.englishName,
      scientificName: species.scientificName,
      order: species.order,
      familyName: species.family,
      genus: species.genus,
      species: species.species,
      authority: species.authority,
      group: species.group,
      dzongkhaName: species.dzongkhaName,
      lhoName: species.lhoName,
      sharName: species.sharName,
      khengName: species.khengName,
      iucnStatus: species.iucnStatus,
      citesAppendix: species.citesAppendix,
      bhutanSchedule: species.bhutanSchedule,
      residency: species.residency,
      habitat: species.habitat,
    };
  });

  return (
    <div className="total-species-container">
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
          Total Species <span className="species-count">({speciesCount})</span>
        </h2>
        <div className="button-container">
          <CSVLink data={csvData} headers={headers} filename={"species.csv"}>
            <button className="export-button">Export Data</button>
          </CSVLink>
          <Link to="/species/add">
            <button className="add-button">Add Species</button>
          </Link>
        </div>
      </div>

      {error && <div className="error_msg">{error}</div>}
      {msg && <div className="success_msg">{msg}</div>}

      <div className="species-page-container">
        <div className="species-filter-container">
          <div className="species-search-bar">
            <span className="material-icons google-font-icon">search</span>
            <Search setSearch={(englishName) => setEnglishName(englishName)} />
          </div>
          <div className="filter-select" id="order">
            <Orders
              filterOrder={filterOrder}
              orders={obj.orders ? obj.orders : []}
              setFilterOrder={(order) => setFilterOrder(order)}
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="filter-select" id="family">
            <Families
              filterFamily={filterFamily}
              families={obj.families ? obj.families : []}
              setFilterFamily={(family) => setFilterFamily(family)}
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="filter-select" id="genus">
            <Genuses
              filterGenus={filterGenus}
              genuses={obj.genuses ? obj.genuses : []}
              setFilterGenus={(genus) => setFilterGenus(genus)}
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div
            className="filter-select"
            id="iucnstatus"
            style={{ width: "120px" }}
          >
            <Iucnstatuses
              filterIucnstatus={filterIucnstatus}
              iucnstatuses={obj.iucnstatuses ? obj.iucnstatuses : []}
              setFilterIucnstatus={(iucnstatus) =>
                setFilterIucnstatus(iucnstatus)
              }
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="filter-button" style={{ position: "relative" }}>
            <button className="filter-more-btn">
              More
              <span
                className="material-symbols-outlined google-font-icon"
                onClick={handleDropdown}
              >
                page_info
              </span>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-content show">
                <div className="search-bar">
                  <span className="material-icons google-font-icon">
                    search
                  </span>
                  <Searchscientific
                    setSearchscientific={(searchscientific) =>
                      setSearchscientific(searchscientific)
                    }
                  />
                </div>
                <div className="search-bar">
                  <span className="material-icons google-font-icon">
                    search
                  </span>
                  <Searchspecies
                    setSearchspecies={(searchspecies) =>
                      setSearchspecies(searchspecies)
                    }
                  />
                </div>
                <div className="filter-select" id="order-dropdown">
                  <Orders
                    filterOrder={filterOrder}
                    orders={obj.orders ? obj.orders : []}
                    setFilterOrder={(order) => setFilterOrder(order)}
                  />
                  <span className="material-icons google-font-icon">
                    arrow_drop_down
                  </span>
                </div>
                <div className="filter-select" id="family-dropdown">
                  <Families
                    filterFamily={filterFamily}
                    families={obj.families ? obj.families : []}
                    setFilterFamily={(family) => setFilterFamily(family)}
                  />
                  <span className="material-icons google-font-icon">
                    arrow_drop_down
                  </span>
                </div>
                <div className="filter-select" id="genus-dropdown">
                  <Genuses
                    filterGenus={filterGenus}
                    genuses={obj.genuses ? obj.genuses : []}
                    setFilterGenus={(genus) => setFilterGenus(genus)}
                  />
                  <span className="material-icons google-font-icon">
                    arrow_drop_down
                  </span>
                </div>
                <div className="filter-select" id="group-dropdown">
                  <Groups
                    filterGroup={filterGroup}
                    groups={obj.groups ? obj.groups : []}
                    setFilterGroup={(group) => setFilterGroup(group)}
                  />
                  <span className="material-icons google-font-icon">
                    arrow_drop_down
                  </span>
                </div>
                <div className="filter-select" id="iucnstatus-dropdown">
                  <Iucnstatuses
                    filterIucnstatus={filterIucnstatus}
                    iucnstatuses={obj.iucnstatuses ? obj.iucnstatuses : []}
                    setFilterIucnstatus={(iucnstatus) =>
                      setFilterIucnstatus(iucnstatus)
                    }
                  />
                  <span className="material-icons google-font-icon">
                    arrow_drop_down
                  </span>
                </div>
                <div className="filter-select" id="residency-dropdown">
                  <Residencies
                    filterResidency={filterResidency}
                    residencies={obj.residencies ? obj.residencies : []}
                    setFilterResidency={(residency) =>
                      setFilterResidency(residency)
                    }
                  />
                  <span className="material-icons google-font-icon">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="species-container">
          <SpeciesListComponent
            speciesObj={speciesList ? speciesList : []}
            deleteSpecies={handleDelete}
            setSearchClickId={setSearchClickId}
          />
          {showDeleteModal && speciesToDelete && (
            <DeleteSpeciesModal
              speciesName={speciesToDelete.englishName}
              onDelete={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
        </div>
        <Pagination
          page={page}
          limit={obj.limit ? obj.limit : 0}
          total={obj.foundTotal ? obj.foundTotal : 0}
          setPage={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}

export default Species;
