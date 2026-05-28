import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const {
  CLOUDFLARE_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_ENDPOINT,
  R2_PUBLIC_URL,
} = process.env;

const isR2Configured = Boolean(
  R2_ACCESS_KEY_ID &&
  R2_SECRET_ACCESS_KEY &&
  R2_BUCKET_NAME
);

let s3Client = null;

if (isR2Configured) {
  // Use user-provided endpoint or construct from Account ID
  const endpoint = R2_ENDPOINT || `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  
  s3Client = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Uploads a file buffer to Cloudflare R2
 * @param {Buffer} buffer - Binary file buffer
 * @param {string} key - Unique key path inside the bucket (e.g. 'products/abc.webp')
 * @param {string} mimeType - The file mime type
 * @returns {Promise<string>} The public URL of the uploaded image
 */
export async function uploadBufferToR2(buffer, key, mimeType) {
  if (!isR2Configured || !s3Client) {
    throw new Error("Cloudflare R2 is not configured.");
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  // Construct and return the public URL
  let publicUrl = R2_PUBLIC_URL;
  if (publicUrl) {
    if (publicUrl.endsWith("/")) {
      publicUrl = publicUrl.slice(0, -1);
    }
    return `${publicUrl}/${key}`;
  }

  // Fallback to endpoint construction
  const endpoint = R2_ENDPOINT || `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return `${endpoint}/${R2_BUCKET_NAME}/${key}`;
}

/**
 * Deletes an object from Cloudflare R2 bucket by key
 * @param {string} key - The R2 object key
 * @returns {Promise<boolean>} Success status
 */
export async function deleteFromR2(key) {
  if (!isR2Configured || !s3Client || !key) {
    return false;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    console.log(`🗑️ Successfully deleted from R2: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to delete from R2: ${key}`, error);
    return false;
  }
}

/**
 * Utility helper to extract R2 key from a public URL
 * @param {string} url - Public image URL
 * @returns {string|null} The key, or null if invalid/not R2
 */
export function extractR2Key(url) {
  if (!url) return null;
  // If the url is local (/b1.jpg) or base64, it's not R2
  if (url.startsWith("/") || url.startsWith("data:")) return null;
  
  try {
    const parsed = new URL(url);
    let key = parsed.pathname;
    
    // If the path starts with a slash, remove it
    if (key.startsWith("/")) {
      key = key.slice(1);
    }
    
    // If the bucket name is part of the path (like endpoint fallback url), remove it
    if (R2_BUCKET_NAME && key.startsWith(`${R2_BUCKET_NAME}/`)) {
      key = key.slice(R2_BUCKET_NAME.length + 1);
    }
    
    return key;
  } catch (e) {
    return null;
  }
}
