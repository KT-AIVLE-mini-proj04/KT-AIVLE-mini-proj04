import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080";

export const hookBooks = async (method, data) => {
  const baseUrl = `${apiBaseUrl}/books/${data.id}`;
  let url = baseUrl;

  const now = new Date().toISOString();
  if (method === "POST") {
    data = { ...data, createdAt: now, updatedAt: now };
    url = `${apiBaseUrl}/books`;
  }
  if (method === "PATCH") {
    data = { ...data, updatedAt: now };
  }
  const res = await commonPostHook(method, url, data);
  console.log("Book API response:", res);
  return res;
};

const normalizeBook = (book) => ({
  ...book,
  id: book.bookId,
  content: book.description,
  coverImageUrl: book.cover,
});

const toBackendBook = (data) => {
  const payload = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.author !== undefined) payload.author = data.author;
  if (data.content !== undefined) payload.description = data.content;
  if (data.coverImageUrl !== undefined) payload.cover = data.coverImageUrl;
  return payload;
};
