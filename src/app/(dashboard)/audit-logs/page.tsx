import RoleGuard from "@/components/RoleGuard";

export const instant = false;

export default function AuditLogsPage() {
  return (
    <RoleGuard allowed={["ADMIN"]}>
      <h1 className="text-2xl font-bold text-gray-900"> audit logs</h1>
      <p className="text-gray-500 text-sm mt-1">
        {" "}
        Admin only, table comes in later
      </p>
    </RoleGuard>
  );
}
