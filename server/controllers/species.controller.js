import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import xlsx from "xlsx";

import Species from "../mongodb/models/species.js";
import { User, validateUser } from "../mongodb/models/user.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllSpecies = async (req, res) => {
  try {
    const species = await Species.find({});
    res.status(200).json(species);
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
    legislation,
    migrationStatus,
    birdType,
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
      legislation,
      migrationStatus,
      birdType,
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
  // console.log(req.body);
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
    legislation,
    migrationStatus,
    birdType,
    description,
    observations,
    photos,
  } = req.body;

  try {
    let updatedSpecies = await Species.findById(speciesId);
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
    updatedSpecies.legislation = legislation;
    updatedSpecies.migrationStatus = migrationStatus;
    updatedSpecies.birdType = birdType;
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

// const uploadExcelFile = async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send("No file uploaded");
//     }
//     const workbook = xlsx.readFile(file.path);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: false });
//     const keys = data[0];
//     const values = data.slice(1);
//     const speciesList = values.map((row) => {
//       const speciesData = {};
//       row.forEach((value, index) => {
//         if (value) {
//           speciesData[keys[index]] = value;
//         }
//       });
//       return speciesData;
//     });
//     // console.log(speciesList);
//     Species.insertMany(speciesList)
//       .then(() => {
//         console.log("Data added successfully!");
//         res
//           .status(201)
//           .send({ data: speciesList, message: "Data added successfully!" });
//       })
//       .catch((error) => {
//         console.error("Error adding data:", error);
//         res.status(500).json(error);
//       });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

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

async function uploadPhotos(photoArray) {
  try {
    const photoUrls = [];
    for (const photoPath of photoArray) {
      const photoUrl = await uploadPhoto(photoPath);
      photoUrls.push(photoUrl);
    }
    return photoUrls;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload photos to Cloudinary");
  }
}

const uploadExcelFile = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const birdData = xlsx.utils.sheet_to_json(worksheet);

    let species = [{}];

    for (const bird of birdData) {
      let photoUrls = [];
      if (bird.photos) {
        const photoArray = JSON.parse(bird.photos.replace(/'/g, ""));
        photoUrls = await uploadPhotos(photoArray);
      }

      const newBird = new Species({
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
        legislation: bird.legislation,
        migrationStatus: bird.migrationStatus,
        birdType: bird.birdType,
        photos: photoUrls.map((url) => ({ url })),
      });

      await newBird.save();
      species = newBird;
    }

    res
      .status(200)
      .json({ data: species, message: "Bird data uploaded successfully" });
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
