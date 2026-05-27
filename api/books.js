import {
  getBooksFromDb,
  makeNextId,
  normalizeBook,
  readJsonBody,
  sendJson,
} from "./_lib/db.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const dbFilePath = path.join(rootDir, "db.json");

const tryPersist = async (books) => {
  const payload = JSON.stringify({ books }, null, 2);
  await writeFile(dbFilePath, payload, "utf8").catch(() => {});
};

export default async function handler(req, res) {
  const books = await getBooksFromDb();

  if (req.method === "GET") {
    return sendJson(res, books);
  }

  if (req.method === "POST") {
    const body = readJsonBody(req);
    const nextBook = normalizeBook({
      ...body,
      id: body.id ?? makeNextId(books),
      createdAt: body.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const nextBooks = [nextBook, ...books];
    await tryPersist(nextBooks);
    return sendJson(res, nextBook, 201);
  }

  return sendJson(res, { message: "Method Not Allowed" }, 405);
}
