"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageSectionData } from "@/types";
import { IMAGE_SECTION_LABELS } from "@/lib/sections";
import { ChevronDown, ChevronUp, Eye, EyeOff, Save } from "lucide-react";

interface ImageItem {
  _id?: string;
  url: string;
  alt: string;
  order: number;
}

export default function AdminContentPage() {
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState<string | null>("hero");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    try {
      const res = await fetch("/api/sections");
      const data = await res.json();
      setSections(data);
    } catch {
      setMessage("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  function updateContent(sectionKey: string, fieldKey: string, value: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.key === sectionKey
          ? { ...s, content: { ...s.content, [fieldKey]: value } }
          : s,
      ),
    );
  }

  function toggleEnabled(sectionKey: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.key === sectionKey ? { ...s, enabled: !s.enabled } : s,
      ),
    );
  }

  async function saveSection(section: PageSectionData) {
    setSaving(section.key);
    setMessage("");

    try {
      const res = await fetch("/api/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: section.key,
          content: section.content,
          enabled: section.enabled,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu thất bại");

      setSections((prev) => prev.map((s) => (s.key === section.key ? { ...s, ...data } : s)));
      setMessage(`Đã lưu section "${section.title}"`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Lưu thất bại");
    } finally {
      setSaving(null);
    }
  }

  async function handleUpload(imageKey: string, sectionKey: string, files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(imageKey);
    setMessage("");

    try {
      const section = sections.find((s) => s.key === sectionKey);
      const currentImages = section?.images?.[imageKey] || [];

      const newImages: ImageItem[] = [...currentImages];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload thất bại");

        newImages.push({
          url: uploadData.url,
          alt: file.name,
          order: newImages.length,
        });
      }

      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: imageKey, images: newImages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu thất bại");

      await fetchSections();
      setMessage(`Đã thêm ảnh vào ${IMAGE_SECTION_LABELS[imageKey] || imageKey}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setUploading(null);
      const input = fileRefs.current[imageKey];
      if (input) input.value = "";
    }
  }

  async function handleDeleteImage(imageKey: string, imageId: string) {
    if (!confirm("Xóa ảnh này?")) return;

    try {
      const res = await fetch(`/api/content?key=${imageKey}&imageId=${imageId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      await fetchSections();
      setMessage("Đã xóa ảnh");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Xóa thất bại");
    }
  }

  if (loading) {
    return (
      <AdminShell title="Nội dung & ảnh">
        <p className="text-gray-500">Đang tải...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Nội dung & ảnh"
      description="Chỉnh chữ và ảnh theo từng phần trên thiệp"
    >
        {message && (
          <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {sections.map((section) => {
            const isOpen = expanded === section.key;

            return (
              <div
                key={section.key}
                className={`admin-card overflow-hidden transition ${!section.enabled ? "opacity-60" : ""}`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                  onClick={() => setExpanded(isOpen ? null : section.key)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-label text-sm font-semibold text-primary">
                      {section.order}
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-serif text-base text-primary sm:text-lg">{section.title}</h2>
                      <p className="hidden text-sm text-gray-500 sm:block">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 font-label text-xs ${
                        section.enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {section.enabled ? "Hiện" : "Ẩn"}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-6 space-y-6 border-t border-gray-100 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleEnabled(section.key)}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-label text-sm transition ${
                          section.enabled
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      >
                        {section.enabled ? (
                          <>
                            <Eye size={16} /> Đang hiển thị
                          </>
                        ) : (
                          <>
                            <EyeOff size={16} /> Đang ẩn
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => saveSection(section)}
                        disabled={saving === section.key}
                        className="admin-btn inline-flex items-center gap-2"
                      >
                        <Save size={16} />
                        {saving === section.key ? "Đang lưu..." : "Lưu section"}
                      </button>
                    </div>

                    {section.fields.length > 0 && (
                      <div className="space-y-4">
                        <p className="font-label text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Nội dung text
                        </p>
                        {section.fields.map((field) => (
                          <div key={field.key}>
                            <label className="mb-1 block font-label text-xs text-gray-600">
                              {field.label}
                            </label>
                            {field.type === "textarea" ? (
                              <textarea
                                className="admin-input"
                                rows={3}
                                value={section.content[field.key] ?? ""}
                                onChange={(e) =>
                                  updateContent(section.key, field.key, e.target.value)
                                }
                                placeholder={field.placeholder}
                              />
                            ) : (
                              <input
                                className="admin-input"
                                value={section.content[field.key] ?? ""}
                                onChange={(e) =>
                                  updateContent(section.key, field.key, e.target.value)
                                }
                                placeholder={field.placeholder}
                              />
                            )}
                            {field.hint && (
                              <p className="mt-1 text-xs text-gray-400">{field.hint}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.imageKeys && section.imageKeys.length > 0 && (
                      <div className="space-y-6">
                        <p className="font-label text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Ảnh
                        </p>
                        {section.imageKeys.map((imgKey) => {
                          const images = section.images?.[imgKey] || [];

                          return (
                            <div key={imgKey} className="rounded-lg border border-gray-100 p-4">
                              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <p className="font-label text-sm font-medium text-gray-700">
                                  {IMAGE_SECTION_LABELS[imgKey] || imgKey}
                                  <span className="ml-2 text-xs text-gray-400">
                                    ({images.length} ảnh)
                                  </span>
                                </p>
                                <div>
                                  <input
                                    ref={(el) => {
                                      fileRefs.current[imgKey] = el;
                                    }}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    id={`upload-${section.key}-${imgKey}`}
                                    onChange={(e) =>
                                      handleUpload(imgKey, section.key, e.target.files)
                                    }
                                  />
                                  <label
                                    htmlFor={`upload-${section.key}-${imgKey}`}
                                    className={`admin-btn inline-block cursor-pointer text-xs ${
                                      uploading === imgKey ? "opacity-50" : ""
                                    }`}
                                  >
                                    {uploading === imgKey ? "Đang upload..." : "+ Thêm ảnh"}
                                  </label>
                                </div>
                              </div>

                              {images.length === 0 ? (
                                <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400">
                                  Chưa có ảnh
                                </div>
                              ) : (
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                                  {images.map((img) => (
                                    <div
                                      key={img._id || img.url}
                                      className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                                    >
                                      <Image
                                        src={img.url}
                                        alt={img.alt}
                                        fill
                                        className="object-cover"
                                        sizes="120px"
                                        unoptimized={img.url.startsWith("/api/")}
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          img._id && handleDeleteImage(imgKey, img._id)
                                        }
                                        className="absolute right-1 top-1 rounded bg-red-600 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
    </AdminShell>
  );
}
