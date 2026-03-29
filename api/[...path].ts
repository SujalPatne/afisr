import express from 'express';
import apiRouter from './app';

const app = express();
app.use(express.json());

// Forward /api requests to the router
app.use('/api', apiRouter);

// the default export for Vercel
export default app;
