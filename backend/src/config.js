import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectDir = path.resolve(backendDir, '..');

export const config = {
  port: Number(process.env.PORT) || 4000,
  dbFile: path.join(backendDir, 'travel.db'),
  schemaFile: path.join(backendDir, 'src', 'db', 'schema.sql'),
  // The data pack lives at the project root and is read-only.
  dataDir: path.join(projectDir, 'data'),
  imagesDir: path.join(projectDir, 'images'),
};
