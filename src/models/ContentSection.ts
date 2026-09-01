import mongoose, { Schema, models, model } from "mongoose";
import { DOC_TYPES, MONGODB_COLLECTION, applySharedCollection } from "@/lib/db-config";

export interface IImageItem {
  url: string;
  alt: string;
  order: number;
}

export interface IContentSection {
  _id: string;
  key: string;
  title: string;
  images: IImageItem[];
  updatedAt: Date;
}

const ImageItemSchema = new Schema<IImageItem>(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const ContentSectionSchema = new Schema<IContentSection>(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    images: { type: [ImageItemSchema], default: [] },
  },
  { collection: MONGODB_COLLECTION, timestamps: { createdAt: false, updatedAt: true } },
);

applySharedCollection(ContentSectionSchema, DOC_TYPES.CONTENT_SECTION);
ContentSectionSchema.index({ docType: 1, key: 1 }, { unique: true });

export default models.ContentSection ||
  model<IContentSection>("ContentSection", ContentSectionSchema);
