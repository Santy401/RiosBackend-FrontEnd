import express from 'express';

import userController from '../controllers/userController.js';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, isAdmin, userController.getAllUsers);
router.post('/', authenticateJWT, isAdmin, userController.createUser);

export default router;
