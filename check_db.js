import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "mela-celebrations";

if (!uri) {
  console.error("❌ MONGODB_URI not found");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("Connected to MongoDB:", dbName);

    const collections = await db.listCollections().toArray();
    for (const colInfo of collections) {
      const colName = colInfo.name;
      const col = db.collection(colName);
      
      const totalDocs = await col.countDocuments();
      const base64Count = await col.countDocuments({
        image: { $regex: /^data:/ }
      });

      console.log(`Collection: ${colName}`);
      console.log(`  - Total docs: ${totalDocs}`);
      console.log(`  - Base64 images: ${base64Count}`);

      if (base64Count > 0) {
        const sample = await col.findOne({ image: { $regex: /^data:/ } });
        console.log(`  - Sample ID: ${sample.id}, Image length: ${sample.image.length}`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
