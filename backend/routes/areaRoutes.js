import express from 'express';

import areaController from '../controllers/areaController.js';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, areaController.getAllAreas);
router.post('/', authenticateJWT, isAdmin, areaController.createArea);
router.put('/:id', authenticateJWT, isAdmin, areaController.updateArea);
router.delete('/:id', authenticateJWT, isAdmin, areaController.deleteArea);

export default router;
