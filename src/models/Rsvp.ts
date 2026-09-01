import mongoose, { Schema, models, model } from "mongoose";
import { DOC_TYPES, MONGODB_COLLECTION, applySharedCollection } from "@/lib/db-config";

export interface IRsvp {
  _id: string;
  name: string;
  attending: boolean;
  guestCount: number;
  createdAt: Date;
}

const RsvpSchema = new Schema<IRsvp>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    attending: { type: Boolean, required: true },
    guestCount: { type: Number, default: 1, min: 1, max: 10 },
  },
  {
    collection: MONGODB_COLLECTION,
    timestamps: { createdAt: true, updatedAt: false },
  },
);

applySharedCollection(RsvpSchema, DOC_TYPES.RSVP);

export default models.Rsvp || model<IRsvp>("Rsvp", RsvpSchema);
