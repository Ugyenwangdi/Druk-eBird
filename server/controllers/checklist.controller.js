import xlsx from "xlsx";

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

export { analyzeChecklists };
