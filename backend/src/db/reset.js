// `npm run reset`: deletes the database file, then creates and seeds a fresh one.
// Stop the backend first, so it is not holding the old file open.
import fs from 'node:fs';
import { config } from '../config.js';

fs.rmSync(config.dbFile, { force: true });
fs.rmSync(`${config.dbFile}-journal`, { force: true });

// Imported only after the delete, because opening the connection creates the file.
const { seedIfEmpty } = await import('./seed.js');
const seeded = seedIfEmpty();

console.log(`Database reset: ${seeded.travellers} travellers and ${seeded.groups} groups loaded.`);
