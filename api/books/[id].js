import {
  findBookIndex,
  getBooksFromDb,
  readJsonBody,
  sendJson,
} from "../_lib/db.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const dbFilePath = path.join(rootDir, "db.json");

const tryPersist = async (books) => {
  const payload = JSON.stringify({ books }, null, 2);
  await writeFile(dbFilePath, payload, "utf8").catch(() => {});
};

export default async function handler(req, res) {
  const { id } = req.query;
  const books = await getBooksFromDb();
  const bookIndex = findBookIndex(books, id);

  if (bookIndex === -1) {
    return sendJson(res, { message: "Not Found" }, 404);
  }

  if (req.method === "GET") {
    return sendJson(res, books[bookIndex]);
  }

  if (req.method === "PATCH") {
    const body = readJsonBody(req);
    const nextBooks = books.map((book) =>
      String(book.id) === String(id)
        ? {
            ...book,
            ...body,
            id: String(book.id),
            updatedAt: new Date().toISOString(),
          }
        : book,
    );
    const updatedBook = nextBooks[bookIndex];
    await tryPersist(nextBooks);
    return sendJson(res, updatedBook);
  }

  if (req.method === "DELETE") {
    const nextBooks = books.filter((book) => String(book.id) !== String(id));
    await tryPersist(nextBooks);
    return sendJson(res, {});
  }

  return sendJson(res, { message: "Method Not Allowed" }, 405);
}
