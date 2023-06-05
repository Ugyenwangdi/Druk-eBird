import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import xlsx from "xlsx";

import Species from "../mongodb/models/species.js";
import {
  orderOptions,
  familyOptions,
  genusOptions,
  iucnStatusOptions,
  groupOptions,
  residencyOptions,
} from "../constants/index.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getCount = async (req, res) => {
  try {
    const count = await Species.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Failed to fetch species count:", error);
    res.status(500).json({ error: "Failed to fetch species count" });
  }
};

// Complex search with pagination
const getSpecies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const startsWith = req.query.starts_with || "";
    let search = req.query.search || "";
    const species = req.query.species || "";
    const scientificName = req.query.scientific_name || "";
    let order = req.query.order || "All";
    let family = req.query.family || "All";
    let genus = req.query.genus || "All";
    let iucnStatus = req.query.iucn_status || "All";
    let group = req.query.group || "All";
    let residency = req.query.residency || "All";

    order === "All"
      ? (order = [...orderOptions])
      : (order = req.query.order.split(","));

    family === "All"
      ? (family = [...familyOptions])
      : (family = req.query.family.split(","));

    genus === "All"
      ? (genus = [...genusOptions])
      : (genus = req.query.genus.split(","));

    iucnStatus === "All"
      ? (iucnStatus = [...iucnStatusOptions])
      : (iucnStatus = req.query.iucn_status.split(","));

    group === "All"
      ? (group = [...groupOptions])
      : (group = req.query.group.split(","));

    residency === "All"
      ? (residency = [...residencyOptions])
      : (residency = req.query.residency.split(","));

    let searchQuery = {};

    if (startsWith) {
      searchQuery = {
        $or: [
          { englishName: { $regex: `^${startsWith}`, $options: "i" } },
          { englishName: { $regex: `.* ${startsWith}`, $options: "i" } },
        ],
      };
    } else {
      searchQuery = {
        $or: [
          { englishName: { $regex: search, $options: "i" } },
          { species: { $regex: search, $options: "i" } },
          { scientificName: { $regex: search, $options: "i" } },
        ],
      };
    }
    const foundSpecies = await Species.find({
      $or: [
        { order: { $in: [...order] } },
        { order: "" },
        { familyName: { $in: [...family] } },
        { familyName: "" },
        { genus: { $in: [...genus] } },
        { genus: "" },
        { iucnStatus: { $in: [...iucnStatus] } },
        { iucnStatus: "" },
        { group: { $in: [...group] } },
        { group: "" },
        { residency: { $in: [...residency] } },
        { residency: "" },
        { species: { $regex: species, $options: "i" } },
        { species: "" },
        { scientificName: { $regex: scientificName, $options: "i" } },
        { scientificName: "" },
      ],
      ...searchQuery,
      species: { $regex: species, $options: "i" },
      scientificName: { $regex: scientificName, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);

    const total = await Species.countDocuments({
      $or: [
        { order: { $in: [...order] } },
        { order: "" },
        { familyName: { $in: [...family] } },
        { familyName: "" },
        { genus: { $in: [...genus] } },
        { genus: "" },
        { iucnStatus: { $in: [...iucnStatus] } },
        { iucnStatus: "" },
        { group: { $in: [...group] } },
        { group: "" },
        { residency: { $in: [...residency] } },
        { residency: "" },
        { species: { $regex: species, $options: "i" } },
        { species: "" },
        { scientificName: { $regex: scientificName, $options: "i" } },
        { scientificName: "" },
      ],
      ...searchQuery,
      species: { $regex: species, $options: "i" },
      scientificName: { $regex: scientificName, $options: "i" },
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
      iucnstatuses: iucnStatusOptions,
      groups: groupOptions,
      residencies: residencyOptions,
      species: foundSpecies,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllSpecies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const export_limit = req.query.export_limit;
    const startsWith = req.query.starts_with || "";
    let search = req.query.search || "";
    const species = req.query.species || "";
    const scientificName = req.query.scientific_name || "";
    let order = req.query.order || "All";
    let family = req.query.family || "All";
    let genus = req.query.genus || "All";
    let iucnStatus = req.query.iucn_status || "All";
    let group = req.query.group || "All";
    let residency = req.query.residency || "All";

    order === "All"
      ? (order = [...orderOptions])
      : (order = req.query.order.split(","));

    family === "All"
      ? (family = [...familyOptions])
      : (family = req.query.family.split(","));

    genus === "All"
      ? (genus = [...genusOptions])
      : (genus = req.query.genus.split(","));

    iucnStatus === "All"
      ? (iucnStatus = [...iucnStatusOptions])
      : (iucnStatus = req.query.iucn_status.split(","));

    group === "All"
      ? (group = [...groupOptions])
      : (group = req.query.group.split(","));

    residency === "All"
      ? (residency = [...residencyOptions])
      : (residency = req.query.residency.split(","));

    let searchQuery = {};

    if (startsWith) {
      searchQuery = {
        $or: [
          { englishName: { $regex: `^${startsWith}`, $options: "i" } },
          { englishName: { $regex: `.* ${startsWith}`, $options: "i" } },
        ],
      };
    } else {
      searchQuery = {
        $or: [
          { englishName: { $regex: search, $options: "i" } },
          { species: { $regex: search, $options: "i" } },
          { scientificName: { $regex: search, $options: "i" } },
        ],
      };
    }

    let foundSpecies = {};
    if (export_limit) {
      foundSpecies = await Species.find().maxTimeMS(30000);
    } else {
      foundSpecies = await Species.find({
        $or: [
          { order: { $in: [...order] } },
          { order: "" },
          { familyName: { $in: [...family] } },
          { familyName: "" },
          { genus: { $in: [...genus] } },
          { genus: "" },
          { iucnStatus: { $in: [...iucnStatus] } },
          { iucnStatus: "" },
          { group: { $in: [...group] } },
          { group: "" },
          { residency: { $in: [...residency] } },
          { residency: "" },
          { species: { $regex: species, $options: "i" } },
          { species: "" },
          { scientificName: { $regex: scientificName, $options: "i" } },
          { scientificName: "" },
        ],
        ...searchQuery,
        species: { $regex: species, $options: "i" },
        scientificName: { $regex: scientificName, $options: "i" },
      })
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit);
    }

    const total = await Species.countDocuments({
      $or: [
        { order: { $in: [...order] } },
        { order: "" },
        { familyName: { $in: [...family] } },
        { familyName: "" },
        { genus: { $in: [...genus] } },
        { genus: "" },
        { iucnStatus: { $in: [...iucnStatus] } },
        { iucnStatus: "" },
        { group: { $in: [...group] } },
        { group: "" },
        { residency: { $in: [...residency] } },
        { residency: "" },
        { species: { $regex: species, $options: "i" } },
        { species: "" },
        { scientificName: { $regex: scientificName, $options: "i" } },
        { scientificName: "" },
      ],
      ...searchQuery,
      species: { $regex: species, $options: "i" },
      scientificName: { $regex: scientificName, $options: "i" },
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
      iucnstatuses: iucnStatusOptions,
      groups: groupOptions,
      residencies: residencyOptions,
      species: foundSpecies,
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
    const species = await Species.findById(id);

    if (!species) {
      return res.status(404).send({ error: "Species not found" });
    }

    res.status(200).json(species);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
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

  if (!englishName || !scientificName) {
    return res
      .status(400)
      .json({ message: "English name and Scientific name are required" });
  }

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
  getCount,
  getSpecies,
  getAllSpecies,
  getSpeciesDetail,
  createSpecies,
  updateSpecies,
  deleteSpecies,
  deleteSpeciesPhoto,
  uploadExcelFile,
};
