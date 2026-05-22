import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "db.json");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "mela-celebrations";

if (!uri) {
  console.error("❌ Error: MONGODB_URI is not defined in your .env file.");
  process.exit(1);
}

async function migrate() {
  console.log("🚀 Starting database migration...");

  // 1. Read db.json
  if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ db.json not found at ${DB_PATH}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(DB_PATH, "utf-8");
  const data = JSON.parse(rawData);

  console.log(`📊 Found in db.json:`);
  console.log(`   - ${data.users?.length || 0} users`);
  console.log(`   - ${data.bookings?.length || 0} bookings`);
  console.log(`   - ${data.coupons?.length || 0} coupons`);

  // 2. Connect to MongoDB
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB server");
    const db = client.db(dbName);

    // 3. Migrate Users (hash base64 passwords with bcrypt)
    if (data.users && data.users.length > 0) {
      const usersCol = db.collection("users");
      // Optional: clear existing users
      await usersCol.deleteMany({});
      
      const migratedUsers = [];
      for (const user of data.users) {
        // Decode password from base64
        let plainPassword = "password123"; // default if empty
        if (user.password) {
          try {
            plainPassword = Buffer.from(user.password, "base64").toString("utf-8");
          } catch (e) {
            console.warn(`⚠️ Failed to decode password for ${user.email}, using base64 string directly`);
            plainPassword = user.password;
          }
        }
        
        // Hash with bcrypt
        const hashedPassword = await bcrypt.hash(plainPassword, 12);
        
        migratedUsers.push({
          id: user.id,
          name: user.name,
          email: user.email.toLowerCase(),
          phone: user.phone || "",
          password: hashedPassword,
          createdAt: user.createdAt || new Date().toISOString(),
        });
      }
      
      await usersCol.insertMany(migratedUsers);
      console.log(`✅ Migrated ${migratedUsers.length} users successfully (passwords bcrypt-hashed)`);
    }

    // 4. Migrate Bookings
    if (data.bookings && data.bookings.length > 0) {
      const bookingsCol = db.collection("bookings");
      await bookingsCol.deleteMany({});
      
      const migratedBookings = data.bookings.map(b => ({
        ...b,
        email: b.email.toLowerCase(),
        createdAt: b.createdAt || new Date().toISOString(),
      }));
      
      await bookingsCol.insertMany(migratedBookings);
      console.log(`✅ Migrated ${migratedBookings.length} bookings successfully`);
    }

    // 5. Migrate Coupons
    if (data.coupons && data.coupons.length > 0) {
      const couponsCol = db.collection("coupons");
      await couponsCol.deleteMany({});
      
      await couponsCol.insertMany(data.coupons);
      console.log(`✅ Migrated ${data.coupons.length} coupons successfully`);
    }

    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await client.close();
  }
}

migrate();
