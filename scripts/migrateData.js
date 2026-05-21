import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Important: ensure the path correctly resolves to src/data/index.js
import { categories, designs } from '../src/data/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../server/db.json');

async function migrate() {
    try {
        console.log("Starting data migration...");
        const data = await fs.readFile(DB_PATH, 'utf8');
        let db = JSON.parse(data);

        // Populate if empty
        db.categories = categories;
        db.designs = designs;

        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        console.log(`Successfully migrated ${categories.length} categories and ${designs.length} designs to db.json!`);
    } catch (err) {
        console.error("Migration failed:", err);
    }
}

migrate();
