import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI is not defined.");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || "mela-celebrations");
    console.log("Connected to MongoDB!");

    const designsCol = db.collection("designs");
    const categoriesCol = db.collection("categories");

    const designsCount = await designsCol.countDocuments();
    const categoriesCount = await categoriesCol.countDocuments();

    console.log(`Designs count: ${designsCount}`);
    console.log(`Categories count: ${categoriesCount}`);

    const sampleDesigns = await designsCol.find({}).limit(5).toArray();
    console.log("Sample designs (first 5):");
    sampleDesigns.forEach(d => {
      console.log(`- ID: ${d.id} (${typeof d.id}), Name: ${d.name}`);
    });

    const specificDesign = await designsCol.findOne({ id: 101 });
    console.log("Design 101 query by number:", specificDesign);

    const specificDesignStr = await designsCol.findOne({ id: "101" });
    console.log("Design 101 query by string:", specificDesignStr);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
