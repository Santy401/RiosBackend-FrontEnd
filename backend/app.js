import express from 'express';

import cors from 'cors';

import dotenv from 'dotenv';

import helmet from 'helmet';

import rateLimit from 'express-rate-limit';

import xss from 'xss-clean';

import authController from './controllers/authController.js';
import errorHandler from './middleware/errorMiddleware.js';
import areaRoutes from './routes/areaRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Set security HTTP headers
app.use(helmet());
app.use(express.json());

const allowedOrigins = ['https://task.riosbackend.com', 'http://localhost:5173'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against XSS
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// Routes
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/areas', areaRoutes);
app.use('/login', authController.login);
app.use('/auth/register', authController.register);
app.use('/clients', clientRoutes);
app.use('/companies', companyRoutes);

// Global error handling middleware
app.use(errorHandler);

export default app;
