import Birder from "../mongodb/models/user.js";

const getAllBirders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    let search = req.query.search || "";
    let country = req.query.country || "All";

    const countryOptions = ["Bhutan"];

    country === "All"
      ? (country = [...countryOptions])
      : (country = req.query.order.split(","));

    let searchQuery = {
      name: { $regex: search, $options: "i" },
    };

    const foundBirders = await Birder.find({
      ...searchQuery,
    })
      .where("country")
      .in([...country])
      .skip(page * limit)
      .limit(limit);
    // .sort({ createdAt: -1 });

    const total = await Birder.countDocuments({
      ...searchQuery,
      country: { $in: [...country] },
    });

    const birderTotal = await Birder.countDocuments();
    // console.log(`Total number of species: ${speciesTotal}`);

    const response = {
      error: false,
      foundTotal: total,
      birderTotal,
      page: page + 1,
      limit,

      species: foundBirders,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export { getAllBirders };
