import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? '';

/**
 * Cached client promise for the MongoDB connection used by NextAuth's MongoDBAdapter.
 * This ensures a single connection is reused across API calls in serverless environments.
 */
let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    if (!uri) {
      console.warn('[MongoDB] MONGODB_URI not defined – adapter will not work.');
      // Resolve with a dummy client to avoid crashing; actual connection will fail later.
      clientPromise = Promise.reject(new Error('MONGODB_URI not set'));
    } else {
      clientPromise = MongoClient.connect(uri, {
        // Options to improve reliability in serverless environments
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then((client) => {
        console.log('[MongoDB] Connected for NextAuth adapter');
        return client;
      });
    }
  }
  return clientPromise;
}
