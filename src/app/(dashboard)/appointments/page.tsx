"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { appointmentService } from "@/services/appointment.service";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { Pagination } from "@/types/api";
import { Role } from "@/types/auth";

const statusStyles: Record<AppointmentStatus, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-indigo-100 text-indigo-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-gray-200 text-gray-700",
};

const titles: Record<Role, string> = {
  PATIENT: "MY APPOINTMENTS",
  DOCTOR: " MY SCHEDULES",
  RECEPTIONIST: "APPOINTMENTS",
  ADMIN: "APPOINTMENTS",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await appointmentService.list(page);
        if (!cancelled) {
          setAppointments(res.data);
          setPagination(res.pagination);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const e = err as { response?: { data?: { error?: string } } };
          setError(e.response?.data?.error || "could not load appointments");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  if (!user) return null;

  // role-aware columns. no point in showing poeple their own names
  const showPatient = user.role !== "PATIENT";
  const showDoctor = user.role !== "DOCTOR";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {titles[user.role]}
        </h1>
        {pagination && pagination.total > 0 && (
          <p className="text-gray-600 text-sm mt-1">{pagination.total} total</p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        ) : appointments.length === 0 && !error ? (
          <p className="p-10 text-center text-sm text-gray-600">
            No appointments found!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium"> Date and Time</th>
                  {showPatient && (
                    <th className="px-4 py-3 font-medium">Patient</th>
                  )}
                  {showDoctor && (
                    <th className="px-4 py-3 font-medium">Doctor</th>
                  )}
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                      {formatDate(a.scheduledAt)}
                    </td>
                    {showPatient && (
                      <td className="px-4 py-3 text-gray-800">
                        {a.patient?.user?.name ?? "-"}
                      </td>
                    )}
                    {showDoctor && (
                      <td className="px-4 py-3 text-gray-800">
                        {a.doctor?.user?.name ?? "-"}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusStyles[a.status]
                        }`}
                      >
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {a.reason ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1 || isLoading}
            className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-40"
          >
            <ChevronLeft size={18} /> Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pagination.totalPages || isLoading}
            className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-40"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
