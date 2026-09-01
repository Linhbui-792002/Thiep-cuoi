import mongoose from "mongoose";
import { ensureSharedIndexes } from "@/lib/db-config";

const MONGODB_URI = process.env.MONGODB_URI;

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

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      autoIndex: false,
      // Atlas reserves `admin` / `local` / `config` — never use those as the app DB.
      dbName: process.env.MONGODB_DB || "thiep_cuoi",
    });
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.indexesReady && cached.conn.connection.db) {
      await ensureSharedIndexes(cached.conn.connection.db);
      cached.indexesReady = true;
    }
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    cached.indexesReady = false;
    throw error;
  }
}
