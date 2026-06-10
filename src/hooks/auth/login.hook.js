import { commonAuthHook } from "@hooks/auth/commonAuth.hook";
import { setAccessToken, setUser } from "@utils/authStore";

const apiBaseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:3000";

export const hookLogin = async (data) => {
  const baseUrl = `${apiBaseUrl}/login`;
  const res = await commonAuthHook("POST", baseUrl, data);
  setAccessToken(res.accessToken);
  setUser({ name: res.name, email: res.email, phone: res.phone });
};
