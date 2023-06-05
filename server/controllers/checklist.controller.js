import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import xlsx from "xlsx";

import checkList from "../mongodb/models/checklist.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getChecklistCount = async (req, res) => {
  try {
    const count = await ChecklistTest.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve count" });
  }
};

const getAllEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const startsWith = req.query.starts_with || "";
    const search = req.query.search || "";

    let searchQuery = {
      "StartbirdingData.status": "submittedchecklist",
      "StartbirdingData.Approvedstatus": "approved",
      "StartbirdingData.BirdName": { $ne: "Unknown Birds" },
    };

    if (startsWith) {
      searchQuery.$or = [
        { CheckListName: { $regex: `^${startsWith}`, $options: "i" } },
        { CheckListName: { $regex: `.* ${startsWith}`, $options: "i" } },
      ];
    } else if (search) {
      searchQuery.$or = [
        { CheckListName: { $regex: search, $options: "i" } },
        { BirdName: { $regex: search, $options: "i" } },
        {
          "StartbirdingData.EndpointLocation.dzongkhag": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "StartbirdingData.EndpointLocation.gewog": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "StartbirdingData.EndpointLocation.village": {
            $regex: search,
            $options: "i",
          },
        },
        { "StartbirdingData.observer": { $regex: search, $options: "i" } },
      ];
    }

    const foundChecklists = await ChecklistTest.find(searchQuery)
      .skip(page * limit)
      .limit(limit)
      .sort({ "StartbirdingData.selectedDate": -1 })
      .maxTimeMS(30000);

    const total = await ChecklistTest.countDocuments(searchQuery);
    const entriesTotal = await ChecklistTest.countDocuments({
      "StartbirdingData.status": "submittedchecklist",
      "StartbirdingData.Approvedstatus": "approved",
      "StartbirdingData.BirdName": { $ne: "Unknown Birds" },
    });
    const checklistTotal = await ChecklistTest.countDocuments();

    const response = {
      error: false,
      foundTotal: total,
      entriesTotal: entriesTotal,
      checklistTotal,
      page: page + 1,
      limit,
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
    const checklist = await ChecklistTest.findById(id).maxTimeMS(30000);

    if (!checklist) {
      return res.status(404).send({ error: "Checklist not found" });
    }

    res.status(200).json(checklist);
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

const createChecklist = async (req, res) => {
  console.log(req.body);
  const { CheckListName, BirdName, StartbirdingData } = req.body;

  if (!CheckListName) {
    return res.status(400).json({ message: "Checklist name is required" });
  }

  try {
    const newChecklist = new ChecklistTest({
      CheckListName,
      BirdName,
      StartbirdingData,
    });

    if (StartbirdingData && StartbirdingData[0].photo) {
      const photoUrl = await uploadPhoto(StartbirdingData[0].photo);
      newChecklist.StartbirdingData[0].photo = photoUrl;
    }

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

const updateChecklist = async (req, res) => {
  const { id } = req.params;
  const {
    CheckListName,
    BirdName,
    status,
    selectedDate,
    selectedTime,
    observer,
    latitude,
    longitude,
    adult,
    juvenile,
    total,
    approvalStatus,
    photo,
    dzongkhag,
    gewog,
    village,
  } = req.body;

  console.log(BirdName);

  try {
    const checklist = await ChecklistTest.findById(id).maxTimeMS(30000);

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    checklist.CheckListName = CheckListName || checklist.CheckListName;
    checklist.BirdName = BirdName || checklist.BirdName;

    if (checklist.StartbirdingData && checklist.StartbirdingData.length > 0) {
      const startBirdingData = checklist.StartbirdingData[0];
      startBirdingData.status = status || startBirdingData.status;
      startBirdingData.selectedDate =
        selectedDate || startBirdingData.selectedDate;
      startBirdingData.selectedTime =
        selectedTime || startBirdingData.selectedTime;
      startBirdingData.observer = observer || startBirdingData.observer;

      if (startBirdingData.currentLocation) {
        startBirdingData.currentLocation.latitude =
          latitude || startBirdingData.currentLocation.latitude;
        startBirdingData.currentLocation.longitude =
          longitude || startBirdingData.currentLocation.longitude;
      }

      startBirdingData.JAcount.Adult = adult || startBirdingData.JAcount.Adult;
      startBirdingData.JAcount.Juvenile =
        juvenile || startBirdingData.JAcount.Juvenile;
      startBirdingData.Totalcount = total || startBirdingData.Totalcount;

      startBirdingData.Approvedstatus =
        approvalStatus || startBirdingData.Approvedstatus;

      if (photo) {
        const photoUrl = await uploadPhoto(photo);
        startBirdingData.photo = photoUrl;
      }

      if (
        startBirdingData.EndpointLocation &&
        startBirdingData.EndpointLocation.length > 0
      ) {
        const endpointLocation = startBirdingData.EndpointLocation[0];
        endpointLocation.dzongkhag = dzongkhag || endpointLocation.dzongkhag;
        endpointLocation.gewog = gewog || endpointLocation.gewog;
        endpointLocation.village = village || endpointLocation.village;
      }
    }

    const updatedChecklist = await checklist.save();
    res.status(200).json({
      data: updatedChecklist,
      message: "Checklist updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteChecklist = async (req, res) => {
  const { id } = req.params;

  try {
    const checklist = await ChecklistTest.findByIdAndDelete(id).maxTimeMS(
      30000
    );

    if (!checklist) {
      return res.status(404).send({ error: "Checklist not found" });
    }
    res.status(200).json({ message: "Checklist deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

const uploadExcelFile = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const checklistData = xlsx.utils.sheet_to_json(worksheet);

    console.log(checklistData);

    let checklists = [];

    for (const data of checklistData) {
      let photoUrl = "";
      if (data.Photos) {
        photoUrl = await uploadPhoto(data.Photos);
      }

      const checklist = new ChecklistTest({
        CheckListName: data.ChecklistName,
        BirdName: data.BirdName,
        StartbirdingData: [
          {
            status: "submittedchecklist",
            selectedDate: new Date(data.SelectedDate),
            selectedTime: data.SelectedTime,
            observer: data.Birder,
            currentLocation: {
              latitude: data.Latitude,
              longitude: data.Longitude,
            },
            Approvedstatus: "approved",
            TotalCount: data.Total,
            JAcount: {
              adult: data.Adult,
              juvenile: data.Juvenile,
            },
            photo: photoUrl,
            EndpointLocation: [
              {
                dzongkhag: data.EndpointLocation,
                gewog: data.EndpointLocation,
                village: data.EndpointLocation,
              },
            ],
          },
        ],
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

const getChecklists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const startsWith = req.query.starts_with || "";
    const search = req.query.search || "";

    let searchQuery = {
      "StartbirdingData.status": "submittedchecklist",
      // "StartbirdingData.Approvedstatus": "approved",
      BirdName: {
        $ne: "Unknown Birds",
        $not: { $regex: "New bird", $options: "i" },
      },
    };

    if (startsWith) {
      searchQuery.$or = [
        { CheckListName: { $regex: `^${startsWith}`, $options: "i" } },
        { CheckListName: { $regex: `.* ${startsWith}`, $options: "i" } },
      ];
    } else if (search) {
      searchQuery.$or = [
        { CheckListName: { $regex: search, $options: "i" } },
        { BirdName: { $regex: search, $options: "i" } },
        {
          "StartbirdingData.EndpointLocation.dzongkhag": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "StartbirdingData.EndpointLocation.gewog": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "StartbirdingData.EndpointLocation.village": {
            $regex: search,
            $options: "i",
          },
        },
        { "StartbirdingData.observer": { $regex: search, $options: "i" } },
      ];
    }
    const groupedChecklists = await ChecklistTest.aggregate([
      { $match: searchQuery },
      {
        $group: {
          _id: {
            checklistName: "$CheckListName",
            observer: "$StartbirdingData.observer",
            selectedDate: "$StartbirdingData.selectedDate",
            selectedTime: "$StartbirdingData.selectedTime",
            dzongkhag: "$StartbirdingData.EndpointLocation.dzongkhag",
            gewog: "$StartbirdingData.EndpointLocation.gewog",
            village: "$StartbirdingData.EndpointLocation.village",
          },
          entries: { $push: "$$ROOT" },
        },
      },
      // Unwind the array fields before sorting
      { $unwind: "$entries" },
      // Sort by selectedDate and selectedTime
      {
        $sort: {
          "entries.StartbirdingData.selectedDate": -1,
          "entries.StartbirdingData.selectedTime": -1,
        },
      },
      // Group again to regroup the sorted entries
      {
        $group: {
          _id: {
            checklistName: "$_id.checklistName",
            observer: "$_id.observer",
            selectedDate: "$_id.selectedDate",
            dzongkhag: "$_id.dzongkhag",
            gewog: "$_id.gewog",
            village: "$_id.village",
          },
          entries: { $push: "$entries" },
        },
      },
      { $skip: page * limit },
      { $limit: limit },
    ]);

    const totalGroupedChecklists = await ChecklistTest.aggregate([
      { $match: searchQuery },
      {
        $group: {
          _id: {
            checklistName: "$CheckListName",
            observer: "$StartbirdingData.observer",
            selectedDate: "$StartbirdingData.selectedDate",
            selectedTime: "$StartbirdingData.selectedTime",
            dzongkhag: "$StartbirdingData.EndpointLocation.dzongkhag",
            gewog: "$StartbirdingData.EndpointLocation.gewog",
            village: "$StartbirdingData.EndpointLocation.village",
          },
          entries: { $push: "$$ROOT" },
        },
      },
    ]);

    const foundTotal = groupedChecklists.length;
    const totalChecklists = totalGroupedChecklists.length;
    const entriesTotal = await ChecklistTest.countDocuments(searchQuery);

    const response = {
      error: false,
      foundTotal: foundTotal,
      entriesTotal: entriesTotal,
      totalChecklists,
      page: page + 1,
      limit,
      checklists: groupedChecklists,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getNewSpecies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const startsWith = req.query.starts_with || "";
    const search = req.query.search || "";

    let searchQuery = {
      "StartbirdingData.status": "submittedchecklist",
      $or: [
        { BirdName: { $regex: "New bird", $options: "i" } },
        { BirdName: "Unknown Birds" },
      ],
    };

    if (startsWith) {
      searchQuery.$or = [
        { CheckListName: { $regex: `^${startsWith}`, $options: "i" } },
        { CheckListName: { $regex: `.* ${startsWith}`, $options: "i" } },
      ];
    } else if (search) {
      searchQuery.$or = [
        { CheckListName: { $regex: search, $options: "i" } },
        { BirdName: { $regex: search, $options: "i" } },
        {
          "StartbirdingData.EndpointLocation.dzongkhag": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "StartbirdingData.EndpointLocation.gewog": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "StartbirdingData.EndpointLocation.village": {
            $regex: search,
            $options: "i",
          },
        },
        { "StartbirdingData.observer": { $regex: search, $options: "i" } },
      ];
    }
    const groupedChecklists = await ChecklistTest.aggregate([
      { $match: searchQuery },
      {
        $group: {
          _id: {
            checklistName: "$CheckListName",
            observer: "$StartbirdingData.observer",
            selectedDate: "$StartbirdingData.selectedDate",
            selectedTime: "$StartbirdingData.selectedTime",
            dzongkhag: "$StartbirdingData.EndpointLocation.dzongkhag",
            gewog: "$StartbirdingData.EndpointLocation.gewog",
            village: "$StartbirdingData.EndpointLocation.village",
          },
          entries: { $push: "$$ROOT" },
        },
      },
      // Unwind the array fields before sorting
      { $unwind: "$entries" },
      // Sort by selectedDate and selectedTime
      {
        $sort: {
          "entries.StartbirdingData.selectedDate": -1,
          "entries.StartbirdingData.selectedTime": -1,
        },
      },
      // Group again to regroup the sorted entries
      {
        $group: {
          _id: {
            checklistName: "$_id.checklistName",
            observer: "$_id.observer",
            selectedDate: "$_id.selectedDate",
            dzongkhag: "$_id.dzongkhag",
            gewog: "$_id.gewog",
            village: "$_id.village",
          },
          entries: { $push: "$entries" },
        },
      },
      { $skip: page * limit },
      { $limit: limit },
    ]);

    const totalGroupedChecklists = await ChecklistTest.aggregate([
      { $match: searchQuery },
      {
        $group: {
          _id: {
            checklistName: "$CheckListName",
            observer: "$StartbirdingData.observer",
            selectedDate: "$StartbirdingData.selectedDate",
            selectedTime: "$StartbirdingData.selectedTime",
            dzongkhag: "$StartbirdingData.EndpointLocation.dzongkhag",
            gewog: "$StartbirdingData.EndpointLocation.gewog",
            village: "$StartbirdingData.EndpointLocation.village",
          },
          entries: { $push: "$$ROOT" },
        },
      },
    ]);

    const foundTotal = groupedChecklists.length;
    const totalChecklists = totalGroupedChecklists.length;
    const entriesTotal = await ChecklistTest.countDocuments(searchQuery);

    const response = {
      error: false,
      foundTotal: foundTotal,
      entriesTotal: entriesTotal,
      totalChecklists,
      page: page + 1,
      limit,
      checklists: groupedChecklists,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// const getNewSpecies = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) - 1 || 0;
//     const limit = parseInt(req.query.limit) || 6;
//     const startsWith = req.query.starts_with || "";
//     const search = req.query.search || "";

//     let searchQuery = {
//       "StartbirdingData.status": "submittedchecklist",
//       BirdName: "Unknown Birds",
//     };

//     if (startsWith) {
//       searchQuery.$or = [
//         { CheckListName: { $regex: `^${startsWith}`, $options: "i" } },
//         { CheckListName: { $regex: `.* ${startsWith}`, $options: "i" } },
//       ];
//     } else if (search) {
//       searchQuery.$or = [
//         { CheckListName: { $regex: search, $options: "i" } },
//         { BirdName: { $regex: search, $options: "i" } },
//         {
//           "StartbirdingData.EndpointLocation.dzongkhag": {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         {
//           "StartbirdingData.EndpointLocation.gewog": {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         {
//           "StartbirdingData.EndpointLocation.village": {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         { "StartbirdingData.observer": { $regex: search, $options: "i" } },
//       ];
//     }

//     const groupedChecklists = await ChecklistTest.aggregate([
//       { $match: searchQuery },
//       {
//         $group: {
//           _id: {
//             checklistName: "$CheckListName",
//             observer: "$StartbirdingData.observer",
//             selectedDate: "$StartbirdingData.selectedDate",
//             selectedTime: "$StartbirdingData.selectedTime",
//             dzongkhag: "$StartbirdingData.EndpointLocation.dzongkhag",
//             gewog: "$StartbirdingData.EndpointLocation.gewog",
//             village: "$StartbirdingData.EndpointLocation.village",
//           },
//           entries: { $push: "$$ROOT" },
//         },
//       },
//       { $unwind: "$entries" },
//       {
//         $sort: {
//           "entries.StartbirdingData.selectedDate": -1,
//           "entries.StartbirdingData.selectedTime": -1,
//         },
//       },
//       {
//         $group: {
//           _id: {
//             checklistName: "$_id.checklistName",
//             observer: "$_id.observer",
//             selectedDate: "$_id.selectedDate",
//             dzongkhag: "$_id.dzongkhag",
//             gewog: "$_id.gewog",
//             village: "$_id.village",
//           },
//           entries: { $push: "$entries" },
//         },
//       },
//       { $skip: page * limit },
//       { $limit: limit },
//     ]);

//     const totalGroupedChecklists = await ChecklistTest.aggregate([
//       { $match: searchQuery },
//       {
//         $group: {
//           _id: {
//             checklistName: "$CheckListName",
//             observer: "$StartbirdingData.observer",
//             selectedDate: "$StartbirdingData.selectedDate",
//             selectedTime: "$StartbirdingData.selectedTime",
//             dzongkhag: "$StartbirdingData.EndpointLocation.dzongkhag",
//             gewog: "$StartbirdingData.EndpointLocation.gewog",
//             village: "$StartbirdingData.EndpointLocation.village",
//           },
//           entries: { $push: "$$ROOT" },
//         },
//       },
//     ]);

//     const foundTotal = groupedChecklists.length;
//     const totalChecklists = totalGroupedChecklists.length;
//     const entriesTotal = await ChecklistTest.countDocuments(searchQuery);

//     const response = {
//       error: false,
//       foundTotal: foundTotal,
//       entriesTotal: entriesTotal,
//       totalChecklists,
//       page: page + 1,
//       limit,
//       checklists: groupedChecklists,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

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

const analyzeDistrictEntries = async (req, res) => {
  try {
    const checklists = await ChecklistTest.find().maxTimeMS(30000); // Increase timeout to 30 seconds

    // Calculate the number of checklists submitted in the current month
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
    const currentYear = new Date().getFullYear();
    const currentMonthChecklists = [];

    // Calculate the number of checklists submitted in the previous month
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1; // Get previous month (1-12)
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const previousMonthChecklists = [];

    checklists.forEach((checklist) => {
      const selectedDate = new Date(checklist.selectedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      if (month === currentMonth && year === currentYear) {
        currentMonthChecklists.push(checklist);
      } else if (month === previousMonth && year === previousYear) {
        previousMonthChecklists.push(checklist);
      }
    });

    // Calculate the percentage increase or decrease in checklist submissions
    const currentMonthCount = currentMonthChecklists.length;
    const previousMonthCount = previousMonthChecklists.length;
    const percentageChange =
      currentMonthCount !== 0 && previousMonthCount !== 0
        ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
        : 0;

    const changeResult = {
      currentMonthCount,
      previousMonthCount,
      percentageChange,
    };

    if (checklists.length === 0) {
      return res.status(404).json({ message: "No entries found." });
    }

    const monthlyData = {};

    checklists.forEach((checklist) => {
      const endpointLocation = checklist.endpointLocation.split(",")[0].trim();
      const selectedDate = new Date(checklist.selectedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      if (!monthlyData[year]) {
        monthlyData[year] = {};
      }

      if (!monthlyData[year][month]) {
        monthlyData[year][month] = {};
      }

      if (!monthlyData[year][month][endpointLocation]) {
        monthlyData[year][month][endpointLocation] = 0;
      }

      monthlyData[year][month][endpointLocation]++;
    });

    const result = [];

    for (const year in monthlyData) {
      for (const month in monthlyData[year]) {
        const monthData = monthlyData[year][month];
        const labels = Object.keys(monthData);
        const data = Object.values(monthData);

        // Sort labels and data arrays in descending order
        const sortedData = data.slice().sort((a, b) => b - a);
        const sortedLabels = labels
          .slice()
          .sort((a, b) => data[labels.indexOf(b)] - data[labels.indexOf(a)]);

        result.push({
          year: parseInt(year),
          month: parseInt(month),
          labels: sortedLabels,
          data: sortedData,
        });
      }
    }

    // Calculate the overall total count of checklists
    let overallTotalCount = 0;
    result.forEach((monthlyResult) => {
      monthlyResult.data.forEach((count) => {
        overallTotalCount += count;
      });
    });

    const responseData = {
      changeResult,
      result,
      overallTotalCount,
    };

    return res.json(responseData);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

const analyzeDistrictSpecies = async (req, res) => {
  try {
    const checklists = await ChecklistTest.find({
      "StartbirdingData.status": "submittedchecklist",
      "StartbirdingData.Approvedstatus": "approved",
      BirdName: { $ne: "Unknown Birds" },
    })
      .maxTimeMS(30000)
      .lean(); // Increase timeout to 30 seconds

    // Calculate the number of checklists submitted in the current month
    const currentMonth = new Date().getMonth(); // Get current month (0-11)
    const currentYear = new Date().getFullYear();
    const currentMonthChecklists = [];
    const currentMonthChecklistNames = new Set();

    // Calculate the number of checklists submitted in the previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Get previous month (0-11)
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthChecklists = [];
    const previousMonthChecklistNames = new Set();

    checklists.forEach((checklist) => {
      const checklistName = checklist.BirdName;
      const selectedDate = new Date(checklist.StartbirdingData[0].selectedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();

      if (month === currentMonth && year === currentYear) {
        if (!currentMonthChecklistNames.has(checklistName)) {
          currentMonthChecklists.push(checklist);
          currentMonthChecklistNames.add(checklistName);
        }
      } else if (month === previousMonth && year === previousYear) {
        if (!previousMonthChecklistNames.has(checklistName)) {
          previousMonthChecklists.push(checklist);
          previousMonthChecklistNames.add(checklistName);
        }
      }
    });

    // Calculate the percentage increase or decrease in checklist submissions
    const currentMonthCount = currentMonthChecklists.length;
    const previousMonthCount = previousMonthChecklists.length;
    const percentageChange =
      currentMonthCount !== 0 && previousMonthCount !== 0
        ? parseFloat(
            (
              ((currentMonthCount - previousMonthCount) / previousMonthCount) *
              100
            ).toFixed(2)
          )
        : 0;
    const changeResult = {
      currentMonthCount,
      previousMonthCount,
      percentageChange,
    };

    if (checklists.length === 0) {
      return res.status(404).json({ message: "No checklists found." });
    }

    const monthlyData = {};

    checklists.forEach((checklist) => {
      const endpointLocation =
        checklist.StartbirdingData[0].EndpointLocation[0].dzongkhag;
      const selectedDate = new Date(checklist.StartbirdingData[0].selectedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();

      if (!monthlyData[year]) {
        monthlyData[year] = {};
      }

      if (!monthlyData[year][month]) {
        monthlyData[year][month] = {};
      }

      if (!monthlyData[year][month][endpointLocation]) {
        monthlyData[year][month][endpointLocation] = new Set();
      }

      monthlyData[year][month][endpointLocation].add(checklist.BirdName);
    });

    const result = [];

    for (const year in monthlyData) {
      for (const month in monthlyData[year]) {
        const monthData = monthlyData[year][month];
        const labels = [];
        const data = [];
        const birdNames = {}; // Object to store bird names for each dzongkhag

        for (const endpointLocation in monthData) {
          const checklistNames = monthData[endpointLocation];
          labels.push(endpointLocation);
          data.push(checklistNames.size);
          birdNames[endpointLocation] = Array.from(checklistNames); // Store bird names as an array
        }

        // Sort labels and data arrays in descending order
        const sortedData = data.slice().sort((a, b) => b - a);
        const sortedLabels = labels
          .slice()
          .sort((a, b) => data[labels.indexOf(b)] - data[labels.indexOf(a)]);

        result.push({
          year: parseInt(year),
          month: getMonthName(parseInt(month)),
          labels: sortedLabels,
          data: sortedData,
          birdNames: birdNames, // Include bird names for each dzongkhag
        });
      }
    }

    // Calculate the overall total count of checklists
    let overallTotalCount = 0;
    result.forEach((monthlyResult) => {
      monthlyResult.data.forEach((count) => {
        overallTotalCount += count;
      });
    });

    const responseData = {
      changeResult,
      result,
      overallTotalCount,
    };

    return res.json(responseData);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

const analyzeDistrictChecklists = async (req, res) => {
  try {
    const checklists = await checkList
      .find({
        "StartbirdingData.status": "submittedchecklist",
        "StartbirdingData.Approvedstatus": "approved",
        BirdName: { $ne: "Unknown Birds" },
      })
      .maxTimeMS(30000); // Increase timeout to 30 seconds

    if (checklists.length === 0) {
      return res.status(404).json({ message: "No checklists found." });
    }

    const monthlyData = {};

    checklists.forEach((checklist) => {
      const checklistName = checklist.CheckListName;
      const endpointLocation =
        checklist.StartbirdingData[0].EndpointLocation[0].dzongkhag;
      const selectedDate = new Date(checklist.StartbirdingData[0].selectedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();

      if (!monthlyData[year]) {
        monthlyData[year] = {};
      }

      if (!monthlyData[year][month]) {
        monthlyData[year][month] = {};
      }

      if (!monthlyData[year][month][endpointLocation]) {
        monthlyData[year][month][endpointLocation] = new Set();
      }

      monthlyData[year][month][endpointLocation].add(checklistName);
    });

    const result = [];

    for (const year in monthlyData) {
      for (const month in monthlyData[year]) {
        const monthData = monthlyData[year][month];
        const labels = [];
        const data = [];

        for (const endpointLocation in monthData) {
          const checklistNames = monthData[endpointLocation];
          labels.push(endpointLocation);
          data.push(checklistNames.size);
        }

        // Sort labels and data arrays in descending order
        const sortedData = data.slice().sort((a, b) => b - a);
        const sortedLabels = labels
          .slice()
          .sort((a, b) => data[labels.indexOf(b)] - data[labels.indexOf(a)]);

        result.push({
          year: parseInt(year),
          month: getMonthName(parseInt(month)),
          labels: sortedLabels,
          data: sortedData,
        });
      }
    }

    // Calculate the overall total count of checklists
    let overallTotalCount = 0;
    result.forEach((monthlyResult) => {
      monthlyResult.data.forEach((count) => {
        overallTotalCount += count;
      });
    });

    // Get the current month and previous month data from the result array
    const currentMonthData = result.find(
      (monthlyResult) =>
        monthlyResult.year === new Date().getFullYear() &&
        monthlyResult.month === getMonthName(new Date().getMonth())
    );
    const previousMonthData = result.find(
      (monthlyResult) =>
        monthlyResult.year === new Date().getFullYear() &&
        monthlyResult.month ===
          getMonthName(
            new Date().getMonth() - 1 >= 0 ? new Date().getMonth() - 1 : 11
          )
    );

    // Get the count of checklists for the current month
    const currentMonthCount = currentMonthData
      ? currentMonthData.data.reduce((sum, count) => sum + count, 0)
      : 0;

    // Get the count of checklists for the previous month
    const previousMonthCount = previousMonthData
      ? previousMonthData.data.reduce((sum, count) => sum + count, 0)
      : 0;

    // Calculate the percentage change
    const percentageChange =
      previousMonthCount !== 0
        ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
        : 0;

    const changeResult = {
      currentMonthCount,
      previousMonthCount,
      percentageChange,
    };

    const responseData = {
      changeResult,
      result,
      overallTotalCount,
    };

    return res.json(responseData);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Helper function to get the month name
function getMonthName(month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
}

const getTotalBirdingSites = async (req, res) => {
  try {
    // Query the database to get all documents
    const checklists = await checkList
      .find({
        "StartbirdingData.status": "submittedchecklist",
        "StartbirdingData.Approvedstatus": "approved",
        BirdName: { $ne: "Unknown Birds" },
      })
      .maxTimeMS(30000);

    const uniqueLocations = [];

    checklists.forEach((checklist) => {
      checklist.StartbirdingData.forEach((detail) => {
        detail.EndpointLocation.forEach((location) => {
          const existingLocation = uniqueLocations.find(
            (uniqueLocation) =>
              uniqueLocation.dzongkhag === location.dzongkhag &&
              uniqueLocation.gewog === location.gewog &&
              uniqueLocation.village === location.village
          );

          if (!existingLocation) {
            uniqueLocations.push(location);
          }
        });
      });
    });

    // Count the number of unique locations
    const count = uniqueLocations.length;

    return res.json({ count, uniqueLocations });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const analyzeTopBirders = async (req, res) => {
  try {
    const topBirders = await checkList.aggregate([
      {
        $group: {
          _id: "$StartbirdingData.observer",
          totalChecklists: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalChecklists: -1,
        },
      },
      {
        $project: {
          _id: 0,
          birder: "$_id",
          totalChecklists: 1,
        },
      },
    ]);

    res.json(topBirders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get top birders" });
  }
};

// Controller function to get bird counts by month
const getSpeciesCountsByMonth = async (req, res) => {
  try {
    const checklists = await ChecklistTest.find({
      "StartbirdingData.status": "submittedchecklist",
      "StartbirdingData.Approvedstatus": "approved",
      BirdName: { $ne: "Unknown Birds" },
    }).maxTimeMS(30000);

    // Group checklists by year
    const groupedChecklists = {};
    checklists.forEach((checklist) => {
      const year = new Date(checklist.createdAt).getFullYear();
      const month = new Date(checklist.createdAt).getMonth() + 1; // Month is zero-indexed, so add 1 to get the actual month

      if (!groupedChecklists[year]) {
        groupedChecklists[year] = {};
      }

      if (!groupedChecklists[year][month]) {
        groupedChecklists[year][month] = new Set();
      }

      groupedChecklists[year][month].add(checklist.BirdName);
    });

    // Calculate unique bird name counts for each month
    const speciesCountsByMonth = {};
    for (const year in groupedChecklists) {
      speciesCountsByMonth[year] = {};
      for (const month in groupedChecklists[year]) {
        speciesCountsByMonth[year][month] = groupedChecklists[year][month].size;
      }
    }

    return res.status(200).json(speciesCountsByMonth);
  } catch (error) {
    console.error("Error grouping checklists by year:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  getChecklistCount,
  getAllEntries,
  getChecklistDetail,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  uploadExcelFile,
  getChecklists,
  getNewSpecies,
  analyzeChecklists,
  analyzeDistrictSpecies,
  analyzeDistrictChecklists,
  analyzeDistrictEntries,
  getTotalBirdingSites,
  analyzeTopBirders,
  getSpeciesCountsByMonth,
};
