import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const normalizeBook = (book) => ({
  ...book,
  id: book.bookId,
  content: book.description,
  coverImageUrl: book.cover,
});

export const hookBookList = async () => {
  const res = await commonPostHook("GET", `${apiBaseUrl}/books`, null);
  return Array.isArray(res) ? res.map(normalizeBook) : [];
};

