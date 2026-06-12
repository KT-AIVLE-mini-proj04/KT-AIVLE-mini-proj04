import axios from "axios";
import { getAccessToken, clearAccessToken } from "@utils/authStore";
import { refreshAccessToken } from "@hooks/auth/refreshAccessToken.hook";

export const commonPostHook = async (method, url, data) => {
  const accessToken = getAccessToken();
  const req = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    ...(data && { data }), // ⬅️ data가 있을 때만 포함
  };
  try {
    const response = await axios(req);
    return response.data;
  } catch (error) {
    // Access Token 만료 → refresh 후 재시도 (기존에 로그인이 되어 있었을 때만)
    if (error.response?.status === 401 && accessToken) {
      try {
        const newToken = await refreshAccessToken();
        const retryResponse = await axios({
          ...req,
          headers: {
            ...req.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
        return retryResponse.data;
      } catch (_) {
        // Refresh Token도 만료 → 재로그인
        clearAccessToken();
        window.location.href = "/login";
      }
    }
    console.log("Error:", error);
  }
};
