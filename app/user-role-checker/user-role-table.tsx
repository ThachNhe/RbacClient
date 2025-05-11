"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@/types";

export function UserRoleTable({
  userRoles,
  type,
}: {
  userRoles: UserRole[];
  type: "missing" | "extra" | "valid";
}) {
  console.log("userRoles=====", userRoles);
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>

            <TableHead>FirstName</TableHead>
            <TableHead>LastName</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userRoles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No {type} user-roles found
              </TableCell>
            </TableRow>
          ) : (
            userRoles.map((userRole, index) => (
              <TableRow key={`${userRole.username}-${userRole.role}-${index}`}>
                <TableCell>{userRole.username}</TableCell>
                <TableCell>{userRole.firstName}</TableCell>
                <TableCell>{userRole.lastName}</TableCell>
                <TableCell>{userRole.role}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
