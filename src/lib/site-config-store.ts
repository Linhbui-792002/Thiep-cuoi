import { connectDB } from "@/lib/mongodb";
import { DEFAULT_SITE_CONFIG } from "@/lib/constants";
import { DOC_TYPES, MONGODB_COLLECTION } from "@/lib/db-config";
import { stripMongoFields } from "@/lib/mongo-fields";
import { normalizeTheme } from "@/lib/theme";
import type { SiteConfig as SiteConfigType } from "@/types";

function toPlain(config: unknown): SiteConfigType {
  const c = JSON.parse(JSON.stringify(config)) as Partial<SiteConfigType>;
  return {
    ...DEFAULT_SITE_CONFIG,
    ...c,
    youtubeMusicUrl: c.youtubeMusicUrl ?? "",
    theme: normalizeTheme(c.theme),
  };
}

async function collection() {
  const conn = await connectDB();
  return conn.connection.db!.collection(MONGODB_COLLECTION);
}

function buildNewDoc(data: Record<string, unknown> = {}) {
  const now = new Date();
  return {
    ...DEFAULT_SITE_CONFIG,
    ...data,
    docType: DOC_TYPES.SITE_CONFIG,
    createdAt: now,
    updatedAt: now,
  };
}

export async function loadSiteConfig(): Promise<SiteConfigType> {
  const col = await collection();
  let doc = await col.findOne({ docType: DOC_TYPES.SITE_CONFIG });

  if (!doc) {
    const created = buildNewDoc();
    const result = await col.insertOne(created);
    doc = { _id: result.insertedId, ...created };
  }

  return toPlain(doc);
}

export async function saveSiteConfig(
  payload: Record<string, unknown>,
): Promise<SiteConfigType> {
  const col = await collection();
  const update = stripMongoFields(payload);
  const now = new Date();

  const existing = await col.findOne({ docType: DOC_TYPES.SITE_CONFIG });

  if (!existing) {
    const created = buildNewDoc(update);
    const result = await col.insertOne(created);
    return toPlain({ _id: result.insertedId, ...created });
  }

  await col.updateOne(
    { _id: existing._id, docType: DOC_TYPES.SITE_CONFIG },
    { $set: { ...update, docType: DOC_TYPES.SITE_CONFIG, updatedAt: now } },
  );

  const saved = await col.findOne({ _id: existing._id });
  return toPlain(saved);
}
