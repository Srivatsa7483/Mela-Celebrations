import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const designs = await db.collection('designs').find({}).toArray();
    const recentProjects = await db.collection('recent_projects').find({}).toArray();

    const dbKeys = new Set();
    
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

    const r2Command = new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME });
    const r2Response = await s3Client.send(r2Command);
    const r2Objects = r2Response.Contents || [];

    const orphaned = [];
    r2Objects.forEach(obj => {
      if (!dbKeys.has(obj.Key)) {
        orphaned.push(obj.Key);
      }
    });

    console.log(`🧹 Found ${orphaned.length} orphaned objects in R2 to delete.`);

    if (orphaned.length === 0) {
      console.log("✅ Nothing to delete.");
      return;
    }

    for (let i = 0; i < orphaned.length; i++) {
      const key = orphaned[i];
      const deleteCommand = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key
      });
      await s3Client.send(deleteCommand);
      console.log(`[${i+1}/${orphaned.length}] Deleted: "${key}"`);
    }

    console.log("🎉 Cleanup completed successfully!");

  } catch (err) {
    console.error(err);
  } finally {
    await mongoClient.close();
  }
}

run();
