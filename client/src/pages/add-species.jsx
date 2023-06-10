import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/addspecies.css";

function AddSpecies() {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [form, setForm] = useState({
    englishName: "",
    scientificName: "",
    order: "",
    familyName: "",
    genus: "",
    species: "",
    authority: "",
    group: "",
    dzongkhaName: "",
    lhoName: "",
    sharName: "",
    khengName: "",
    iucnStatus: "",
    citesAppendix: "",
    bhutanSchedule: "",
    residency: "",
    habitat: "",
    description: "",
    observations: 0,
    photos: [],
  });
  const [file, setFile] = useState(null);
  const [speciesImg, setSpeciesImg] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  // console.log(speciesImg);

  const handleChange = (event) => {
    setMsg("");
    setError("");
    if (event.target.name === "photo") {
      const file = event.target.files[0];
      TransformImgFileData(file);
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const TransformImgFileData = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSpeciesImg(reader.result);
      };
    } else {
      setSpeciesImg("");
    }
  };

  const [currentUser, setCurrentUser] = useState({});
  const [fetchCurrentUserLoading, setFetchCurrentUserLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
  });

  const fetchData = async () => {
    try {
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
          `${process.env.REACT_APP_API_URL}/users/${currentUser.email}`
        );
        const data = await response.json();
        // console.log(data);
        setFormData(data);
      };

      getAdminDetails();
    }
  }, [currentUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      if (!form.englishName) {
        setError("English name is required!");
        setLoading(false);
        return;
      }
      if (form.englishName.length < 2) {
        setError("Please provide a name with at least 2 letters!");
        setLoading(false);
        return;
      }
      // if (form.scientificName.length < 2) {
      //   setError("Please provide a scientific name with at least 2 letters!");
      //   setLoading(false);
      //   return;
      // }

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/species`,
        {
          ...form,
          photos: [speciesImg],
        },
        { headers }
      ); // post data to server

      setForm({
        englishName: "",
        scientificName: "",
        order: "",
        familyName: "",
        genus: "",
        species: "",
        authority: "",
        group: "",
        dzongkhaName: "",
        lhoName: "",
        sharName: "",
        khengName: "",
        iucnStatus: "",
        citesAppendix: "",
        bhutanSchedule: "",
        residency: "",
        habitat: "",
        description: "",
        observations: 0,
        photos: [],
      }); // reset form
      setSpeciesImg("");

      setMsg(res.data.message);
      console.log(res.data.message);

      const sendNotification = async (notification) => {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/notifications`, {
            message: notification,
          });
        } catch (error) {
          console.error("Failed to send notification:", error);
        }
      };
      // Create a new notification
      const notificationMessage = `A new Species **${
        form.englishName
      }** has been added by **${
        currentUser.email
      }** at ${new Date().toLocaleString()}.`;
      await sendNotification(notificationMessage);
      console.log(notificationMessage);
    } catch (err) {
      setError("Server error! Problem adding species");
    } finally {
      setLoading(false); // set loading to false once user object is available or error occurs
    }
  };

  const handleFileChange = (e) => {
    setMsg("");
    setError("");
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/species/fileupload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg(`Uploaded ${response.data.data.length} species`);
      setFile(null);
      document.getElementById("file").value = "";
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  const orderOptions = [
    "Accipitriformes",
    "Anseriformes",
    "Bucerotiformes",
    "Caprimulgiformes",
    "Charadriiformes",
    "Ciconiiformes",
    "Columbiformes",
    "Coraciiformes",
    "Cuculiformes",
    "Falconiformes",
    "Galliformes",
    "Gaviiformes",
    "Gruiformes",
    "Passerformes",
    "Passeriformes",
    "Pelecaniformes",
    "Piciformes",
    "Podicipediformes",
    "Procellariiformes",
    "Psittaciformes",
    "Strigiformes",
    "Suliformes",
    "Trogoniformes",
  ];

  const familyOptions = [
    "Accipitridae",
    "Acrocephalidae",
    "Aegithalidae",
    "Aegithinidae",
    "Alaudidae",
    "Alcedinidae",
    "Anatidae",
    "Apodidae",
    "Ardeidae",
    "Artamidae",
    "Bucerotidae",
    "Burhinidae",
    "Calcariidae",
    "Campephagidae",
    "Caprimulgidae",
    "Certhiidae",
    "Charadriidae",
    "Chloropseidae",
    "Ciconiidae",
    "Cinclidae",
    "Cisticolidae",
    "Cittiidae",
    "Columbidae",
    "Coraciidae",
    "Corvidae",
    "Cuculidae",
    "Dicaeidae",
    "Dicruridae",
    "Elachuridae",
    "Emberizidae",
    "Estrildidae",
    "Eurylaimidae",
    "Falconidae",
    "Fringillidae",
    "Gaviidae",
    "Glareolidae",
    "Gruidae",
    "Hemiprocnidae",
    "Hirundinidae",
    "Ibidorhynchidae",
    "Indicatoridae",
    "Irenidae",
    "Jacanidae",
    "Laniidae",
    "Laridae",
    "Leiothrichidae",
    "Locustellidae",
    "Megalaimidae",
    "Meropidae",
    "Monarchidae",
    "Motacillidae",
    "Muscicapidae",
    "Nectariniidae",
    "Oriolidae",
    "Pandionidae",
    "Paridae",
    "Passeridae",
    "Pelecanidae",
    "Pellorneidae",
    "Phalacrocoracidae",
    "Phasianidae",
    "Phylloscopidae",
    "Picidae",
    "Pittidae",
    "Ploceidae",
    "Pnoepygidae",
    "Podargidae",
    "Podicipedidae",
    "Procellariidae",
    "Prunellidae",
    "Psittaculidae",
    "Pycnonotidae",
    "Rallidae",
    "Recurvirostridae",
    "Regulidae",
    "Rhipiduridae",
    "Rostratulidae",
    "Scolopacidae",
    "Scotocercidae",
    "Sittidae",
    "Stenostiridae",
    "Strigidae",
    "Sturnidae",
    "Sylviidae",
    "Threskiornithidae",
    "Tichodromidae",
    "Timaliidae",
    "Troglodytidae",
    "Trogonidae",
    "Turdidae",
    "Turnicidae",
    "Tytonidae",
    "Upupidae",
    "Vangidae",
    "Vireonidae",
    "Zosteropidae",
  ];
  const genusOptions = [
    "Abroscopus",
    "Accipiter",
    "Aceros",
    "Acridotheres",
    "Acrocephalus",
    "Actinodura",
    "Actitis",
    "Aegithalos",
    "Aegithina",
    "Aegolius",
    "Aegypius",
    "Aethopyga",
    "Agraphospiza",
    "Aix",
    "Alauda",
    "Alaudala",
    "Alcedo",
    "Alcippe",
    "Alcurus",
    "Alophoixus",
    "Amaurornis",
    "Ampeliceps",
    "Anas",
    "Anastomus",
    "Anser",
    "Anthipes",
    "Anthracoceros",
    "Anthropoides",
    "Anthus",
    "Apus",
    "Aquila",
    "Arachnothera",
    "Arborophila",
    "Ardea",
    "Ardenna",
    "Ardeola",
    "Artamus",
    "Asarcornis",
    "Asio",
    "Athene",
    "Aviceda",
    "Aythya",
    "Batrachostomus",
    "Blythipicus",
    "Botaurus",
    "Brachypteryx",
    "Bradypterus",
    "Bubo",
    "Bubulcus",
    "Bucephala",
    "Buceros",
    "Burhinus",
    "Butastur",
    "Buteo",
    "Butorides",
    "Cacomantis",
    "Calandrella",
    "Calcarius",
    "Calidris",
    "Callacanthis",
    "Caprimulgus",
    "Carpodacus",
    "Cecropis",
    "Centropus",
    "Cephalopyrus",
    "Certhia",
    "Ceryle",
    "Cettia",
    "Ceyx",
    "Chaimarrornis",
    "Chalcoparia",
    "Chalcophaps",
    "Charadrius",
    "Chelidorhynx",
    "Chleuasicus",
    "Chlidonias",
    "Chloris",
    "Chloropsis",
    "Cholornis",
    "Chroicocephalus",
    "Chrysococcyx",
    "Chrysocolaptes ",
    "Chrysomma",
    "Ciconia",
    "Cinclidium",
    "Cinclus",
    "Cinnyris",
    "Circaetus",
    "Circus",
    "Cissa",
    "Cisticola",
    "Clamator",
    "Clanga",
    "Clangula",
    "Cochoa",
    "Collocalia",
    "Columba",
    "Conostoma",
    "Copsychus",
    "Coracias",
    "Coracina",
    "Corvus",
    "Coturnix",
    "Cuculus",
    "Culicicapa",
    "Cutia",
    "Cyornis",
    "Cypsiurus",
    "Delichon",
    "Dendrocitta",
    "Dendrocopos",
    "Dendrocygna",
    "Dendronanthus",
    "Dicaeum",
    "Dicrurus",
    "Dinopium",
    "Drenddrocopos",
    "Ducula",
    "Egretta",
    "Elachura",
    "Elanus",
    "Emberiza",
    "Enicurus",
    "Eremophila",
    "Erpornis",
    "Erythrura",
    "Esacus",
    "Eudynamys",
    "Eumyias",
    "Eurostopodus",
    "Eurystomus",
    "Falco",
    "Ficedula",
    "Francolinus",
    "Fringilla",
    "Fulica",
    "Fulvetta",
    "Gallinago",
    "Gallinula",
    "Gallirallus",
    "Gallus",
    "Gampsorhynchus",
    "Garrulax",
    "Garrulax ",
    "Garrulus",
    "Gavia",
    "Gecinulus",
    "Geokichla",
    "Glareola",
    "Glaucidium",
    "Gorsachius",
    "Gracula",
    "Gracupica",
    "Grandala",
    "Grus",
    "Gypaetus",
    "Gyps",
    "Halcyon",
    "Haliaeetus",
    "Haliastur",
    "Harpactes",
    "Hemiprocne",
    "Hemipus",
    "Hemixos",
    "Heterophasia",
    "Heteroxenicus",
    "Hieraaetus",
    "Hierococcyx",
    "Hierococcyx ",
    "Himantopus",
    "Hirundapus",
    "Hirundo",
    "Hodgsonius",
    "Hydrophasianus",
    "Hypothymis",
    "Hypsipetes",
    "Ibidorhyncha",
    "Ichthyaetus",
    "Icthyophaga",
    "Ictinaetus",
    "Iduna",
    "Indicator",
    "Irena",
    "Ithaginis",
    "Ixobrychus",
    "Ixos",
    "Jynx",
    "Ketupa",
    "Lanius",
    "Larus",
    "Leioptila",
    "Leiothrix",
    "Leptopoecile",
    "Leptoptilos",
    "Lerwa",
    "Leucosticte",
    "Liocichla",
    "Lioparus",
    "Locustella",
    "Lonchura",
    "Lophophanes",
    "Lophophorus",
    "Lophotriorchis",
    "Lophura",
    "Loriculus",
    "Loxia",
    "Luscinia",
    "Lymnocryptes",
    "Macronus",
    "Macropygia",
    "Malacias",
    "Malacocincla",
    "Mareca",
    "Megaceryle",
    "Megalaima",
    "Megalurus",
    "Melanochlora",
    "Mergus",
    "Merops",
    "Metopidius",
    "Microhierax",
    "Micropternus",
    "Milvus",
    "Minla",
    "Mirafra",
    "Monticola",
    "Motacilla",
    "Mulleripicus",
    "Muscicapa",
    "Muscicapella ",
    "Mycerobas",
    "Myiomela",
    "Myophonus",
    "Myzornis",
    "Napothera",
    "Neophron",
    "Netta",
    "Niltava",
    "Ninox",
    "Nisaetus",
    "Nucifraga",
    "Numenius",
    "Nycticorax",
    "Nyctyornis",
    "Ocyceros ",
    "Oenanthe",
    "Oligura",
    "Oriolus",
    "Orthotomus",
    "Otus",
    "Pandion",
    "Parus",
    "Passer",
    "Pastor",
    "Pavo",
    "Pelargopsis",
    "Pelecanus",
    "Pellorneum",
    "Perdix",
    "Pericrocotus",
    "Periparus",
    "Pernis",
    "Phalacrocorax",
    "Phalaropus",
    "Phasianus",
    "Phodilus",
    "Phoenicurus",
    "Phoenicurus ",
    "Phragmaticola",
    "Phyllergates",
    "Phylloscopus",
    "Phylloscopus ",
    "Physlloscopus",
    "Pica",
    "Picumnus",
    "Picus",
    "Pitta",
    "Platalea",
    "Ploceus",
    "Pluvialis",
    "Pnoepyga",
    "Podiceps",
    "Poecile",
    "Polyplectron",
    "Pomatorhinus",
    "Porphyrio",
    "Prinia",
    "Procarduelis",
    "Prunella",
    "Psarisomus",
    "Pseudibis",
    "Pseudominla",
    "Pseudopodoces",
    "Psittacula",
    "Psittiparus",
    "Pteruthius",
    "Ptyonoprogne",
    "Pycnonotus",
    "Pyrrhocorax",
    "Pyrrhoplectes",
    "Pyrrhula",
    "Rallina",
    "Recurvirostra",
    "Regulus",
    "Rhipidura",
    "Rhopodytes",
    "Rhyacornis",
    "Rhyticeros",
    "Rimator",
    "Riparia",
    "Rostratula",
    "Rubigula",
    "Sarcogyps",
    "Saroglossa",
    "Sasia",
    "Saxicola",
    "Schoeniparus",
    "Scolopax",
    "Seicercus",
    "Seicercus ",
    "Serilophus",
    "Serinus",
    "Sibirionetta",
    "Sitta",
    "Siva",
    "Spatula",
    "Spelaeornis",
    "Sphenocichla",
    "Spilopelia",
    "Spilornis",
    "Spinus",
    "Spodiopsar",
    "Stachyridopsis",
    "Stachyris",
    "Staphida",
    "Statchyridopsis",
    "Statchyridopsis ",
    "Sterna",
    "Sternula",
    "Stigmatopelia",
    "Streptopelia",
    "Strix",
    "Sturnia",
    "Sturnus",
    "Surniculus",
    "Suthora",
    "Sylvia",
    "Sylviparus",
    "Tachybaptus",
    "Tachymarptis",
    "Tadorna",
    "Tarsiger",
    "Tephrodornis",
    "Terpsiphone",
    "Tesia",
    "Tetraogallus",
    "Tichodroma",
    "Tickellia",
    "Todiramphus",
    "Tragopan",
    "Treron",
    "Treron ",
    "Tringa",
    "Troglodytes",
    "Turdoides",
    "Turdus",
    "Turdus ",
    "Turnix",
    "Tyto",
    "Upupa",
    "Urocissa",
    "Vanellus",
    "Xiphirhynchus",
    "Yuhina",
    "Zapornia",
    "Zoothera",
    "Zosterops",
  ];
  const iucnStatusOptions = ["CR", "EN", "LC", "LC ", "NT", "VU"];
  const groupOptions = [
    "Accentor",
    "Accipiter",
    "Adjutant",
    "Anas",
    "Avocet",
    "Babbler",
    "Barbet",
    "Barwing",
    "Baza",
    "Bee-eater",
    "Bittern",
    "Blackbird",
    "Bluebird",
    "Bluetail",
    "Bluethroat",
    "Brambling ",
    "Broadbill",
    "Bubul",
    "Bulbul",
    "Bullfinch",
    "Bunting",
    "Bushchat",
    "Bushlark",
    "Buttonquail",
    "Buzzard",
    "Chaffinch",
    "Chough",
    "Cisticola",
    "Cochoa",
    "Coot",
    "Cormorant",
    "Coucal",
    "Crake",
    "Crane",
    "Crossbill",
    "Crow",
    "Cuckoo",
    "Cuckooshrike",
    "Curlew",
    "Cutia",
    "Dipper",
    "Diver",
    "Dollarbird",
    "Dove",
    "Drongo",
    "Duck",
    "Eagle",
    "Egret",
    "Erpornis",
    "Falcon",
    "Falconet",
    "Fantail",
    "Finch",
    "Fish eagle",
    "Flowerpecker",
    "Flycatcher",
    "Flycatcher-shrike",
    "Flyctacher",
    "Forktail",
    "Francolin",
    "Frogmouth",
    "Fulvetta",
    "Gadwall",
    "Goldcrest",
    "Goldeneye",
    "Goosander",
    "Goose",
    "Grandala",
    "Grassbird",
    "Grebe",
    "Green Pigeon",
    "Greenfinch",
    "Greenshank",
    "Grosbeak",
    "Groundpecker",
    "Gull",
    "Harrier",
    "Heron",
    "Hobby",
    "Honeyguide",
    "Hoopoe",
    "Hornbill",
    "Ibis",
    "Ibisbill",
    "Iora",
    "Jacana",
    "Jay",
    "Kestrel",
    "Kingfisher",
    "Kite",
    "Koel",
    "Lapwing",
    "Lark",
    "Laughingthrush",
    "Leafbird",
    "Leiothrix",
    "Liocichla",
    "Magpie",
    "Major",
    "Malkoha",
    "Mallard",
    "Martin",
    "Mesia",
    "Minivet",
    "Minla",
    "Monarch",
    "Moorhen",
    "Munia",
    "Myna",
    "Myzornis",
    "Nightjar",
    "Niltava",
    "Nutcracker",
    "Nuthatch",
    "Oriole",
    "Osprey",
    "Owl",
    "Parakeet",
    "Parrot",
    "Parrotbill",
    "Parrotfinch",
    "Partridge",
    "Pelican",
    "Phalarope",
    "Pheasant",
    "Pigeon",
    "Pintail",
    "Pipit",
    "Pitta",
    "Plover",
    "Pochard",
    "Pratincole",
    "Prinia",
    "Quail",
    "Raven",
    "Redshank",
    "Redstart",
    "Robin",
    "Rock Thrush",
    "Rockchat",
    "Roller",
    "Rosefinch",
    "Rubythroat",
    "Ruff",
    "Sandpiper",
    "Scaup",
    "Sea eagles",
    "Serin",
    "Shama",
    "Shearwater",
    "Shelduck",
    "Shortwing",
    "Shoveler",
    "Shrike",
    "Sibia",
    "Siskin",
    "Siva",
    "Skylark",
    "Snipe",
    "Snowcock",
    "Sparrow",
    "Spiderhunter",
    "Spoonbill",
    "Starling",
    "Stilt",
    "Stint",
    "Stonechat",
    "Stork",
    "Sunbird",
    "Swallow",
    "Swamphen",
    "Swift",
    "Tailorbird",
    "Teal",
    "Tern",
    "Tesia",
    "Thick-knee",
    "Thrush",
    "Tit",
    "Treecreeper",
    "Treepie",
    "Trogon",
    "Vulture",
    "Wagtail",
    "Wallcreeper",
    "Warbler",
    "Waterhen",
    "Weaver",
    "Wheatear",
    "Whimbrel",
    "White-eye",
    "Whitethroat",
    "Wigeon",
    "Woodcock",
    "Woodpecker",
    "Woodshrike",
    "Woodswallows",
    "Wren",
    "Wryneck",
    "Yuhina",
    "badia",
    "duck",
    "erithacus",
    "gouldiae",
    "maximus",
    "sandpiper",
  ];
  const residencyOptions = [
    "Altitudinal Migrant",
    "Altitudinal migrant",
    "Introduced",
    "No recent records",
    "Passage migrant",
    "Passsage migrant",
    "Rare visitor",
    "Resident",
    "Resident ",
    "Resident-update",
    "Summer Visitor",
    "Summer visitor",
    "Vagrant",
    "Visitor",
    "Winter visitor",
    "vagrant",
  ];

  return (
    <div className="add-species-container">
      {showFullscreen && (
        <div className="fullscreen-container">
          <button className="close-button" onClick={toggleFullscreen}>
            <span className="material-icons">close</span>
          </button>
          <img src={speciesImg} alt="Species" />
        </div>
      )}

      <div className="species-header">
        <Link to="/species">
          <span className="material-icons back-arrow">arrow_back_ios</span>
        </Link>
        <h2>Add Species</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="speciescontainer">
          <div className="column1">
            <b>1. General Info</b>
          </div>
          <div className="column2">
            <div>English Name</div>
            <input
              type="text"
              name="englishName"
              value={form.englishName}
              onChange={handleChange}
              placeholder="Enter English Name"
              required
            />

            <div>Order</div>
            {/* <input
              type="text"
              name="order"
              value="Accipitriformes"
              onChange={handleChange}
              placeholder="Enter Order"
            /> */}

            <select
              className="add-options"
              value={form.order}
              type="text"
              name="order"
              onChange={handleChange}
            >
              {orderOptions.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div>Genus</div>
            {/* <input
              type="text"
              name="genus"
              value="Aegithalos"
              onChange={handleChange}
              placeholder="Enter Genus"
            /> */}

            <select
              className="add-options"
              value={form.genus}
              type="text"
              name="genus"
              onChange={handleChange}
            >
              {genusOptions.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div>Authority</div>
            <input
              type="text"
              name="authority"
              value={form.authority}
              onChange={handleChange}
              placeholder="Enter Authority"
            />

            <div>Dzongkha Name</div>
            <input
              type="text"
              name="dzongkhaName"
              value={form.dzongkhaName}
              onChange={handleChange}
              placeholder="Enter Dzongkha Name"
            />

            <div>Shar Name</div>
            <input
              type="text"
              name="sharName"
              value={form.sharName}
              onChange={handleChange}
              placeholder="Enter Shar Name"
            />

            <div>IUCN Status</div>
            {/* <input
              type="text"
              name="iucnStatus"
              value="EN"
              onChange={handleChange}
              placeholder="Enter IUCN Status"
            /> */}

            <select
              className="add-options"
              value={form.iucnStatus}
              type="text"
              name="iucnStatus"
              onChange={handleChange}
            >
              {iucnStatusOptions.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div>Bhutan Schedule</div>
            <input
              type="text"
              name="bhutanSchedule"
              value={form.bhutanSchedule}
              onChange={handleChange}
              placeholder="Bhutan Schedule"
            />

            <div>Habitat</div>
            <input
              type="text"
              name="habitat"
              value={form.habitat}
              onChange={handleChange}
              placeholder="Habitat"
            />

            <div>Species Description</div>
            <input
              className="description"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter Species Description"
            />
          </div>
          <div className="column3">
            <div>Scientific Name</div>

            <input
              type="text"
              name="scientificName"
              value={form.scientificName}
              onChange={handleChange}
              placeholder="Enter Scientific Name"
            />

            <div>Family Name</div>
            {/* <input
              type="text"
              name="familyName"
              value="Anatidae"
              onChange={handleChange}
              placeholder="Enter Family Name"
            /> */}

            <select
              className="add-options"
              value={form.familyName}
              type="text"
              name="familyName"
              onChange={handleChange}
            >
              {familyOptions.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div>Species</div>
            <input
              type="text"
              name="species"
              value={form.species}
              onChange={handleChange}
              placeholder="Enter Species"
            />
            <div>Group</div>
            {/* <input
              type="text"
              name="group"
              value="Accentor"
              onChange={handleChange}
              placeholder="Enter Group"
            /> */}
            <select
              className="add-options"
              value={form.group}
              type="text"
              name="group"
              onChange={handleChange}
            >
              {groupOptions.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div>Lho Name</div>
            <input
              type="text"
              name="lhoName"
              value={form.lhoName}
              onChange={handleChange}
              placeholder="Enter Lho Name"
            />

            <div>Kheng Name</div>
            <input
              type="text"
              name="khengName"
              value={form.khengName}
              onChange={handleChange}
              placeholder="Enter Kheng Name"
            />

            <div>Cites Appendix</div>
            <input
              type="text"
              name="citesAppendix"
              value={form.citesAppendix}
              onChange={handleChange}
              placeholder="Enter cites appendix"
            />

            <div>Residency</div>
            {/* <input
              type="text"
              name="residency"
              value="Resident"
              onChange={handleChange}
              placeholder="Enter residency"
            /> */}
            <select
              className="add-options"
              value={form.residency}
              type="text"
              name="residency"
              onChange={handleChange}
            >
              {residencyOptions.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div>No. of Observation</div>
            <div className="number-input">
              <input
                min="0"
                name="observations"
                value={form.observations}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>
        </div>
        <div className="speciescontainer">
          <div className="column1">2. Media</div>
          <div className="column2">
            <div>Image</div>
            <input
              className="select-photo"
              id="add-photo"
              name="photo"
              accept="image/*"
              type="file"
              onChange={handleChange}
            />
          </div>
          <div className="column3"></div>
        </div>
        <div className="speciesbuttoncontainer">
          <div className="button-container-addspecies">
            <Link to="/species">
              <button className="cancle-button">Cancel</button>
            </Link>
            <button className="addnew-button" type="submit">
              Add Species
            </button>
          </div>
        </div>
      </form>

      <div className="previewcontainer">
        {error && <div className="error_msg">{error}</div>}
        {msg && <div className="success_msg">{msg}</div>}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            <p>Loading....</p>
          </div>
        )}

        <div className="imgpreview">
          <div>Image Preview:</div>
          {speciesImg ? (
            <>
              <img
                src={speciesImg}
                alt="Species"
                style={{ width: "400px", cursor: "pointer" }}
                onClick={toggleFullscreen}
              />
            </>
          ) : (
            <p>Product image upload preview will appear here!</p>
          )}
        </div>

        <span>OR</span>

        <div className="file-upload-container">
          <div>Upload Excel File (*.xlsx)</div>
          <form onSubmit={handleFileSubmit}>
            <input
              className="select-file"
              type="file"
              id="file"
              accept=".xlsx"
              onChange={handleFileChange}
            />
            <button
              className={file ? "addnew-button" : "addnew-button-disabled"}
              type="submit"
              disabled={!file}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export { AddSpecies };
