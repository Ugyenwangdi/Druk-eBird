import User from "../mongodb/models/user.js";
import Birder from "../mongodb/models/user.js";

const getBirdersCount = async (req, res) => {
  try {
    const count = await Birder.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve count" });
  }
};

const getAllBirders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    let birder = req.query.birder || "";
    let country = req.query.country || "";

    let searchQuery = {
      name: { $regex: birder, $options: "i" },
      country: { $regex: country, $options: "i" },
    };

    if (birder) {
      searchQuery["name"] = {
        $regex: birder,
        $options: "i",
      };
    }

    if (country) {
      searchQuery["country"] = {
        $regex: `^${country}`,
        $options: "i",
      };
    }

    const foundBirders = await Birder.find({
      ...searchQuery,
    })
      .skip(page * limit)
      .limit(limit);
    // .sort({ createdAt: -1 });

    const total = await Birder.countDocuments({
      ...searchQuery,
    });

    const birderTotal = await Birder.countDocuments();
    // console.log(`Total number of species: ${speciesTotal}`);
    const distinctCountries = await getDistinctCountries();

    const response = {
      error: false,
      foundTotal: total,
      birderTotal,
      page: page + 1,
      limit,

      users: foundBirders,
      distinctCountries,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getDistinctCountries = async () => {
  try {
    const distinctCountries = await Birder.distinct("country");

    return distinctCountries;
  } catch (error) {
    console.error("Error retrieving distinct observers:", error);
    throw error;
  }
};

export { getBirdersCount, getAllBirders };
