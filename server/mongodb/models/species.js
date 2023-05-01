import mongoose from "mongoose";

const speciesSchema = new mongoose.Schema(
  {
    englishName: { type: String, required: true },
    scientificName: { type: String, required: false },
    order: { type: String, required: false },
    familyName: { type: String, required: false },
    genus: { type: String, required: false },
    species: { type: String, required: false },
    authority: { type: String, required: false },
    group: { type: String, required: false },
    dzongkhaName: { type: String, required: false },
    lhoName: { type: String, required: false },
    sharName: { type: String, required: false },
    khengName: { type: String, required: false },
    iucnStatus: { type: String, required: false },
    citesAppendix: { type: String, required: false },
    bhutanSchedule: { type: String, required: false },
    residency: { type: String, required: false },
    habitat: { type: String, required: false },
    description: { type: String, required: false },
    observations: { type: Number, required: false },
    photos: [{ url: { type: String } }],
  },
  { _id: true, timestamps: true }
);

const Species = mongoose.model("Species", speciesSchema);

export default Species;

// import mongoose from "mongoose";

// const speciesSchema = new mongoose.Schema(
//   {
//     englishName: { type: String, required: true },
//     scientificName: { type: String, required: false },
//     order: { type: String, required: false },
//     familyName: { type: String, required: false },
//     genus: { type: String, required: false },
//     species: { type: String, required: false },
//     authority: { type: String, required: false },
//     group: { type: String, required: false },
//     dzongkhaName: { type: String, required: false },
//     lhoName: { type: String, required: false },
//     sharName: { type: String, required: false },
//     khengName: { type: String, required: false },
//     iucnStatus: { type: String, required: false },
//     citesAppendix: { type: String, required: false },
//     bhutanSchedule: { type: String, required: false },
//     residency: { type: String, required: false },
//     habitat: { type: String, required: false },
//     migrationStatus: {
//       type: String,
//       enum: ["", "Migratory", "Non-migratory"],
//       required: false,
//     },
//     birdType: {
//       type: String,
//       enum: ["", "Waterbird", "Landbird", "Seabird"],
//       required: false,
//     },
//     description: { type: String, required: false },
//     observations: { type: Number, required: false },
//     photos: [{ url: { type: String } }],
//   },
//   { _id: true, timestamps: true }
// );

// const Species = mongoose.model("Species", speciesSchema);

// export default Species;
