import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', routes);

// Global Error Handler (must be last)
app.use(globalErrorHandler);

export default app;
