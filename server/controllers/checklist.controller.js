import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import xlsx from "xlsx";

import ChecklistTest from "../mongodb/models/checklist.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllChecklist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const startsWith = req.query.starts_with || "";
    let search = req.query.search || "";

    let searchQuery = {};

    if (startsWith) {
      searchQuery = {
        $or: [
          { checklistName: { $regex: `^${startsWith}`, $options: "i" } },
          { checklistName: { $regex: `.* ${startsWith}`, $options: "i" } },
        ],
      };
    } else if (search) {
      searchQuery = {
        $or: [
          { checklistName: { $regex: search, $options: "i" } },
          { birdName: { $regex: search, $options: "i" } },
          { endpointLocation: { $regex: search, $options: "i" } },
          { birder: { $regex: search, $options: "i" } },
        ],
      };
    }

    const foundChecklists = await ChecklistTest.find(searchQuery)
      // .skip(page * limit)
      // .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ChecklistTest.countDocuments(searchQuery);
    const checklistTotal = await ChecklistTest.countDocuments();

    const response = {
      error: false,
      foundTotal: total,
      checklistTotal,
      // page: page + 1,
      // limit,
      checklists: foundChecklists,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const getChecklistDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const checklist = await ChecklistTest.findById(id);

    if (!checklist) {
      return res.status(404).send({ error: "Checklist not found" });
    }

    res.status(200).json(checklist);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

const createChecklist = async (req, res) => {
  console.log(req.body);
  const {
    checklistName,
    birdName,
    count,
    selectedDate,
    selectedTime,
    currentLocation,
    birder,
    endpointLocation,
    photos,
  } = req.body;

  if (!checklistName) {
    return res.status(400).json({ message: "Checklist name is required" });
  }

  try {
    const newChecklist = new ChecklistTest({
      checklistName,
      birdName,
      count,
      selectedDate: new Date(selectedDate),
      selectedTime,
      currentLocation,
      birder,
      endpointLocation,
      photos: [],
    });

    if (photos[0]) {
      const uploadedResponse = await cloudinary.uploader.upload(photos[0], {
        upload_preset: "druk-ebird-checklists",
      });

      console.log("uploaded: ", uploadedResponse);

      if (uploadedResponse) {
        newChecklist.photos.push({
          url: uploadedResponse.secure_url,
        });
      }
    }

    console.log("new checklist: ", newChecklist);

    const savedChecklist = await newChecklist.save();
    res.status(201).json({
      data: savedChecklist,
      message: "Checklist created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteChecklist = async (req, res) => {
  const { id } = req.params;

  try {
    const checklist = await ChecklistTest.findByIdAndDelete(id);

    if (!checklist) {
      return res.status(404).send({ error: "Checklist not found" });
    }
    res.status(200).json({ message: "Checklist deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

async function uploadPhoto(photoPath) {
  try {
    const result = await cloudinary.uploader.upload(photoPath, {
      upload_preset: "druk-ebird-checklists",
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

const uploadExcelFile = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const checklistData = xlsx.utils.sheet_to_json(worksheet);

    console.log(checklistData);

    let checklists = [];

    for (const data of checklistData) {
      let photoUrls = [];
      if (data.Photos) {
        const photoArray = JSON.parse(data.Photos.replace(/'/g, ""));
        photoUrls = await uploadPhotos(photoArray);
      }

      const checklist = new ChecklistTest({
        checklistName: data.ChecklistName,
        birdName: data.BirdName,
        count: {
          adult: data.Adult,
          juvenile: data.Juvenile,
          total: data.Total,
        },
        selectedDate: new Date(data.SelectedDate),
        selectedTime: data.SelectedTime,
        currentLocation: {
          latitude: data.Latitude,
          longitude: data.Longitude,
        },
        birder: data.Birder,
        endpointLocation: data.EndpointLocation,
        photos: photoUrls.map((url) => ({ url })),
      });

      checklists.push(checklist);
    }

    const result = await ChecklistTest.insertMany(checklists);

    console.log(`Uploaded ${result.length} checklists successfully!`);

    res.status(201).json({
      data: checklistData,
      message: "Checklists uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload checklists" });
  }
};

// Handle the request to analyze checklists
const analyzeChecklists = (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Perform the analysis

    // Find the top birders by counting the number of checklists submitted by each birder
    const birderCounts = {};
    jsonData.forEach((row) => {
      const birder = row.Birder;
      birderCounts[birder] = (birderCounts[birder] || 0) + 1;
    });

    // Get the top 5 birders with their checklist counts
    const topBirders = Object.keys(birderCounts)
      .sort((a, b) => birderCounts[b] - birderCounts[a])
      .slice(0, 5)
      .map((birder) => ({
        name: birder,
        checklistCount: birderCounts[birder],
      }));

    // Find the location with the highest number of birds
    const locationCounts = {};
    jsonData.forEach((row) => {
      const location = row.Location;
      locationCounts[location] = (locationCounts[location] || 0) + row.Total;
    });

    // Get the location with the highest number of birds
    const highestBirdsLocation = Object.keys(locationCounts).reduce((a, b) =>
      locationCounts[a] > locationCounts[b] ? a : b
    );

    // Prepare the result
    const analysisResult = {
      topBirders,
      highestBirdsLocation,
    };
    console.log(analysisResult);

    // Send the result to the frontend
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Error analyzing checklists:", error);
    res.status(500).json({ message: "Error analyzing checklists" });
  }
};

export {
  getAllChecklist,
  getChecklistDetail,
  createChecklist,
  deleteChecklist,
  uploadExcelFile,
  analyzeChecklists,
};
