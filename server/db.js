import { MongoClient } from "mongodb";
import dotenv from "dotenv";

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

  return dbInstance;
}

export async function getDB() {
  if (!dbInstance) await connectDB();
  return dbInstance;
}
