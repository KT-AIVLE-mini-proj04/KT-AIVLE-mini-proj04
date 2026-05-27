import axios from "axios";

export const commonPostHook = async (method, url, data) => {
  const req = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
    },
    ...(data && { data }), // ⬅️ data가 있을 때만 포함
  };
  try {
    const response = await axios(req);
    return response.data;
  } catch (error) {
    console.log("Error:", error);
  }
};
