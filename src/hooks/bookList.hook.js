import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:3000";

export const hookBookList = async () => {
  const baseUrl = `${apiBaseUrl}/books`;
  const res = await commonPostHook("GET", baseUrl, null);
  return res;
};
