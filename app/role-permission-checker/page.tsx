// import { RolePermissionChecker } from "@/components/role-permission-checker/role-permission-checker";
import { RolePermissionChecker } from "./role-permission-checker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Role-Permission Conflicts",
  description:
    "Check conflicts between roles and permissions in your NestJS application",
};

export default function RolePermissionCheckerPage() {
  return (
    <div className="page-container">
      <h1 className="page-title text-center">
        Check Role-Permission Conflicts
      </h1>
      <RolePermissionChecker />
    </div>
  );
}
