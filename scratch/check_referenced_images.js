import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'mela-celebrations';

async function run() {
  if (!uri) {
    console.error('❌ MONGODB_URI not found in env');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const designs = await db.collection('designs').find({}).toArray();
    const recentProjects = await db.collection('recent_projects').find({}).toArray();

    const referencedUrls = new Set();
    let r2UrlsCount = 0;

    designs.forEach(d => {
      // Check primary image
      if (d.image) {
        referencedUrls.add(d.image);
        if (d.image.includes('r2.dev') || d.image.includes('cloudflarestorage.com')) {
          r2UrlsCount++;
        }
      }
      // Check extra images array
      if (Array.isArray(d.images)) {
        d.images.forEach(img => {
          if (img) {
            referencedUrls.add(img);
            if (img.includes('r2.dev') || img.includes('cloudflarestorage.com')) {
              r2UrlsCount++;
            }
          }
        });
      }
    });

    recentProjects.forEach(p => {
      if (p.image) {
        referencedUrls.add(p.image);
        if (p.image.includes('r2.dev') || p.image.includes('cloudflarestorage.com')) {
          r2UrlsCount++;
        }
      }
    });

    console.log(`\n==========================================`);
    console.log(`📊 DATABASE IMAGE REFERENCES SUMMARY`);
    console.log(`==========================================`);
    console.log(`Total designs: ${designs.length}`);
    console.log(`Total recent projects: ${recentProjects.length}`);
    console.log(`------------------------------------------`);
    console.log(`Total unique image URLs referenced: ${referencedUrls.size}`);
    
    const r2UniqueUrls = Array.from(referencedUrls).filter(url => 
      url.includes('r2.dev') || url.includes('cloudflarestorage.com')
    );
    console.log(`Unique Cloudflare R2 image URLs referenced: ${r2UniqueUrls.length}`);
    console.log(`Total (including duplicates) R2 image links: ${r2UrlsCount}`);
    console.log(`==========================================\n`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
