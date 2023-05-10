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
    let order = req.query.order || "All";

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

    order === "All"
      ? (order = [...orderOptions])
      : (order = req.query.order.split(","));

    const species = await Species.find({
      englishName: { $regex: search, $options: "i" },
    })
      .where("order")
      .in([...order])
      .skip(page * limit)
      .limit(limit);
    // .sort({ _id: -1 });

    const total = await Species.countDocuments({
      order: { $in: [...order] },
      englishName: { $regex: search, $options: "i" },
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
