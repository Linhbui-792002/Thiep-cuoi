import { Schema, models, model } from "mongoose";
import { DOC_TYPES, MONGODB_COLLECTION, applySharedCollection } from "@/lib/db-config";

export const HEART_KEY = "hearts";

export interface IHeartCount {
  _id: string;
  key: string;
  count: number;
}

const HeartCountSchema = new Schema<IHeartCount>(
  {
    key: { type: String, required: true, default: HEART_KEY },
    count: { type: Number, default: 0, min: 0 },
  },
  {
    collection: MONGODB_COLLECTION,
    timestamps: { createdAt: false, updatedAt: true },
  },
);

applySharedCollection(HeartCountSchema, DOC_TYPES.HEART);

export default models.HeartCount || model<IHeartCount>("HeartCount", HeartCountSchema);
