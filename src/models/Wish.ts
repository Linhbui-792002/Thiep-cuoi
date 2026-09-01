import mongoose, { Schema, models, model } from "mongoose";
import { DOC_TYPES, MONGODB_COLLECTION, applySharedCollection } from "@/lib/db-config";

export interface IWish {
  _id: string;
  name: string;
  message: string;
  createdAt: Date;
}

const WishSchema = new Schema<IWish>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
  },
  {
    collection: MONGODB_COLLECTION,
    timestamps: { createdAt: true, updatedAt: false },
  },
);

applySharedCollection(WishSchema, DOC_TYPES.WISH);

export default models.Wish || model<IWish>("Wish", WishSchema);
