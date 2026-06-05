import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "mela-celebrations";

async function run() {
  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    console.log(`✅ Connected to database: ${dbName}`);

    // 1. Remove candlelight category
    console.log("Removing candlelight category...");
    const catResult = await db.collection("categories").deleteOne({ id: "candlelight" });
    console.log(`Deleted categories count: ${catResult.deletedCount}`);

    // 2. Remove Intimate Candlelight Dinner design (ID 9 or "9")
    console.log("Removing Intimate Candlelight Dinner design (ID 9)...");
    const design9Result = await db.collection("designs").deleteOne({ id: { $in: [9, "9"] } });
    console.log(`Deleted designs count: ${design9Result.deletedCount}`);

    // 3. Re-categorize Starlight Garden Gala design (ID 3 or "3") to anniversary
    console.log("Re-categorizing Starlight Garden Gala (ID 3) to anniversary...");
    const design3Result = await db.collection("designs").updateOne(
      { id: { $in: [3, "3"] } },
      { 
        $set: { 
          category: "anniversary",
          categoryName: "Anniversary Decorations"
        } 
      }
    );
    console.log(`Updated design 3:`, design3Result);

    // Also update features of design 3 in MongoDB if they contain Mirrored Dining Tables
    const d3 = await db.collection("designs").findOne({ id: { $in: [3, "3"] } });
    if (d3 && d3.features) {
      const updatedFeatures = d3.features.map(f => 
        f.trim() === "Mirrored Dining Tables" ? "Mirrored Styling Tables" : f
      );
      await db.collection("designs").updateOne(
        { _id: d3._id },
        { $set: { features: updatedFeatures } }
      );
      console.log(`Updated features of design 3:`, updatedFeatures);
    }

    // 4. Delete any other design that might still have candlelight category in MongoDB
    console.log("Checking for any other designs with candlelight category...");
    const restDesignsResult = await db.collection("designs").deleteMany({ category: "candlelight" });
    console.log(`Deleted other candlelight designs count: ${restDesignsResult.deletedCount}`);

    // 5. Update recent projects database entry for ID 3
    console.log("Updating recent projects to remove candlelight references...");
    const project3Result = await db.collection("recent_projects").updateOne(
      { id: { $in: [3, "3"] } },
      { 
        $set: { 
          title: "Golden Sequin Anniversary Romance",
          review: "The anniversary setup was magical. My wife was completely surprised! - Amit V."
        } 
      }
    );
    console.log(`Updated recent project 3:`, project3Result);

    await client.close();
    console.log("✅ Database migration completed successfully!");
  } catch (error) {
    console.error("❌ Error running migration:", error);
  }
}

run();
