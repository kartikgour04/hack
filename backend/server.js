import { config } from './src/config.js';
import { seedIfEmpty } from './src/db/seed.js';
import { createApp } from './src/app.js';

const seeded = seedIfEmpty();
if (seeded) console.log(`New database: loaded ${seeded.travellers} travellers and ${seeded.groups} groups.`);

createApp().listen(config.port, () => {
  console.log(`API running at http://localhost:${config.port}/api`);
});
