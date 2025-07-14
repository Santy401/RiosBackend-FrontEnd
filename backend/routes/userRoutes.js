import express from 'express';

import userController from '../controllers/userController.js';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, isAdmin, userController.getAllUsers);
router.post('/', authenticateJWT, isAdmin, userController.createUser);
router.put('/:id', authenticateJWT, isAdmin, userController.updateUser);
router.delete('/:id', authenticateJWT, isAdmin, userController.deleteUser);

export default router;
