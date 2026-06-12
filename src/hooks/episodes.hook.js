import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080";

export const hookEpisodes = async (method, data) => {
  const baseUrl = `${apiBaseUrl}/episodes`;
  let url = baseUrl;
  if (data?.id) url = `${baseUrl}/${data.id}`;
  else if (data?.bookId) url = `${baseUrl}?bookId=${data.bookId}`;
  console.log("hookEpisodes constructed URL:", url, method, "and data:", data);
  const res = await commonPostHook(method, url, data);
  console.log("hookEpisodes response:", res);
  return res;
};
