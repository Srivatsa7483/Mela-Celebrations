import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

const {
  CLOUDFLARE_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_ENDPOINT,
  MONGODB_URI,
  MONGODB_DB_NAME
} = process.env;

const dbName = MONGODB_DB_NAME || 'mela-celebrations';
const endpoint = R2_ENDPOINT || `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const s3Client = new S3Client({
  region: "auto",
  endpoint: endpoint,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function run() {
  const mongoClient = new MongoClient(MONGODB_URI);
  try {
    // 1. Get database image paths
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const designs = await db.collection('designs').find({}).toArray();
    const recentProjects = await db.collection('recent_projects').find({}).toArray();

    const dbKeys = new Set();
    
    // Helper to extract key path from R2 URL (e.g. from https://...dev/products/img.webp -> products/img.webp)
    function getR2KeyFromUrl(url) {
      if (!url) return null;
      if (url.includes('r2.dev') || url.includes('cloudflarestorage.com')) {
        try {
          const parsed = new URL(url);
          let key = parsed.pathname;
          if (key.startsWith('/')) {
            key = key.slice(1);
          }
          if (R2_BUCKET_NAME && key.startsWith(`${R2_BUCKET_NAME}/`)) {
            key = key.slice(R2_BUCKET_NAME.length + 1);
          }
          return key;
        } catch {
          return null;
        }
      }
      return null;
    }

    designs.forEach(d => {
      const k1 = getR2KeyFromUrl(d.image);
      if (k1) dbKeys.add(k1);

      if (Array.isArray(d.images)) {
        d.images.forEach(img => {
          const k2 = getR2KeyFromUrl(img);
          if (k2) dbKeys.add(k2);
        });
      }
    });

    recentProjects.forEach(p => {
      const k = getR2KeyFromUrl(p.image);
      if (k) dbKeys.add(k);
    });

    // 2. Get R2 objects list
    const r2Command = new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME });
    const r2Response = await s3Client.send(r2Command);
    const r2Objects = r2Response.Contents || [];

    const orphaned = [];
    const active = [];

    r2Objects.forEach(obj => {
      if (dbKeys.has(obj.Key)) {
        active.push(obj);
      } else {
        orphaned.push(obj);
      }
    });

    console.log(`\n==========================================`);
    console.log(`🧹 ORPHANED IMAGE CHECK`);
    console.log(`==========================================`);
    console.log(`Total objects in R2: ${r2Objects.length}`);
    console.log(`Unique R2 keys referenced in DB: ${dbKeys.size}`);
    console.log(`------------------------------------------`);
    console.log(`Active R2 objects: ${active.length}`);
    console.log(`Orphaned (unreferenced) R2 objects: ${orphaned.length}`);
    console.log(`==========================================\n`);

    if (orphaned.length > 0) {
      console.log(`📋 SAMPLE OF ORPHANED OBJECTS (First 15):`);
      orphaned.slice(0, 15).forEach((obj, i) => {
        console.log(`  ${i+1}. Key: "${obj.Key}" (${(obj.Size / 1024).toFixed(1)} KB) - Last Modified: ${obj.LastModified}`);
      });
      console.log(`...\n`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoClient.close();
  }
}

run();
