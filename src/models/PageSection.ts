import mongoose, { Schema, models, model } from "mongoose";
import { DOC_TYPES, MONGODB_COLLECTION, applySharedCollection } from "@/lib/db-config";

export interface IPageSection {
  _id: string;
  key: string;
  content: Record<string, string>;
  enabled: boolean;
  order: number;
  updatedAt: Date;
}

const PageSectionSchema = new Schema<IPageSection>(
  {
    key: { type: String, required: true },
    content: { type: Map, of: String, default: {} },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { collection: MONGODB_COLLECTION, timestamps: { createdAt: false, updatedAt: true } },
);

applySharedCollection(PageSectionSchema, DOC_TYPES.PAGE_SECTION);

export default models.PageSection || model<IPageSection>("PageSection", PageSectionSchema);
