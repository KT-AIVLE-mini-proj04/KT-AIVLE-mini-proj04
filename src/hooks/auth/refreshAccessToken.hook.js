import axios from "axios";
import { setAccessToken } from "@utils/authStore";

export const refreshAccessToken = async () => {
  const res = await axios.post("/api/auth/refresh", null, {
    withCredentials: true, // HttpOnly 쿠키 자동 전송
  });
  const newToken = res.data.accessToken;
  setAccessToken(newToken);
  return newToken;
};

