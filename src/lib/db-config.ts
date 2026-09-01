import type { Schema } from "mongoose";

/** Database: config | Collection: db_cuoi_tun */
export const MONGODB_COLLECTION = "db_cuoi_tun";

export const DOC_TYPES = {
  SITE_CONFIG: "siteConfig",
  CONTENT_SECTION: "contentSection",
  PAGE_SECTION: "pageSection",
  WISH: "wish",
  RSVP: "rsvp",
  UPLOAD: "upload",
} as const;

const QUERY_HOOKS = [
  "find",
  "findOne",
  "findOneAndUpdate",
  "findOneAndDelete",
  "countDocuments",
  "updateOne",
  "updateMany",
  "deleteOne",
  "deleteMany",
] as const;

/** Gắn collection chung + lọc theo docType trong db_cuoi_tun */
export function applySharedCollection(schema: Schema, docType: string) {
  schema.add({
    docType: { type: String, default: docType, immutable: true, index: true },
  });

  for (const hook of QUERY_HOOKS) {
    schema.pre(hook, function () {
      this.where({ docType });
    });
  }
}
