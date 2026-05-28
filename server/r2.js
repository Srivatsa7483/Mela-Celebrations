import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const {
  CLOUDFLARE_R2_ACCOUNT_ID,
  CLOUDFLARE_R2_ACCESS_KEY_ID,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  CLOUDFLARE_R2_BUCKET_NAME,
  CLOUDFLARE_R2_PUBLIC_URL,
} = process.env;

// Initialize S3 client only if variables exist
let s3Client = null;
const isR2Configured = Boolean(
  CLOUDFLARE_R2_ACCOUNT_ID &&
  CLOUDFLARE_R2_ACCESS_KEY_ID &&
  CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
  CLOUDFLARE_R2_BUCKET_NAME
);

if (isR2Configured) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Uploads a base64 encoded image to Cloudflare R2
 * @param {string} base64Data - Base64 encoded image string (e.g. data:image/jpeg;base64,...)
 * @param {string} folder - Folder inside the bucket (e.g., 'designs', 'projects')
 * @returns {Promise<string>} The public URL of the uploaded image, or the original base64 if not configured/failed
 */
export async function uploadBase64ToR2(base64Data, folder = "uploads") {
  if (!base64Data) return base64Data;

  // If not configured, log a warning and return base64Data directly as fallback
  if (!isR2Configured || !s3Client) {
    console.warn("⚠️ Cloudflare R2 is not fully configured. Falling back to storing Base64 string in database.");
    return base64Data;
  }

  // If it's already a URL (doesn't start with data:), return it directly
  if (!base64Data.startsWith("data:")) {
    return base64Data;
  }

  try {
    // Parse the base64 URI
    // Format: data:image/png;base64,iVBORw0KGgoAAAANS...
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.warn("⚠️ Invalid base64 format. Falling back to storing Base64 string directly.");
      return base64Data;
    }

    const mimeType = matches[1];
    const base64Body = matches[2];
    const buffer = Buffer.from(base64Body, "base64");

    // Get file extension from mime type
    let extension = "jpg";
    if (mimeType.includes("png")) {
      extension = "png";
    } else if (mimeType.includes("gif")) {
      extension = "gif";
    } else if (mimeType.includes("webp")) {
      extension = "webp";
    } else if (mimeType.includes("svg")) {
      extension = "svg";
    } else if (mimeType.includes("jpeg")) {
      extension = "jpg";
    }

    // Generate a unique file name
    const uniqueId = Math.random().toString(36).substring(2, 15) + "_" + Date.now();
    const fileName = `${folder}/${uniqueId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    // Construct the public URL
    // If CLOUDFLARE_R2_PUBLIC_URL is configured, use it. Otherwise, construct standard dev URL or bucket URL
    let publicUrl = CLOUDFLARE_R2_PUBLIC_URL;
    if (publicUrl) {
      // Ensure it doesn't end with slash
      if (publicUrl.endsWith("/")) {
        publicUrl = publicUrl.slice(0, -1);
      }
      return `${publicUrl}/${fileName}`;
    }

    // Fallback URL construct if public custom domain is not set
    return `https://${CLOUDFLARE_R2_BUCKET_NAME}.r2.cloudflarestorage.com/${fileName}`;
  } catch (error) {
    console.error("❌ Cloudflare R2 Upload Error:", error);
    // Return original base64 as fallback so the application doesn't break
    return base64Data;
  }
}
