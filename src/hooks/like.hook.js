import { commonPostHook } from "@hooks/common.hook";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:3000";

export const hookLike = async (data) => {
  const url = `${apiBaseUrl}/books/${data.id}`;

  const now = new Date().toISOString();
  data = { ...data, updatedAt: now };
  const res = await commonPostHook("PATCH", url, data);
  return res;
};
