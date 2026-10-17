import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const dbName = process.env.MONGODB_DB || 'student-db';
const collectionName = 'students';

const connectDB = async () => {
  await mongoose.connect(mongoUri, {
    dbName,
    serverSelectionTimeoutMS: 5000
  });

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connected but database handle is missing');
  }

  await db.admin().command({ ping: 1 });

  const existing = await db.listCollections({ name: collectionName }).toArray();
  if (existing.length === 0) {
    await db.createCollection(collectionName);
    console.log(`Created collection ${dbName}.${collectionName}`);
  }

  console.log(`MongoDB connected: ${mongoUri}${dbName} (${collectionName})`);
};

export default connectDB;
