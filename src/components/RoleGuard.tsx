"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Role } from "@/types/auth";

export default function RoleGuard({
  allowed,
  children,
}: {
  allowed: Role[];
  children: ReactNode;
}) {
  const { user } = useAuth();

  // the dashboard layer already allows a logged in user
  // so this decides whether their role allows them to access and see the page
  if (!user || !allowed.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="text-red-700" size={24} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm">
          Your Role does not grant you permission to view this page!.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition"
        >
          Head back to your dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
