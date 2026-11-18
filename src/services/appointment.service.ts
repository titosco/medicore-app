import api from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Appointment } from "@/types/appointment";

export const appointmentService = {
  list: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Appointment>> => {
    const { data } = await api.get("/appointments", {
      params: { page, limit },
    });
    return data;
  },
};
