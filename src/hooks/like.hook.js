import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:3000";

export const hookLike = async (data) => {
  const { method, likeId, bookId, userId } = data;

  const url = method === "DELETE"
    ? `${apiBaseUrl}/like/${likeId}`
    : `${apiBaseUrl}/like`;

  const body = method === "POST" ? { bookId, userId } : undefined;
  const res = await commonPostHook(method, url, body);
  return res;
};

export const hookLikeCount = async (bookId) => {
  const url = `${apiBaseUrl}/like?bookId=${bookId}`;
  const res = await commonPostHook("GET", url);
  return Array.isArray(res) ? res : [];
};
