import { Router } from 'express';
import { metaRoutes } from './meta.routes.js';

// Each routes file declares full paths (relative to /api), so the URL list is easy to read.
export const apiRouter = Router();

apiRouter.use(metaRoutes);
