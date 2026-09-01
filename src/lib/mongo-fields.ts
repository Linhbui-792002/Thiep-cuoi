/** Loại bỏ field MongoDB không được ghi đè khi update */
export function stripMongoFields<T extends Record<string, unknown>>(
  body: T,
): Partial<T> {
  const rest = { ...body };
  delete rest._id;
  delete rest.__v;
  delete rest.docType;
  delete rest.createdAt;
  delete rest.updatedAt;
  return rest;
}
