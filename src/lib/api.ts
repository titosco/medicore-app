import axios from "axios";
import { getAccessToken, setAccessToken } from "./tokenStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true, // inportant. sends only the http token cookie automatically
  headers: {
    "content-type": "application/json",
  },
});

// attach access token to every request automatically
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle token expiration automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRoute = original?.url?.startWith("/auth");

    // if 401 error and we have not retired yet - try to refresh
    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original.retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        // refresh failed, redirct to the login
        setAccessToken(null);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
