/**
 * migrateToR2.js
 * 
 * Run this script ONCE to migrate all existing base64 product images stored in
 * MongoDB to Cloudflare R2.
 * 
 * Usage: node server/scripts/migrateToR2.js
 * 
 * Safety features:
 *  - Skips already migrated images (URLs, not base64)
 *  - Logs every success and failure
 *  - Does not delete old data until upload is confirmed
 *  - Prints a full migration summary at the end
 */

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { uploadBase64ToR2WebP } from "../utils/uploadToR2.js";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "mela-celebrations";

if (!uri) {
  console.error("❌ MONGODB_URI is not defined in your .env file.");
  process.exit(1);
}

// Stats tracking
const stats = {
  designs: { total: 0, migrated: 0, skipped: 0, failed: 0 },
  projects: { total: 0, migrated: 0, skipped: 0, failed: 0 },
};

/**
 * Migrate a single collection using cursor (memory efficient, live logging)
 */
async function migrateCollection(db, collectionName, folder, statsKey) {
  const col = db.collection(collectionName);

  // Fetch all metadata documents without the image field (super fast and lightweight)
  console.log(`\n📦 Fetching metadata for collection: ${collectionName}...`);
  const docs = await col.find({}, { projection: { image: 0 } }).toArray();
  const total = docs.length;
  stats[statsKey].total = total;

  console.log(`✅ Loaded ${total} metadata records. Processing one by one...`);

  let i = 0;
  for (const metaDoc of docs) {
    i++;
    const docId = metaDoc.id || metaDoc._id;
    
    // 1. Fetch the image field only via a fast point-query by _id
    process.stdout.write(`  [${i}/${total}] ID: ${docId} -> `);
    const startFetch = Date.now();
    const doc = await col.findOne({ _id: metaDoc._id }, { projection: { image: 1 } });
    const fetchTime = Date.now() - startFetch;

    if (!doc || !doc.image) {
      console.log(`⏭️  No image – skipping (${fetchTime}ms)`);
      stats[statsKey].skipped++;
      continue;
    }

    if (!doc.image.startsWith("data:")) {
      console.log(`✅ Already a URL – skipping (${fetchTime}ms)`);
      stats[statsKey].skipped++;
      continue;
    }

    const sizeMB = (doc.image.length / 1024 / 1024).toFixed(2);
    console.log(`📥 Base64 image found (${sizeMB} MB, fetched in ${fetchTime}ms)`);
    console.log(`      ⬆️  Optimizing & uploading to R2...`);

    // 2. Upload base64 image to R2
    try {
      const startUpload = Date.now();
      const publicUrl = await uploadBase64ToR2WebP(doc.image, folder);
      const uploadTime = Date.now() - startUpload;

      // 3. Update MongoDB document with new URL
      await col.updateOne(
        { _id: metaDoc._id },
        { $set: { image: publicUrl } }
      );

      console.log(`      🎉 Migrated in ${uploadTime}ms → ${publicUrl}`);
      stats[statsKey].migrated++;
    } catch (error) {
      console.error(`      ❌ Migration failed: ${error.message}`);
      stats[statsKey].failed++;
    }
  }
}

async function run() {
  console.log("🚀 Starting Cloudflare R2 Image Migration...\n");
  console.log(`📡 Connecting to MongoDB: ${dbName}`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas\n");
    const db = client.db(dbName);

    // Migrate designs collection
    await migrateCollection(db, "designs", "products", "designs");

    // Migrate recent_projects collection
    await migrateCollection(db, "recent_projects", "projects", "projects");

    // Summary
    console.log("\n═══════════════════════════════════════════════");
    console.log("            📊 MIGRATION SUMMARY");
    console.log("═══════════════════════════════════════════════");
    for (const [key, s] of Object.entries(stats)) {
      console.log(`\n  ${key.toUpperCase()}:`);
      console.log(`    Total:    ${s.total}`);
      console.log(`    Migrated: ${s.migrated}`);
      console.log(`    Skipped:  ${s.skipped}`);
      console.log(`    Failed:   ${s.failed}`);
    }
    console.log("\n═══════════════════════════════════════════════");
    if (stats.designs.failed + stats.projects.failed === 0) {
      console.log("✅ Migration completed with no failures!");
    } else {
      console.warn("⚠️  Migration completed with some failures. Re-run to retry failed items.");
    }

  } catch (error) {
    console.error("❌ Fatal migration error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
