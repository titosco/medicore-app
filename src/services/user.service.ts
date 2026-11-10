import api from "@/lib/api";
import { ApiResponse, User } from "@/types/auth";

export const userService = {
  getMe: async (): Promise<ApiResponse<User>> => {
    const { data } = await api.get("users/me");
    return data;
  },
};
