import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const dbFilePath = path.join(rootDir, "db.json");

const clone = (value) => JSON.parse(JSON.stringify(value));

export const loadDb = async () => {
  const raw = await readFile(dbFilePath, "utf8");
  return JSON.parse(raw);
};

export const responseJson = (data, status = 200) => ({ data, status });

export const sendJson = (res, data, status = 200) => {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(JSON.stringify(data));
};

export const readJsonBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
};

export const findBookIndex = (books, id) =>
  books.findIndex((book) => String(book.id) === String(id));

export const makeNextId = (books) => {
  const numericIds = books
    .map((book) => Number(book.id))
    .filter((value) => Number.isFinite(value));

  if (numericIds.length > 0) {
    return String(Math.max(...numericIds) + 1);
  }

  return String(Date.now());
};

export const normalizeBook = (book) => {
  const now = new Date().toISOString();
  return {
    like: false,
    coverImageUrl: "",
    audioUrl: "",
    ...book,
    id: String(book.id),
    createdAt: book.createdAt ?? now,
    updatedAt: book.updatedAt ?? now,
  };
};

export const getBooksFromDb = async () => {
  const db = await loadDb();
  return clone(db.books ?? []).map(normalizeBook);
};
