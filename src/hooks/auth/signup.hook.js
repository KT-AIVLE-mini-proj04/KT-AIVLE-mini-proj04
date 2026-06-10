import { commonAuthHook } from "@hooks/auth/commonAuth.hook";
import { setAccessToken, setUser } from "@utils/authStore";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:3000";

export const hookSignup = async (data) => {
  const baseUrl = `${apiBaseUrl}/users`;
  const res = await commonAuthHook("POST", baseUrl, data);
  setAccessToken(res.accessToken);
  setUser({ nickname: res.nickname, id: res.id, email: res.email });
};
