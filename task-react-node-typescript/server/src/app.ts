import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import studentRoutes from './routes/studentRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/health', async (_req, res) => {
  const db = mongoose.connection.db;
  const readyState = mongoose.connection.readyState;

  if (readyState !== 1 || !db) {
    return res.status(503).json({
      status: 'error',
      database: 'disconnected',
      readyState
    });
  }

  const ping = await db.admin().command({ ping: 1 });
  const collections = await db.listCollections().toArray();

  return res.status(200).json({
    status: 'ok',
    database: db.databaseName,
    ping: ping.ok === 1,
    collections: collections.map((collection) => collection.name)
  });
});

app.use('/api', studentRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;
