import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:3000";

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
  return res;
};
