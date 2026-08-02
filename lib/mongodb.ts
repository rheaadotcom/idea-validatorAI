import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI ?? '';

/**
 * Cached client promise for the MongoDB connection used by NextAuth's MongoDBAdapter.
 * A single connection is reused across API calls in serverless environments.
 *
 * Note: `useNewUrlParser` and `useUnifiedTopology` were removed in mongodb driver v4+
 * and are no longer valid options — omitting them here prevents TypeScript errors.
 */
let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    if (!uri) {
      console.warn('[MongoDB] MONGODB_URI not defined – adapter will not work.');
      // Resolve with a rejected promise; the actual connection error surfaces later.
      clientPromise = Promise.reject(new Error('MONGODB_URI not set'));
    } else {
      clientPromise = MongoClient.connect(uri).then((client) => {
        console.log('[MongoDB] Connected for NextAuth adapter');
        return client;
      });
    }
  }
  return clientPromise;
}
