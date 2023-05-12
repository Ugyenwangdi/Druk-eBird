import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import xlsx from "xlsx";
import axios from "axios";

import Species from "../mongodb/models/species.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const getAllSpecies = async (req, res) => {
//   try {
//     const species = await Species.find({});
//     res.status(200).json(species);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Complex search with pagination
const getAllSpecies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";
    const searchspecies = req.query.searchspecies || "";
    const searchscientific = req.query.searchscientific || "";
    let order = req.query.order || "All";
    let family = req.query.family || "All";
    let genus = req.query.genus || "All";
    let iucnstatus = req.query.iucnstatus || "All";
    let group = req.query.group || "All";
    let residency = req.query.residency || "All";
;
    const orderOptions = [
      "Galliformes",
      "Charadriiformes",
      "Anseriformes",
      "Podicipediformes",
      "Gaviiformes",
      "Ciconiiformes",
      "Pelecaniformes",
      "Procellariiformes",
      "Gruiformes",
      "Suliformes",
      "Coraciiformes",
      "Bucerotiformes",
      "Accipitriformes",
      "Falconiformes",
      "Piciformes",
      "Passeriformes",
      "Trogoniformes",
      "Cuculiformes",
      "Psittaciformes",
      "Columbiformes",
      "Caprimulgiformes",
      "Strigiformes",
      "Passerformes",
      "nan",
      "",
    ];

    const familyOptions = ['Phasianidae', 'Turnicidae', 'Anatidae', 'Podicipedidae', 'Gaviidae', 'Laridae', 'Ciconiidae', 'Threskiornithidae', 'Ardeidae', 'Procellariidae', 'Scolopacidae', 'Ibidorhynchidae', 'Charadriidae', 'Rallidae', 'Rostratulidae', 'Recurvirostridae', 'Burhinidae', 'Glareolidae', 'Jacanidae', 'Phalacrocoracidae', 'Pelecanidae', 'Alcedinidae', 'Bucerotidae', 'Accipitridae', 'Falconidae', 'Pandionidae', 'Gruidae', 'Picidae', 'Indicatoridae', 'Megalaimidae', 'Upupidae', 'Coraciidae', 'Trogonidae', 'Meropidae', 'Cuculidae', 'Psittaculidae', 'Columbidae', 'Apodidae', 'Hemiprocnidae', 'Hirundinidae', 'Strigidae', 'Tytonidae', 'Caprimulgidae', 'Podargidae', 'Cinclidae', 'Muscicapidae', 'Dicruridae', 'Campephagidae', 'Vangidae', 'Monarchidae', 'Rhipiduridae', 'Stenostiridae', 'Pittidae', 'Eurylaimidae', 'Irenidae', 'Chloropseidae', 'Aegithinidae', 'Corvidae', 'Laniidae', 'Paridae', 'Turdidae', 'Sylviidae', 'Oriolidae', 'Artamidae', 'Sturnidae', 'Sittidae', 'Certhiidae', 'Tichodromidae', 'Troglodytidae', 'Aegithalidae', 'Phylloscopidae', 'Scotocercidae', 'Acrocephalidae', 'Locustellidae', 'Cittiidae', 'Cisticolidae', 'Regulidae', 'Zosteropidae', 'Leiothrichidae', 'Pycnonotidae', 'Pellorneidae', 'Timaliidae', 'Pnoepygidae', 'Elachuridae', 'Vireonidae', 'Dicaeidae', 'Nectariniidae', 'Motacillidae', 'Passeridae', 'Prunellidae', 'Alaudidae', 'Ploceidae', 'Estrildidae', 'Fringillidae', 'Emberizidae', 'Calcariidae', 'nan']
    const genusOptions = ['Lerwa', 'Perdix', 'Francolinus', 'Tetraogallus', 'Coturnix', 'Turnix', 'Ithaginis', 'Lophura', 'Tragopan', 'Lophophorus', 'Gallus', 'Pavo', 'Polyplectron', 'Phasianus', 'Arborophila', 'Anser', 'Mareca', 'Aythya', 'Clangula', 'Aix', 'Dendrocygna', 'Asarcornis', 'Tadorna', 'Spatula', 'Anas', 'Sibirionetta', 'Mergus', 'Podiceps', 'Tachybaptus', 'Netta', 'Gavia', 'Sternula', 'Chlidonias', 'Sterna', 'Anastomus', 'Pseudibis', 'Leptoptilos', 'Platalea', 'Ixobrychus', 'Botaurus', 'Bucephala', 'Ardenna', 'Actitis', 'Calidris', 'Tringa', 'Ibidorhyncha', 'Vanellus', 'Charadrius', 'Pluvialis', 'Zapornia', 'Rallina', 'Rostratula', 'Lymnocryptes', 'Gallinago', 'Himantopus', 'Esacus', 'Burhinus', 'Scolopax', 'Glareola', 'Recurvirostra', 'Porphyrio', 'Fulica', 'Gallinula', 'Gallirallus', 'Numenius', 'Amaurornis', 'Metopidius', 'Hydrophasianus', 'Phalaropus', 'Chroicocephalus', 'Ichthyaetus', 'Larus', 'Phalacrocorax', 'Pelecanus', 'Alcedo', 'Halcyon', 'Todiramphus', 'Megaceryle', 'Ceyx', 'Ceryle', 'Pelargopsis', 'Buceros', 'Aceros', 'Anthracoceros', 'Rhyticeros', 'Accipiter', 'Buteo', 'Pernis', 'Butastur', 'Circus', 'Hieraaetus', 'Aquila', 'Circaetus', 'Clanga', 'Nisaetus', 'Lophotriorchis', 'Microhierax', 'Falco', 'Ictinaetus', 'Milvus', 'Elanus', 'Haliastur', 'Aviceda', 'Spilornis', 'Haliaeetus', 'Icthyophaga', 'Pandion', 'Gypaetus', 'Aegypius', 'Neophron', 'Gyps', 'Sarcogyps', 'Grus', 'Anthropoides', 'Ciconia', 'Ardea', 'Egretta', 'Bubulcus', 'Nycticorax', 'Ardeola', 'Gorsachius', 'Butorides', 'Picumnus', 
      'Sasia', 'Blythipicus', 'Drenddrocopos', 'Dendrocopos', 'Picus', 'Mulleripicus', 'Gecinulus', 'Micropternus', 'Dinopium', 'Indicator', 'Chrysocolaptes ', 'Megalaima', 'Jynx', 'Upupa', 'Eurystomus', 'Coracias', 'Harpactes', 'Nyctyornis', 'Merops', 'Eudynamys', 'Chrysococcyx', 'Cacomantis', 'Hierococcyx', 'Clamator', 'Surniculus', 'Cuculus', 'Hierococcyx ', 'Rhopodytes', 'Centropus', 'Psittacula', 'Loriculus', 'Columba', 'Ducula', 'Treron', 'Treron ', 'Macropygia', 'Chalcophaps', 'Stigmatopelia', 'Spilopelia', 'Streptopelia', 'Cypsiurus', 'Tachymarptis', 'Apus', 'Collocalia', 'Hirundapus', 'Hemiprocne', 'Delichon', 'Ptyonoprogne', 'Riparia', 'Hirundo', 'Cecropis', 'Glaucidium', 'Athene', 'Tyto', 'Aegolius', 'Ninox', 'Otus', 'Bubo', 'Strix', 'Asio', 'Phodilus', 'Ketupa', 'Caprimulgus', 'Eurostopodus', 'Batrachostomus', 'Cinclus', 'Phoenicurus', 'Rhyacornis', 'Chaimarrornis', 'Hodgsonius', 'Phoenicurus ', 'Dicrurus', 'Pericrocotus', 'Hemipus', 'Hypothymis', 'Rhipidura', 'Chelidorhynx', 'Terpsiphone', 'Cyornis', 'Muscicapa', 'Culicicapa', 'Ficedula', 'Muscicapella ', 'Eumyias', 'Anthipes', 'Niltava', 'Pitta', 'Psarisomus', 'Serilophus', 'Irena', 'Chloropsis', 'Aegithina', 'Cissa', 'Pica', 'Urocissa', 'Dendrocitta', 'Pyrrhocorax', 'Corvus', 'Lanius', 'Nucifraga', 'Pseudopodoces', 'Garrulus', 'Heteroxenicus', 'Brachypteryx', 'Myophonus', 'Turdus', 'Turdus ', 'Monticola', 'Zoothera', 'Geokichla', 'Sylvia', 'Oriolus', 'Tephrodornis', 'Artamus', 'Coracina', 'Luscinia', 'Tarsiger', 'Copsychus', 'Cinclidium', 'Myiomela', 'Grandala', 'Saxicola', 'Enicurus', 'Oenanthe', 'Cochoa', 'Gracupica', 'Sturnia', 'Sturnus', 'Pastor', 'Saroglossa', 'Spodiopsar', 'Acridotheres', 'Gracula', 'Ampeliceps', 'Sitta', 'Certhia', 'Tichodroma',
     'Troglodytes', 'Aegithalos', 'Periparus', 'Cephalopyrus', 'Parus', 'Lophophanes', 'Melanochlora', 'Sylviparus', 'Phylloscopus', 'Seicercus', 'Abroscopus', 'Acrocephalus', 'Tickellia', 'Locustella', 'Bradypterus', 'Cettia', 'Iduna', 'Oligura', 'Leptopoecile', 'Seicercus ', 'Phylloscopus ', 'Megalurus', 'Phragmaticola', 'Orthotomus', 'Phyllergates', 'Regulus', 'Prinia', 'Zosterops', 'Tesia', 'Cisticola', 'Garrulax', 'Garrulax ', 'Liocichla', 'Hemixos', 'Hypsipetes', 'Rubigula', 'Pycnonotus', 'Ixos', 'Alcurus', 'Alophoixus', 'Malacocincla', 'Pellorneum', 'Stachyris', 'Statchyridopsis ', 'Statchyridopsis', 'Stachyridopsis', 'Sphenocichla', 'Turdoides', 'Gampsorhynchus', 'Chrysomma', 'Spelaeornis', 'Napothera', 'Rimator', 'Pnoepyga', 'Elachura', 'Pomatorhinus', 'Xiphirhynchus', 'Pteruthius', 'Myzornis', 'Cutia', 'Actinodura', 'Siva', 'Macronus', 'Leiothrix', 'Malacias', 'Heterophasia', 'Leioptila', 'Cholornis', 'Suthora', 'Conostoma', 'Psittiparus', 'Chleuasicus', 'Lioparus', 'Fulvetta', 'Alcippe', 'Schoeniparus', 'Pseudominla', 'Minla', 'Staphida', 'Yuhina', 'Erpornis', 'Dicaeum', 'Aethopyga', 'Cinnyris', 'Chalcoparia', 'Motacilla', 'Dendronanthus', 'Arachnothera', 'Passer', 'Prunella', 'Mirafra', 'Calandrella', 'Alauda', 'Eremophila', 'Alaudala', 'Anthus', 'Ploceus', 'Lonchura', 'Serinus', 'Spinus', 'Fringilla', 'Leucosticte', 'Carpodacus', 'Pyrrhoplectes', 'Callacanthis', 'Agraphospiza', 'Procarduelis', 'Physlloscopus', 'Loxia', 'Chloris', 'Pyrrhula', 'Erythrura', 'Mycerobas', 'Emberiza', 'Calcarius', 'Ocyceros ', 'Poecile']
    const iucnstatusOptions = ['LC', 'NT', 'VU', 'LC ', 'EN', 'CR']
    const groupOptions = ['Partridge', 'Francolin', 'Snowcock', 'Quail', 'Buttonquail', 'Pheasant', 'Goose', 'Duck', 'duck', 'Shelduck', 'Gadwall', 'Wigeon', 'Anas', 'Shoveler', 'Mallard', 'Teal', 'Pintail', 'Goosander', 'Grebe', 'Pochard', 'Scaup', 'Diver', 'Tern', 'Stork', 'Ibis', 'Adjutant', 'Spoonbill', 'Bittern', 'Goldeneye', 'Shearwater', 'Sandpiper', 'sandpiper', 'Ibisbill', 'Lapwing', 'Plover', 'Crake', 'Snipe', 'Stilt', 'Greenshank', 'Redshank', 'Thick-knee', 'Woodcock', 'Stint', 'Ruff', 'Pratincole', 'Avocet', 'Swamphen', 'Coot', 'Moorhen', 'Whimbrel', 'Curlew', 'Waterhen', 'Jacana', 'Phalarope', 'Gull', 'Cormorant', 'Pelican', 'Kingfisher', 'erithacus', 'Hornbill', 'Accipiter', 'Buzzard', 'Harrier', 'Eagle', 'Falconet', 'Kestrel', 'Falcon', 'Hobby', 'Kite', 'Baza', 'Sea eagles', 'Fish eagle', 'Osprey', 'Vulture', 'Crane', 'Heron', 'Egret', 'Woodpecker', 'Honeyguide', 'Barbet', 'Wryneck', 'Hoopoe', 'Dollarbird', 'Roller', 'Trogon', 'Bee-eater', 'Koel', 'Cuckoo', 'Malkoha', 'Coucal', 'Parakeet', 'Parrot', 'Pigeon', 'badia', 'Green Pigeon', 'Dove', 'Swift', 'Martin', 'Swallow', 'Owl', 'Nightjar', 'Frogmouth', 'Dipper', 'Redstart', 'Drongo', 'Minivet', 'Flycatcher-shrike', 'Monarch', 'Fantail', 'Flycatcher', 'Flyctacher', 'Niltava', 'Pitta', 'Broadbill', 'Bluebird', 'Leafbird', 'Iora', 'Magpie', 'Treepie', 'Chough', 'Raven', 'Crow', 'Shrike', 'Nutcracker', 'Groundpecker', 'Jay', 'Shortwing', 'Thrush', 'maximus', 'Blackbird', 'Rock Thrush', 'Whitethroat', 'Oriole', 'Woodshrike', 'Woodswallows', 'Cuckooshrike', 'Bluethroat', 'Rubythroat', 'Robin', 'Bluetail', 'Shama', 'Grandala', 'Stonechat', 'Bushchat', 'Forktail', 'Rockchat', 'Wheatear', 'Cochoa', 'Starling', 'Myna', 'Nuthatch', 'Treecreeper', 'Wallcreeper', 
    'Wren', 'Tit', 'Warbler', 'Major', 'Tesia', 'Grassbird', 'Tailorbird', 'Goldcrest', 'Prinia', 'White-eye', 'Cisticola', 'Laughingthrush', 'Liocichla', 'Bubul', 'Bulbul', 'Babbler', 'Myzornis', 'Cutia', 'Barwing', 'Siva', 'Leiothrix', 'Mesia', 'Sibia', 'Parrotbill', 'Fulvetta', 'Minla', 'Yuhina', 'Erpornis', 'Flowerpecker', 'Sunbird', 'gouldiae', 'Wagtail', 'Spiderhunter', 'Sparrow', 'Accentor', 'Bushlark', 'Lark', 'Skylark', 'Pipit', 'Weaver', 'Munia', 'Serin', 'Siskin', 'Brambling ', 'Finch', 'Rosefinch', 'Chaffinch', 'Crossbill', 'Greenfinch', 'Bullfinch', 'Parrotfinch', 'Grosbeak', 'Bunting']
    const residencyOptions = ['Altitudinal migrant', 'Resident', 'Passage migrant', 'Summer visitor', 'Introduced', 'Vagrant', 'Winter visitor', 'No recent records', 'Visitor', 'Resident ', 'Summer Visitor', 'Passsage migrant', 'Rare visitor', 'Altitudinal Migrant', 'vagrant']

     order === "All"
      ? (order = [...orderOptions])
      : (order = req.query.order.split(","));

    family === "All"
      ? (family = [...familyOptions])
      : (family = req.query.family.split(","));

    genus === "All"
      ? (genus = [...genusOptions])
      : (genus = req.query.genus.split(","));

    iucnstatus === "All"
      ? (iucnstatus = [...iucnstatusOptions])
      : (iucnstatus = req.query.iucnstatus.split(","));

    group === "All"
      ? (group = [...groupOptions])
      : (group = req.query.group.split(","));

    residency === "All"
      ? (residency = [...residencyOptions])
      : (residency = req.query.residency.split(","));

    const species = await Species.find({
      englishName: { $regex: search, $options: "i" },
      species: { $regex: searchspecies, $options: "i" },
      scientificName: { $regex: searchscientific, $options: "i" },
    })
      .where("order")
      .in([...order])
      .where("familyName")
      .in([...family]) 
      .where("genus")
      .in([...genus])
      .where("iucnStatus")
      .in([...iucnstatus])
      .where("group")
      .in([...group])
      .where("residency")
      .in([...residency])    
      .skip(page * limit)
      .limit(limit);
    // .sort({ _id: -1 });

    const total = await Species.countDocuments({
      order: { $in: [...order] },
      familyName: { $in: [...family] },
      genus: { $in: [...genus] },
      iucnStatus: {$in: [...iucnstatus]},
      group: {$in: [...group]},
      residency: {$in: [...residency]},
      englishName: { $regex: search, $options: "i" },
      species: { $regex: searchspecies, $options: "i" },
      scientificName: { $regex: searchscientific, $options: "i" },
    });

    const speciesTotal = await Species.countDocuments();
    // console.log(`Total number of species: ${speciesTotal}`);

    const response = {
      error: false,
      foundTotal: total,
      speciesTotal,
      page: page + 1,
      limit,
      orders: orderOptions,
      families: familyOptions,
      genuses: genusOptions,
      iucnstatuses: iucnstatusOptions,
      groups: groupOptions,
      residencies: residencyOptions,
      species,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getSpeciesDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const species = await Species.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!species) {
      return res.status(404).send({ error: "Species not found" });
    }

    res.status(200).json(species);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
};

