import sharp from "sharp";
import crypto from "crypto";
import { uploadBufferToR2 } from "../services/r2Service.js";

/**
 * Optimizes an image and uploads it to Cloudflare R2
 * @param {object} file - The Multer file object
 * @param {string} folder - Folder inside R2 bucket (defaults to 'products')
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadToR2(file, folder = "products") {
  if (!file || !file.buffer) {
    throw new Error("No file buffer found to upload");
  }

  try {
    // Initialize sharp with the file buffer
    let sharpInstance = sharp(file.buffer);
    
    // Read image metadata
    const metadata = await sharpInstance.metadata();
    
    // Resize image if it exceeds 1600px width (limit size but keep premium quality)
    if (metadata.width && metadata.width > 1600) {
      sharpInstance = sharpInstance.resize({ width: 1600, withoutEnlargement: true });
    }
    
    // Convert to webp and compress with quality 80
    const webpBuffer = await sharpInstance
      .webp({ quality: 80 })
      .toBuffer();

    // Generate a unique filename to prevent conflicts
    const hash = crypto.randomBytes(8).toString("hex");
    const timestamp = Date.now();
    const fileName = `img_${hash}_${timestamp}.webp`;
    
    // Construct key (e.g. 'products/img_abc123_1716912345.webp')
    const key = `${folder}/${fileName}`;

    // Upload to Cloudflare R2
    const publicUrl = await uploadBufferToR2(webpBuffer, key, "image/webp");
    console.log(`🚀 Image optimized & uploaded to R2: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error("❌ Sharp optimization & R2 Upload failed:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

/**
 * Processes a base64 string, converts it to WebP buffer, and uploads it to R2.
 * @param {string} base64Data - Base64 data URL
 * @param {string} folder - Destination folder
 * @returns {Promise<string>} The uploaded image public URL
 */
export async function uploadBase64ToR2WebP(base64Data, folder = "products") {
  if (!base64Data) return base64Data;
  if (!base64Data.startsWith("data:")) return base64Data;

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image data URL format");
    }

    const base64Body = matches[2];
    const buffer = Buffer.from(base64Body, "base64");

    // Optimize with Sharp
    let sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();
    
    if (metadata.width && metadata.width > 1600) {
      sharpInstance = sharpInstance.resize({ width: 1600, withoutEnlargement: true });
    }

    const webpBuffer = await sharpInstance
      .webp({ quality: 80 })
      .toBuffer();

    const hash = crypto.randomBytes(8).toString("hex");
    const fileName = `img_${hash}_${Date.now()}.webp`;
    const key = `${folder}/${fileName}`;

    return await uploadBufferToR2(webpBuffer, key, "image/webp");
  } catch (error) {
    console.error("❌ Failed to process and upload base64 image to R2:", error);
    throw error;
  }
}
