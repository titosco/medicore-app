"use client";

import Link from "next/link";
import {
  CalendarDays,
  FileText,
  FlaskConical,
  Pill,
  Stethoscope,
  Users,
  Building2,
  ScrollText,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Role } from "@/types/auth";

interface Action {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const content: Record<Role, { subtitle: string; actions: Action[] }> = {
  PATIENT: {
    subtitle: "Manage your appointments and health records.",
    actions: [
      {
        label: "Book an appointment",
        description: "Find a doctor and book the time",
        href: "/appointments",
        icon: CalendarDays,
      },
      {
        label: "Prescription",
        description: "View your current medication",
        href: "/presscriptions",
        icon: Pill,
      },
      {
        label: "Lab results",
        description: "View your test results",
        href: "/lab-results",
        icon: FlaskConical,
      },
    ],
  },
  DOCTOR: {
    subtitle: "Check your schedule and patients ",
    actions: [
      {
        label: "My schedule",
        description: "Appointments for today and beyond",
        href: "/appointments",
        icon: CalendarDays,
      },
      {
        label: "Medical records",
        description: "Write and review cinical records",
        href: "/medical-records",
        icon: FileText,
      },
      {
        label: "Lab orders",
        description: "order tests and view results",
        href: "/lab-orders",
        icon: FlaskConical,
      },
    ],
  },
  RECEPTIONIST: {
    subtitle: "Scheduling and managing front desk tools",
    actions: [
      {
        label: "Appointments",
        description: "Book, Reschedule or Cancel",
        href: "/appointments",
        icon: CalendarDays,
      },
      {
        label: "Doctors",
        description: "Manage Doctors Availability",
        href: "/doctors",
        icon: Stethoscope,
      },
      {
        label: "Patients",
        description: "Manage Patient Records",
        href: "/patients",
        icon: Users,
      },
    ],
  },
  ADMIN: {
    subtitle: "Overall system administration and oversight",
    actions: [
      {
        label: "Users",
        description: "Manage users and roles",
        href: "/users",
        icon: Users,
      },
      {
        label: "Departments",
        description: "Departments and Specilizations",
        href: "/departments",
        icon: Building2,
      },
      {
        label: "Audit logs",
        description: "Review access to sensitive data",
        href: "/audit-logs",
        icon: ScrollText,
      },
    ],
  },
};

export default function DashboardHome() {
  const { user } = useAuth();
  if (!user) return null;

  const { subtitle, actions } = content[user.role];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome. {user.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="bg-white p-5 rounded-xl border border-gray-300 hover:border-blue-400 hover:shadow-sm transition"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Icon size={20} />
              </div>
              <p className="text-sm font-medium text-gray-900">{a.label}</p>
              <p className="text-xs text-gray-600 mt-1">{a.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
