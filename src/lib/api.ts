import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true, // inportant. sends only the http token cookie automatically
  headers: {
    "content-type": "application/json",
  },
});

// attach access token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
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

    // if 401 error and we have not retired yet - try to refresh
    if (error.response?.status === 401 && !original._retry) {
      original.retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        const newToken = data.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        // refresh failed, redirct to the login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
