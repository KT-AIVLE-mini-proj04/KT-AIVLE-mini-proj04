import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080";

export const hookComment = async (method, data) => {
  const baseUrl = `${apiBaseUrl}/comment`;
  console.log("Comment API called with method:", method, "and data:", data);
  let url = baseUrl;
  if (data?.id) url = `${baseUrl}/${data.id}`;
  else if (data?.usersId) url = `${baseUrl}?usersId=${data.usersId}`;
  else if (data?.bookId) {
    const page = data.page ?? 0;
    url = `${baseUrl}?bookId=${data.bookId}&page=${page}`;
  }

  const res = await commonPostHook(method, url, data);

  return res;
};
