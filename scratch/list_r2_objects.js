import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const {
  CLOUDFLARE_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_ENDPOINT,
} = process.env;

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
  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
    });
    const response = await s3Client.send(command);
    
    console.log(`\n==========================================`);
    console.log(`☁️ CLOUDFLARE R2 OBJECT LIST`);
    console.log(`==========================================`);
    console.log(`Total objects returned: ${response.KeyCount}`);
    console.log(`------------------------------------------`);
    
    if (response.Contents) {
      response.Contents.forEach((obj, i) => {
        console.log(`${(i + 1).toString().padStart(3, ' ')}. Key: "${obj.Key}" (${(obj.Size / 1024).toFixed(1)} KB) - Last Modified: ${obj.LastModified}`);
      });
    } else {
      console.log('No objects found in the bucket.');
    }
    console.log(`==========================================\n`);
  } catch (err) {
    console.error(err);
  }
}

run();
