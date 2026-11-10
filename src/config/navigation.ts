import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Pill,
  FlaskConical,
  Bell,
  User,
  Users,
  Stethoscope,
  Building2,
  GraduationCap,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { Role } from "@/types/auth";

export interface navItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const dashboard: navItem = {
  label: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
};
const notifications: navItem = {
  label: "Notifications",
  href: "/notification",
  icon: Bell,
};
const profile: navItem = { label: "Profile", href: "/profile", icon: User };

export const navByRole: Record<Role, navItem[]> = {
  PATIENT: [
    dashboard,
    { label: "Appointments", href: "/appointments", icon: CalendarDays },
    { label: "Medical Records", href: "/medical-records", icon: FileText },
    { label: "Prescriptions", href: "/prescriptions", icon: Pill },
    { label: "Lab Results", href: "lab-results", icon: FlaskConical },
    notifications,
    profile,
  ],
  DOCTOR: [
    dashboard,
    { label: "My Schedule", href: "/appointments", icon: CalendarDays },
    { label: "Patients", href: "/patients", icon: Users },
    { label: "Medical Records", href: "/medical-records", icon: FileText },
    { label: "Prescriptions", href: "prescriptions", icon: Pill },
    { label: "Lab Orders", href: "/lab-orders", icon: FlaskConical },
    notifications,
    profile,
  ],
  RECEPTIONIST: [
    dashboard,
    { label: "Appointments", href: "appointments", icon: CalendarDays },
    { label: "Doctors", href: "/doctors", icon: Stethoscope },
    { label: "Patients", href: "/patients", icon: Users },
    notifications,
    profile,
  ],
  ADMIN: [
    dashboard,
    { label: "Users", href: "/users", icon: Users },
    { label: "Patients", href: "/patients", icon: Users },
    { label: "Doctors", href: "/doctors", icon: Stethoscope },
    { label: "Departments", href: "/department", icon: Building2 },
    { label: "Specialisation", href: "/specialisation", icon: GraduationCap },
    { label: "Appointments", href: "/appointmets", icon: CalendarDays },
    { label: "Audit logs", href: "audit-logs", icon: ScrollText },
    notifications,
    profile,
  ],
};
