import mongoose from "mongoose";
import { ensureSharedIndexes } from "@/lib/db-config";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "thiep_cuoi";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  indexesReady: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
  indexesReady: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function resetCache() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  cached.conn = null;
  cached.promise = null;
  cached.indexesReady = false;
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (cached.conn) {
    if (cached.conn.connection.name === MONGODB_DB) {
      return cached.conn;
    }
    console.warn(
      `[mongo] connected to "${cached.conn.connection.name}", expected "${MONGODB_DB}" — reconnecting`,
    );
    await resetCache();
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      autoIndex: false,
      maxPoolSize: 5,
      minPoolSize: 0,
      // Atlas reserves `admin` / `local` / `config` — never use those as the app DB.
      dbName: MONGODB_DB,
    });
  }

  try {
    cached.conn = await cached.promise;
    if (cached.conn.connection.name !== MONGODB_DB) {
      throw new Error(
        `Mongo connected to "${cached.conn.connection.name}" instead of "${MONGODB_DB}"`,
      );
    }
    if (!cached.indexesReady && cached.conn.connection.db) {
      await ensureSharedIndexes(cached.conn.connection.db);
      cached.indexesReady = true;
      console.log(`[mongo] connected: ${MONGODB_DB}`);
    }
    return cached.conn;
  } catch (error) {
    await resetCache();
    throw error;
  }
}
