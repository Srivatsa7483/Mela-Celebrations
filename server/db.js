import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { designs as seedDesigns, categories as seedCategories } from "../src/data/index.js";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables.");
}

let client;
let dbInstance;

export async function connectDB() {
  if (dbInstance) return dbInstance;
  client = new MongoClient(uri);
  await client.connect();
  dbInstance = client.db(process.env.MONGODB_DB_NAME || "mela-celebrations");
  console.log("✅ Connected to MongoDB Atlas");

  // Seed coupons if empty
  const couponsCol = dbInstance.collection("coupons");
  const count = await couponsCol.countDocuments();
  if (count === 0) {
    await couponsCol.insertMany([
      { code: "WELCOME10",  type: "percentage",    value: 10, description: "10% off on your first booking!" },
      { code: "MELA20",     type: "percentage",    value: 20, description: "Mela Celebrations special 20% off!" },
      { code: "FESTIVE15",  type: "percentage",    value: 15, description: "Festive season 15% off!" },
      { code: "SPINWIN10",  type: "percentage",    value: 10, description: "Spin Wheel Reward: 10% Off!" },
      { code: "SPINWIN20",  type: "percentage",    value: 20, description: "Spin Wheel Reward: 20% Off!" },
      { code: "SPINPHOTO50",type: "photography_50",value: 0,  description: "Spin Wheel Reward: 50% Off on Photography!" },
      { code: "SUPER2",     type: "flat",          value: 2000, description: "Flat ₹2,000 off on premium setups!" },
    ]);
    console.log("🌱 Coupons seeded into MongoDB");
  }

  // Seed categories if empty
  const categoriesCol = dbInstance.collection("categories");
  const categoriesCount = await categoriesCol.countDocuments();
  if (categoriesCount === 0) {
    await categoriesCol.insertMany(seedCategories);
    console.log("🌱 Categories seeded into MongoDB");
  }

  // Seed designs if empty
  const designsCol = dbInstance.collection("designs");
  const designsCount = await designsCol.countDocuments();
  if (designsCount === 0) {
    await designsCol.insertMany(seedDesigns);
    console.log("🌱 Designs seeded into MongoDB");
  }

  // Clean up kidsactivities dropdown in existing database
  await categoriesCol.updateOne(
    { id: "kidsactivities" },
    { $unset: { dropdown: "" } }
  );
  console.log("🧹 Kids Activities dropdown unset from MongoDB");

  return dbInstance;
}

export async function getDB() {
  if (!dbInstance) await connectDB();
  return dbInstance;
}

