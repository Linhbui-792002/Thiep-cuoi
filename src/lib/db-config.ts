import type { Schema } from "mongoose";
import type { Db } from "mongodb";

/** Database: thiep_cuoi | Collection: db_cuoi_tun */
export const MONGODB_COLLECTION = "db_cuoi_tun";

export const DOC_TYPES = {
  SITE_CONFIG: "siteConfig",
  CONTENT_SECTION: "contentSection",
  PAGE_SECTION: "pageSection",
  WISH: "wish",
  RSVP: "rsvp",
  UPLOAD: "upload",
  HEART: "heart",
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

/** Unique (docType, key) only when key is a string — uploads/wishes/rsvp omit key. */
export async function ensureSharedIndexes(db: Db) {
  const col = db.collection(MONGODB_COLLECTION);
  const indexes = await col.indexes();
  const existing = indexes.find((idx) => idx.name === "docType_1_key_1");
  const keyFilter = existing?.partialFilterExpression as { key?: { $type?: string } } | undefined;
  const isPartialUnique = Boolean(existing?.unique) && keyFilter?.key?.$type === "string";

  if (existing && !isPartialUnique) {
    await col.dropIndex("docType_1_key_1");
  }

  if (!existing || !isPartialUnique) {
    await col.createIndex(
      { docType: 1, key: 1 },
      {
        name: "docType_1_key_1",
        unique: true,
        partialFilterExpression: { key: { $type: "string" } },
      },
    );
  }
}
