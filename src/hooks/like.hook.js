import { commonPostHook } from "@hooks/common.hook";

export const hookLike = async (data) => {
  const url = import.meta.env.VITE_API_URL + `/books/${data.id}`;

  const now = new Date().toISOString();
  data = { ...data, updatedAt: now };
  const res = await commonPostHook("PATCH", url, data);
  return res;
};
