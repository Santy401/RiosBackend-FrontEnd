import express from 'express';

import clientController from '../controllers/clientController.js';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, clientController.getAllClients);
router.post('/', authenticateJWT, isAdmin, clientController.createClient);
router.put('/:id', authenticateJWT, isAdmin, clientController.updateClient);
router.delete('/:id', authenticateJWT, isAdmin, clientController.deleteClient);

export default router;
