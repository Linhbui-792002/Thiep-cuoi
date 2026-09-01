import mongoose, { Schema, models, model } from "mongoose";
import { DEFAULT_SITE_CONFIG } from "@/lib/constants";
import { DEFAULT_THEME } from "@/lib/theme";
import { DOC_TYPES, MONGODB_COLLECTION, applySharedCollection } from "@/lib/db-config";

export interface ITheme {
  primary: string;
  background: string;
  accent: string;
}

export interface IEvent {
  title: string;
  time: string;
  date: string;
  location: string;
  address: string;
  mapUrl: string;
}

export interface IFamily {
  father: string;
  mother: string;
}

export interface ISiteConfig {
  _id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  lunarDate: string;
  quote: string;
  monogram: string;
  youtubeMusicUrl: string;
  groomFamily: IFamily;
  brideFamily: IFamily;
  events: IEvent[];
  theme: ITheme;
}

const FamilySchema = new Schema<IFamily>(
  {
    father: { type: String, default: "" },
    mother: { type: String, default: "" },
  },
  { _id: false },
);

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    time: { type: String, default: "" },
    date: { type: String, default: "" },
    location: { type: String, default: "" },
    address: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
  },
  { _id: false },
);

const ThemeSchema = new Schema<ITheme>(
  {
    primary: { type: String, default: DEFAULT_THEME.primary },
    background: { type: String, default: DEFAULT_THEME.background },
    accent: { type: String, default: DEFAULT_THEME.accent },
  },
  { _id: false },
);

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    brideName: { type: String, default: DEFAULT_SITE_CONFIG.brideName },
    groomName: { type: String, default: DEFAULT_SITE_CONFIG.groomName },
    weddingDate: { type: String, default: DEFAULT_SITE_CONFIG.weddingDate },
    lunarDate: { type: String, default: DEFAULT_SITE_CONFIG.lunarDate },
    quote: { type: String, default: DEFAULT_SITE_CONFIG.quote },
    monogram: { type: String, default: DEFAULT_SITE_CONFIG.monogram },
    youtubeMusicUrl: { type: String, default: "" },
    groomFamily: { type: FamilySchema, default: () => DEFAULT_SITE_CONFIG.groomFamily },
    brideFamily: { type: FamilySchema, default: () => DEFAULT_SITE_CONFIG.brideFamily },
    events: { type: [EventSchema], default: () => DEFAULT_SITE_CONFIG.events },
    theme: { type: ThemeSchema, default: () => DEFAULT_THEME },
  },
  { collection: MONGODB_COLLECTION, timestamps: true },
);

applySharedCollection(SiteConfigSchema, DOC_TYPES.SITE_CONFIG);

export default models.SiteConfig || model<ISiteConfig>("SiteConfig", SiteConfigSchema);
