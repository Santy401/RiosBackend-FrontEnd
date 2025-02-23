import express from 'express';

import companyController from '../controllers/companyController.js';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, companyController.getAllCompanies);
router.post('/', authenticateJWT, isAdmin, companyController.createCompany);
router.put('/:id', authenticateJWT, isAdmin, companyController.updateCompany);
router.delete('/:id', authenticateJWT, isAdmin, companyController.deleteCompany);

export default router;
