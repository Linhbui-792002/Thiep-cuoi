export type FieldType = "text" | "textarea";

export interface SectionFieldDef {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  placeholder?: string;
  hint?: string;
}

export interface SectionGroupDef {
  key: string;
  title: string;
  description: string;
  order: number;
  imageKeys?: string[];
  fields: SectionFieldDef[];
}

export const SECTION_GROUPS: SectionGroupDef[] = [
  {
    key: "hero",
    title: "Hero — Bìa trang",
    description: "Tiêu đề script, phong thiệp và ảnh polaroid",
    order: 1,
    imageKeys: ["hero"],
    fields: [
      { key: "scriptTitle", label: "Tiêu đề script", type: "text", default: "We got married" },
      { key: "cardTitle", label: "Tiêu đề thiệp", type: "text", default: "Ngày Chung Đôi" },
      {
        key: "cardSubtitle",
        label: "Phụ đề thiệp",
        type: "text",
        default: "We're getting married!",
      },
    ],
  },
  {
    key: "calendar",
    title: "Lịch tháng",
    description: "Lịch theo tháng cưới + 1 ảnh bên trái",
    order: 2,
    imageKeys: ["calendar"],
    fields: [{ key: "monthPrefix", label: "Tiền tố tháng", type: "text", default: "Tháng" }],
  },
  {
    key: "invite",
    title: "Lời mời",
    description: "Lời mời chính, tên cặp đôi và ảnh",
    order: 3,
    imageKeys: ["bride", "groom", "couple"],
    fields: [
      { key: "greeting", label: "Lời mở đầu", type: "text", default: "Trân trọng kính mời" },
      { key: "guestTitle", label: "Khách mời", type: "text", default: "Quý Khách" },
      {
        key: "eventLabel",
        label: "Dòng sự kiện (nhà gái / lễ vu quy)",
        type: "text",
        default: "Tham dự tiệc mừng lễ vu quy của",
      },
      {
        key: "eventLabelGroom",
        label: "Dòng sự kiện (nhà trai / lễ thành hôn)",
        type: "text",
        default: "Tham dự tiệc mừng lễ thành hôn của",
      },
      {
        key: "quote",
        label: "Lời quote dọc",
        type: "textarea",
        default: "",
        hint: "Để trống sẽ dùng quote từ Cài đặt chung",
      },
      { key: "monogramLeft", label: "Chữ trái khối quote", type: "text", default: "L" },
      { key: "monogramRight", label: "Chữ phải khối quote", type: "text", default: "T" },
    ],
  },
  {
    key: "family",
    title: "Gia đình",
    description: "Nhãn nhà trai / nhà gái (tên lấy từ Cài đặt)",
    order: 4,
    fields: [
      { key: "groomLabel", label: "Nhãn nhà trai", type: "text", default: "Nhà trai" },
      { key: "brideLabel", label: "Nhãn nhà gái", type: "text", default: "Nhà gái" },
    ],
  },
  {
    key: "events",
    title: "Sự kiện",
    description: "Nhãn hiển thị (chi tiết sự kiện từ Cài đặt)",
    order: 5,
    fields: [
      { key: "timeLabel", label: "Nhãn giờ", type: "text", default: "Vào hồi" },
      { key: "mapLabel", label: "Nút chỉ đường", type: "text", default: "Xem chỉ đường" },
    ],
  },
  {
    key: "thankyou",
    title: "Lời cảm ơn",
    description: "Đoạn cảm ơn khách mời",
    order: 6,
    fields: [
      { key: "title", label: "Tiêu đề", type: "text", default: "Lời Cảm Ơn" },
      {
        key: "body",
        label: "Nội dung",
        type: "textarea",
        default:
          "Trân trọng cảm ơn Quý khách đã dành thời gian đến chung vui và chúc phúc cho chúng tôi. Sự hiện diện của Quý vị là niềm vinh hạnh và hạnh phúc lớn lao của gia đình chúng tôi.",
      },
    ],
  },
  {
    key: "rsvp_intro",
    title: "Giới thiệu RSVP",
    description: "Đoạn văn trước form xác nhận",
    order: 7,
    fields: [
      {
        key: "line1",
        label: "Dòng 1",
        type: "text",
        default: "Sự hiện diện của Quý Khách",
      },
      {
        key: "line2",
        label: "Dòng 2",
        type: "text",
        default: "Là niềm vinh hạnh cho gia đình chúng tôi",
      },
      {
        key: "line3",
        label: "Dòng 3",
        type: "textarea",
        default:
          "Vui lòng điền xác nhận để chúng mình đón tiếp và chuẩn bị được chu đáo hơn",
      },
      { key: "signature", label: "Chữ ký", type: "text", default: "Trân trọng!" },
      {
        key: "footer",
        label: "Footer nhỏ",
        type: "text",
        default: "designed by thiep-cuoi",
      },
    ],
  },
  {
    key: "gallery",
    title: "Album ảnh",
    description: "Thư viện ảnh cưới",
    order: 8,
    imageKeys: ["gallery"],
    fields: [
      { key: "linkText", label: "Text link album", type: "text", default: "Xem thêm Album" },
    ],
  },
  {
    key: "bottom",
    title: "Footer — Phong thiệp cuối",
    description: "Phong thiệp và thông tin cuối trang",
    order: 9,
    imageKeys: ["envelope"],
    fields: [
      { key: "scriptTitle", label: "Tiêu đề script", type: "text", default: "We got married" },
      {
        key: "venueLabel",
        label: "Nhãn địa điểm",
        type: "text",
        default: "",
        hint: "Để trống = lấy tên địa điểm sự kiện cuối",
      },
      { key: "floorLabel", label: "Nhãn tầng", type: "text", default: "- tầng 3 -" },
    ],
  },
];

export const IMAGE_SECTION_LABELS: Record<string, string> = {
  hero: "Polaroid bìa — ảnh 1 trái, ảnh 2 phải",
  calendar: "Ảnh cạnh lịch — ảnh 1",
  envelope: "Phong thiệp cuối — ảnh 1 trái, ảnh 2 phải",
  couple: "Ảnh cặp đôi",
  bride: "Ảnh cô dâu — ảnh 1",
  groom: "Ảnh chú rể — ảnh 1",
  gallery: "Album — theo thứ tự upload",
};

export function getDefaultContent(groupKey: string): Record<string, string> {
  const group = SECTION_GROUPS.find((g) => g.key === groupKey);
  if (!group) return {};
  return Object.fromEntries(group.fields.map((f) => [f.key, f.default]));
}

export function getAllDefaultContent(): Record<string, Record<string, string>> {
  return Object.fromEntries(SECTION_GROUPS.map((g) => [g.key, getDefaultContent(g.key)]));
}

import type { PageSectionData } from "@/types";

export function getFieldValue(
  pageSections: PageSectionData[],
  sectionKey: string,
  fieldKey: string,
  fallback = "",
): string {
  const section = pageSections.find((s) => s.key === sectionKey);
  const group = SECTION_GROUPS.find((g) => g.key === sectionKey);
  const fieldDef = group?.fields.find((f) => f.key === fieldKey);
  const defaultVal = fieldDef?.default ?? fallback;
  const value = section?.content?.[fieldKey];
  if (value === undefined || value === null) return defaultVal;
  return value.trim() || defaultVal;
}

export function isSectionEnabled(pageSections: PageSectionData[], key: string): boolean {
  const section = pageSections.find((s) => s.key === key);
  return section?.enabled !== false;
}
