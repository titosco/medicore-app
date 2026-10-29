import api from "@/lib/api";

import {
  AuthResponse,
  loginPayload,
  registerPayload,
  forgotPasswordPayload,
  ApiResponse,
  ResetPasswordPayload,
} from "@/types/auth";

export const authService = {
  register: async (
    payload: registerPayload,
  ): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse> => {
    const { data } = await api.get(`/auth/verify?token=${token}`);
    return data;
  },

  login: async (payload: loginPayload): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", payload);
    // save access token into local storage
    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }
    return data;
  },

  refresh: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    const { data } = await api.post("/auth/refresh");
    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }
    return data;
  },

  logout: async (): Promise<ApiResponse> => {
    const { data } = await api.get("/auth/logout");
    localStorage.removeItem("accessToken");
    return data;
  },

  forgotPassword: async (
    payload: forgotPasswordPayload,
  ): Promise<ApiResponse> => {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<ApiResponse<unknown>> => {
    const { data } = await api.post("/auth/reset-password", payload);
    return data;
  },
};
