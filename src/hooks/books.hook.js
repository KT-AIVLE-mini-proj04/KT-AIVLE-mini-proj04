import { commonPostHook } from "@hooks/common.hook";
import { getUser } from "@utils/authStore";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080";

// 백엔드 응답(cover/description/bookId) → 프론트 필드(coverImageUrl/content/id)
const normalizeBook = (book) => {
  if (!book || typeof book !== "object") return book;
  return {
    ...book,
    id: book.bookId,
    content: book.description,
    coverImageUrl: book.cover,
  };
};

// 표지를 cover 전용 엔드포인트로 저장 (생성/수정 모두 createBook·updateBook이 cover를 저장하지 않으므로 별도 호출)
const saveCover = async (bookId, coverImageUrl) => {
  if (!bookId || !coverImageUrl) return null;
  return commonPostHook("PATCH", `${apiBaseUrl}/books/${bookId}/cover`, {
    coverImageUrl,
  });
};

export const hookBooks = async (method, data) => {
  // 1. 도서 등록 (POST) - 백엔드 필드명(description/usersId)으로 변환
  if (method === "POST") {
    const user = getUser();
    const payload = {
      title: data.title,
      author: data.author,
      description: data.content,
      usersId: user?.usersId,
    };
    const created = normalizeBook(
      await commonPostHook("POST", `${apiBaseUrl}/books`, payload),
    );

    // 생성된 도서에 표지가 있으면 cover 엔드포인트로 저장
    if (created?.id && data.coverImageUrl) {
      const withCover = await saveCover(created.id, data.coverImageUrl);
      if (withCover) return normalizeBook(withCover);
    }
    console.log("Book API response:", created);
    return created;
  }

  // 2. 도서 수정 (PATCH) - content → description 변환
  if (method === "PATCH") {
    const payload = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.author !== undefined) payload.author = data.author;
    if (data.content !== undefined) payload.description = data.content;

    const updated = normalizeBook(
      await commonPostHook("PATCH", `${apiBaseUrl}/books/${data.id}`, payload),
    );

    if (data.coverImageUrl) {
      const withCover = await saveCover(data.id, data.coverImageUrl);
      if (withCover) return normalizeBook(withCover);
    }
    console.log("Book API response:", updated);
    return updated;
  }

  // 3. 조회(GET) / 삭제(DELETE)
  const res = await commonPostHook(method, `${apiBaseUrl}/books/${data.id}`, null);
  console.log("Book API response:", res);
  return normalizeBook(res);
};
