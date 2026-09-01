export interface ImageItem {
  _id?: string;
  url: string;
  alt: string;
  order: number;
}

export interface ContentSection {
  key: string;
  title: string;
  images: ImageItem[];
}

export interface PageSectionData {
  key: string;
  title: string;
  description: string;
  order: number;
  enabled: boolean;
  content: Record<string, string>;
  fields: {
    key: string;
    label: string;
    type: "text" | "textarea";
    default: string;
    placeholder?: string;
    hint?: string;
  }[];
  imageKeys?: string[];
  images?: Record<string, ImageItem[]>;
}

export interface Family {
  father: string;
  mother: string;
}

export interface Event {
  title: string;
  time: string;
  date: string;
  location: string;
  address: string;
  mapUrl: string;
}

export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}

export interface SiteConfig {
  brideName: string;
  groomName: string;
  weddingDate: string;
  lunarDate: string;
  quote: string;
  monogram: string;
  youtubeMusicUrl: string;
  groomFamily: Family;
  brideFamily: Family;
  events: Event[];
  theme: ThemeConfig;
}

export interface Wish {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface InvitationData {
  config: SiteConfig;
  sections: ContentSection[];
  pageSections: PageSectionData[];
  wishes: Wish[];
}
