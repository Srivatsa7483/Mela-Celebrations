import fs from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { uploadBufferToR2 } from "../services/r2Service.js";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "mela-celebrations";
const imagePath = "C:\\Users\\sriva\\.gemini\\antigravity-ide\\brain\\945e2268-abc0-4f9e-91fd-12b9784bc6e1\\media__1780076624991.jpg";

async function run() {
  try {
    console.log("Reading image file...");
    const imageBuffer = fs.readFileSync(imagePath);

    console.log("Processing and cropping image to a square using sharp...");
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(400, 400, {
        fit: "cover",
        position: "center"
      })
      .webp({ quality: 85 })
      .toBuffer();

    console.log("Uploading optimized WebP image to Cloudflare R2...");
    const hash = crypto.randomBytes(8).toString("hex");
    const timestamp = Date.now();
    const key = `categories/decorations_${hash}_${timestamp}.webp`;
    
    const publicUrl = await uploadBufferToR2(optimizedBuffer, key, "image/webp");
    console.log(`\n✅ Uploaded successfully to R2! URL: ${publicUrl}\n`);

    console.log("Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    
    console.log("Updating category image in MongoDB...");
    const result = await db.collection("categories").updateOne(
      { id: "decorations" },
      { $set: { image: publicUrl } }
    );
    console.log(`✅ MongoDB Update Result:`, result);

    await client.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("❌ Error occurred:", error);
  }
}

run();
