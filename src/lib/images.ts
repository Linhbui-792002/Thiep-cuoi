import { ContentSection, ImageItem } from "@/types";

export function parseISODate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return new Date(iso);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function getSectionImages(sections: ContentSection[], key: string): ImageItem[] {
  return [...(sections.find((s) => s.key === key)?.images || [])].sort(
    (a, b) => a.order - b.order,
  );
}

export function getImageAt(
  sections: ContentSection[],
  key: string,
  index: number,
): ImageItem | undefined {
  return getSectionImages(sections, key)[index];
}

export function formatDateDots(iso: string) {
  const d = parseISODate(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export function formatDateSlash(iso: string) {
  const d = parseISODate(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export type AlbumRow = { type: "row"; images: ImageItem[] } | { type: "wide"; image: ImageItem };

/** CineLove: 3 ảnh dọc → 1 ảnh ngang full, lặp lại. */
export function buildAlbumRows(images: ImageItem[]): AlbumRow[] {
  const rows: AlbumRow[] = [];
  let i = 0;
  while (i < images.length) {
    const left = images.length - i;
    if (left >= 4) {
      rows.push({ type: "row", images: images.slice(i, i + 3) });
      rows.push({ type: "wide", image: images[i + 3] });
      i += 4;
    } else if (left === 3) {
      rows.push({ type: "row", images: images.slice(i, i + 3) });
      i += 3;
    } else if (left === 2) {
      rows.push({ type: "row", images: images.slice(i, i + 2) });
      i += 2;
    } else {
      rows.push({ type: "wide", image: images[i] });
      i += 1;
    }
  }
  return rows;
}

/** Lưới tháng, tuần bắt đầu Thứ 2 */
export function buildMonthGrid(year: number, monthIndex: number) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const mondayOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = Array(mondayOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
