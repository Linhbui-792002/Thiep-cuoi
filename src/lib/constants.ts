import { DEFAULT_THEME } from "./theme";

export const SECTION_DEFINITIONS = [
  { key: "hero", title: "Polaroid bìa", description: "Ảnh 1 = trái, ảnh 2 = phải" },
  { key: "calendar", title: "Ảnh cạnh lịch", description: "Ảnh 1 = cạnh calendar" },
  { key: "envelope", title: "Phong thiệp cuối trang", description: "Ảnh 1 = trái, ảnh 2 = phải" },
  { key: "couple", title: "Ảnh cặp đôi", description: "Ảnh phụ phần lời mời" },
  { key: "bride", title: "Ảnh cô dâu", description: "Ảnh 1 = chân dung cô dâu" },
  { key: "groom", title: "Ảnh chú rể", description: "Ảnh 1 = chân dung chú rể" },
  { key: "gallery", title: "Album ảnh", description: "Thứ tự upload = thứ tự hiển thị" },
] as const;

export type SectionKey = (typeof SECTION_DEFINITIONS)[number]["key"];

export const DEFAULT_SITE_CONFIG = {
  brideName: "Hương Ly",
  groomName: "Mạnh Thắng",
  weddingDate: "2026-04-26",
  lunarDate: "Tức Ngày 10 Tháng 03 Năm Bính Ngọ",
  quote: "Em là bình yên anh muốn giữ\nAnh là hạnh phúc em muốn trao.",
  monogram: "TL",
  youtubeMusicUrl: "",
  groomFamily: {
    father: "Ông Nguyễn Mạnh Tiến",
    mother: "Bà Lê Phương Lan",
  },
  brideFamily: {
    father: "Ông Hoàng Mạnh Cường",
    mother: "Bà Nguyễn Thị Kim Hoa",
  },
  events: [
    {
      title: "Tham dự lễ vu quy",
      time: "09 : 00 , chủ nhật",
      date: "26 . 04 . 2026",
      location: "Tư gia nhà gái",
      address: "H1P1 Văn Miếu, Phường Trường Thi, Tỉnh Ninh Bình\n(Tỉnh Nam Định cũ)",
      mapUrl: "",
    },
    {
      title: "Dự buổi tiệc chung vui",
      time: "11 : 00 , chủ nhật",
      date: "26 . 04 . 2026",
      location: "Golden Palace",
      address:
        "98 Đại Lộ Đông A, Lộc Vượng, Tỉnh Ninh Bình,\n(Thành Phố Nam Định cũ)",
      mapUrl: "https://maps.google.com",
    },
  ],
  theme: DEFAULT_THEME,
};
