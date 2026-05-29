/**
 * One-time migration: mark first 3 designs in DB as isSignature = true
 * Run with: node server/scripts/markSignature.js
 */
import { connectDB, getDB } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await connectDB();
  const db = await getDB();
  const col = db.collection('designs');

  // Get first 3 designs ordered by insertion order
  const first3 = await col.find({}).limit(3).toArray();
  
  if (first3.length === 0) {
    console.log('❌ No designs found in database.');
    process.exit(0);
  }

  console.log('📋 Will mark these 3 designs as Signature:');
  first3.forEach((d, i) => console.log(`  ${i + 1}. ${d.name} (id: ${d.id})`));

  const ids = first3.map(d => d.id);
  const result = await col.updateMany(
    { id: { $in: ids } },
    { $set: { isSignature: true } }
  );

  console.log(`✅ Updated ${result.modifiedCount} designs as Mela Signature Packages.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
