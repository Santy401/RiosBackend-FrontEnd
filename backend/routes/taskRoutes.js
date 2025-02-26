import express from 'express';

import taskController from '../controllers/taskController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, taskController.getAllTasks);
router.post('/', authenticateJWT, taskController.createTask);
router.post('/:id', authenticateJWT, taskController.updateTaskStatus);
router.put('/:id', authenticateJWT, taskController.updateTask);
router.delete('/:id', authenticateJWT, taskController.deleteTask);

export default router;
