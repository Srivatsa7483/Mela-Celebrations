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

  // Seed recent projects if empty
  const recentProjectsCol = dbInstance.collection("recent_projects");
  const recentProjectsCount = await recentProjectsCol.countDocuments();
  if (recentProjectsCount === 0) {
    await recentProjectsCol.insertMany(seedRecentProjects);
    console.log("🌱 Recent Projects seeded into MongoDB");
  }

  // Clean up kidsactivities dropdown in existing database
  await categoriesCol.updateOne(
    { id: "kidsactivities" },
    { $unset: { dropdown: "" } }
  );
  console.log("🧹 Kids Activities dropdown unset from MongoDB");

  return dbInstance;
}

const seedRecentProjects = [
  {
    id: 1,
    title: "Pastel Pink Canopy Forest",
    category: "birthday",
    venue: "Whitefield Clubhouse, Bangalore",
    date: "May 12, 2026",
    desc: "A massive balloon archway in rose gold and matte pink with custom LED name boards.",
    image: "/b1.jpg",
    review: "Absolutely stunning! The kids loved the double arch sequin wall. Highly recommend! - Priya S.",
    cost: "₹18,500"
  },
  {
    id: 2,
    title: "Safari Animal Kingdom Kids Setup",
    category: "birthday",
    venue: "Prestige Ferns Residency, Bangalore",
    date: "April 28, 2026",
    desc: "Organic forest balloon combinations with standing cardboard giraffe and lion cutouts.",
    image: "/b2.jpg",
    review: "Very professional team. They finished the setup 1 hour before the party. - Rakesh K.",
    cost: "₹24,000"
  },
  {
    id: 3,
    title: "Golden Sequin Candlelight Romance",
    category: "anniversary",
    venue: "Sheraton Grand, Whitefield",
    date: "May 08, 2026",
    desc: "Glittering sequin walls draped with warm fairy lights and custom rose bouquets.",
    image: "/a1.jpg",
    review: "The candlelight dinner setup was magical. My wife was completely surprised! - Amit V.",
    cost: "₹15,000"
  },
  {
    id: 4,
    title: "Royal Golden Glow Anniversary",
    category: "anniversary",
    venue: "Private Villa, HSR Layout",
    date: "May 18, 2026",
    desc: "Elegant gold metallic balloons with premium white rose floral arrangements.",
    image: "/a2.jpg",
    review: "Splendid execution. The floral arches looked and smelled incredibly fresh. - Divya N.",
    cost: "₹21,000"
  },
  {
    id: 5,
    title: "Luxury Car Boot Surprise Setup",
    category: "decorations",
    venue: "Phoenix Marketcity Parking, Mahadevapura",
    date: "April 15, 2026",
    desc: "Custom surprise banner mounted on sedan trunk with LED lights and heart helium balloons.",
    image: "/c1.jpg",
    review: "Perfect surprise! The photos came out amazing. Very quick setup. - Nikhil P.",
    cost: "₹6,500"
  },
  {
    id: 6,
    title: "Enchanted Garden Baby Shower Canopy",
    category: "decorations",
    venue: "Acro House, Indiranagar",
    date: "May 02, 2026",
    desc: "Delicate pastel green canopy with butterfly clips and paper flower clusters.",
    image: "/b3.jpg",
    review: "Exactly like the Pinterest references we shared. Loved every detail! - Sneha M.",
    cost: "₹19,000"
  }
];

export async function getDB() {
  if (!dbInstance) await connectDB();
  return dbInstance;
}