const createSpecies = async (req, res) => {
  const {
    englishName,
    scientificName,
    order,
    familyName,
    genus,
    species,
    authority,
    group,
    dzongkhaName,
    lhoName,
    sharName,
    khengName,
    iucnStatus,
    citesAppendix,
    bhutanSchedule,
    residency,
    habitat,
    description,
    observations,
    photos,
  } = req.body;

  // console.log(photo);

  try {
    const newSpecies = new Species({
      englishName,
      scientificName,
      order,
      familyName,
      genus,
      species,
      authority,
      group,
      dzongkhaName,
      lhoName,
      sharName,
      khengName,
      iucnStatus,
      citesAppendix,
      bhutanSchedule,
      residency,
      habitat,
      description,
      observations,
      photos: [],
    });
    // console.log(photos[0]);
    if (photos[0]) {
      const uploadedResponse = await cloudinary.uploader.upload(photos[0], {
        upload_preset: "druk-ebird",
      });

      if (uploadedResponse) {
        newSpecies.photos.push({
          url: uploadedResponse.secure_url,
        });
      }
    }

    const savedSpecies = await newSpecies.save();
    res.status(201).json({
      data: savedSpecies,
      message: "Species created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateSpecies = async (req, res) => {
  const speciesId = req.params.id;
  console.log(req.body);
  const {
    englishName,
    scientificName,
    order,
    familyName,
    genus,
    species,
    authority,
    group,
    dzongkhaName,
    lhoName,
    sharName,
    khengName,
    iucnStatus,
    citesAppendix,
    bhutanSchedule,
    residency,
    habitat,
    description,
    observations,
    photos,
  } = req.body;

  try {
    let updatedSpecies = await Species.findById(speciesId);
    // console.log(updateSpecies);
    if (!updatedSpecies) {
      return res.status(404).json({ message: "Species not found" });
    }

    updatedSpecies.englishName = englishName;
    updatedSpecies.scientificName = scientificName;
    updatedSpecies.order = order;
    updatedSpecies.familyName = familyName;
    updatedSpecies.genus = genus;
    updatedSpecies.species = species;
    updatedSpecies.authority = authority;
    updatedSpecies.group = group;
    updatedSpecies.dzongkhaName = dzongkhaName;
    updatedSpecies.lhoName = lhoName;
    updatedSpecies.sharName = sharName;
    updatedSpecies.khengName = khengName;
    updatedSpecies.iucnStatus = iucnStatus;
    updatedSpecies.citesAppendix = citesAppendix;
    updatedSpecies.bhutanSchedule = bhutanSchedule;
    updatedSpecies.residency = residency;
    updatedSpecies.habitat = habitat;
    updatedSpecies.description = description;
    updatedSpecies.observations = observations;

    if (photos[0]) {
      const uploadedResponse = await cloudinary.uploader.upload(photos[0], {
        upload_preset: "druk-ebird",
      });

      if (uploadedResponse) {
        updatedSpecies.photos.push({
          url: uploadedResponse.secure_url,
        });
      }
    }

    const savedSpecies = await updatedSpecies.save();

    res.status(200).json({
      data: savedSpecies,
      message: "Species updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteSpecies = async (req, res) => {
  const { id } = req.params;

  try {
    const species = await Species.findByIdAndDelete(id);

    if (!species) {
      return res.status(404).send({ error: "Species not found" });
    }
    res.status(200).json({ message: "Species deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

const deleteSpeciesPhoto = async (req, res) => {
  try {
    const species = await Species.findById(req.params.id);

    // Check if species exists
    if (!species) {
      return res.status(404).json({ error: "Species not found" });
    }

    // Find the photo by its id
    const photo = species.photos.find(
      (photo) => photo._id == req.params.photoId
    );

    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Remove the photo from the photos array
    species.photos.pull({ _id: photo._id });

    // Save the updated species document
    await species.save();

    // Send a success response
    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

async function uploadPhoto(photoPath) {
  try {
    const result = await cloudinary.uploader.upload(photoPath, {
      upload_preset: "druk-ebird",
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload photo to Cloudinary");
  }
}

let imageCount = 0; // Initialize counter variable outside of the function

async function uploadPhotos(photoArray) {
  const batchSize = 50;
  const photoBatches = [];
  for (let i = 0; i < photoArray.length; i += batchSize) {
    photoBatches.push(photoArray.slice(i, i + batchSize));
  }

  const photoUrls = [];
  for (const batch of photoBatches) {
    const batchResults = await Promise.all(
      batch.map(async (photoPath) => {
        try {
          const photoUrl = await uploadPhoto(photoPath);
          console.log(`Uploaded image ${++imageCount}: ${photoPath}`); // Increment counter and log image number
          photoUrls.push(photoUrl);
          return true;
        } catch (error) {
          console.error(error);
          console.log(`Skipping photo: ${photoPath}`);
          return false;
        }
      })
    );

    // Wait for 1 second before uploading the next batch
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return photoUrls;
}

// async function uploadPhotos(photoArray) {
//   try {
//     const photoUrls = [];
//     for (const photoPath of photoArray) {
//       try {
//         const photoUrl = await uploadPhoto(photoPath);
//         console.log(`Uploaded image ${++imageCount}: ${photoPath}`);
//         photoUrls.push(photoUrl);
//       } catch (error) {
//         console.error(error);
//         console.log(`Skipping photo: ${photoPath}`);
//       }
//     }
//     return photoUrls;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to upload photos to Cloudinary");
//   }
// }

const uploadExcelFile = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const birdData = xlsx.utils.sheet_to_json(worksheet);

    let requests = [];

    for (const bird of birdData) {
      let photoUrls = [];
      if (bird.photos) {
        const photoArray = JSON.parse(bird.photos.replace(/'/g, ""));
        photoUrls = await uploadPhotos(photoArray);
      }

      const request = {
        insertOne: {
          document: {
            englishName: bird.englishName,
            scientificName: bird.scientificName,
            order: bird.order,
            familyName: bird.familyName,
            genus: bird.genus,
            species: bird.species,
            authority: bird.authority,
            group: bird.group,
            dzongkhaName: bird.dzongkhaName,
            lhoName: bird.lhoName,
            sharName: bird.sharName,
            khengName: bird.khengName,
            iucnStatus: bird.iucnStatus,
            citesAppendix: bird.citesAppendix,
            bhutanSchedule: bird.bhutanSchedule,
            residency: bird.residency,
            habitat: bird.habitat,
            description: bird.description,
            observations: bird.observations,
            photos: photoUrls.map((url) => ({ url })),
          },
        },
      };

      requests.push(request);
    }

    const result = await Species.bulkWrite(requests);

    console.log(`Uploaded ${result.insertedCount} species successfully!`);

    res.status(201).json({
      data: birdData,
      message: "Bird data uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload bird data" });
  }
};

export {
  getAllSpecies,
  getSpeciesDetail,
  createSpecies,
  updateSpecies,
  deleteSpecies,
  deleteSpeciesPhoto,
  uploadExcelFile,
};
