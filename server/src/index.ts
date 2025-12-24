import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './db';
import routes from './routes';
import logger from './utils/logger';
import { apiRateLimit } from './middleware/validators';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(apiRateLimit);
app.use(cors());
app.use(express.json());

// Add logging middleware using Winston
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        body: req.body,
        query: req.query,
        ip: req.ip
    });
    next();
});

// Add error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    logger.error('Unhandled Error', { error: err });
    res.status(500).json({ error: 'Internal server error' });
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.use('/api', routes);

const startServer = async () => {
    // Start server first
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
    
    // Connect to DB in background
    connectDB();
};

startServer();

