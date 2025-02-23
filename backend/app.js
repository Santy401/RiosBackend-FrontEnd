import express from 'express';

import cors from 'cors';

import dotenv from 'dotenv';

import errorHandler from './middleware/errorMiddleware.js';
import areaRoutes from './routes/areaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/areas', areaRoutes);
app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/companies', companyRoutes);

app.use(errorHandler);

export default app;
