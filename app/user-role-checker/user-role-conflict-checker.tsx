"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ConflictResult, DatabaseConnection, UserRole } from "@/types";

export function UserRoleConflictChecker({
  connection,
}: {
  connection: DatabaseConnection;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [results, setResults] = useState<ConflictResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  async function handleCheck() {
    if (!csvFile) {
      toast.error("Please upload a CSV file first");
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real scenario, you would upload the file and send the connection details
      // const formData = new FormData()
      // formData.append('file', csvFile)
      // formData.append('connection', JSON.stringify(connection))

      // const response = await fetch('/api/check-user-role', {
      //   method: 'POST',
      //   body: formData
      // })

      // if (!response.ok) throw new Error('Failed to check user-role conflicts')
      // const data = await response.json()

      // Simulate results for demonstration
      const mockResults: ConflictResult = {
        missing: [
          {
            userId: "user1",
            roleId: "admin",
            username: "john_doe",
            roleName: "Administrator",
          },
          {
            userId: "user3",
            roleId: "editor",
            username: "jane_smith",
            roleName: "Content Editor",
          },
        ],
        extra: [
          {
            userId: "user2",
            roleId: "moderator",
            username: "bob_jones",
            roleName: "Forum Moderator",
          },
        ],
        valid: [
          {
            userId: "user4",
            roleId: "viewer",
            username: "alice_wonder",
            roleName: "Content Viewer",
          },
          {
            userId: "user5",
            roleId: "supporter",
            username: "charlie_brown",
            roleName: "Support Staff",
          },
        ],
      };

      setResults(mockResults);
      toast.success("Conflict check completed");
    } catch (error) {
      toast.error("Failed to check conflicts", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User-Role Conflict Check</CardTitle>
        <CardDescription>
          Upload a CSV file to check for conflicts between users and roles in
          your database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          <Button
            onClick={handleCheck}
            disabled={!csvFile || isLoading}
            className="mt-6"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Check Conflicts
          </Button>
        </div>

        {results && (
          <Alert className="mb-4 border-blue-500">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              Found {results.missing.length} missing user-roles and{" "}
              {results.extra.length} extra user-roles.
            </AlertDescription>
          </Alert>
        )}

        {results && (
          <Tabs defaultValue="missing" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="missing" className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Missing ({results.missing.length})
              </TabsTrigger>
              <TabsTrigger value="extra" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Extra ({results.extra.length})
              </TabsTrigger>
              <TabsTrigger value="valid" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Valid ({results.valid.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="missing" className="max-h-96 overflow-auto">
              <UserRoleTable userRoles={results.missing} type="missing" />
            </TabsContent>

            <TabsContent value="extra" className="max-h-96 overflow-auto">
              <UserRoleTable userRoles={results.extra} type="extra" />
            </TabsContent>

            <TabsContent value="valid" className="max-h-96 overflow-auto">
              <UserRoleTable userRoles={results.valid} type="valid" />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

function UserRoleTable({
  userRoles,
  type,
}: {
  userRoles: UserRole[];
  type: "missing" | "extra" | "valid";
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role ID</TableHead>
            <TableHead>Role Name</TableHead>
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
              <TableRow key={`${userRole.userId}-${userRole.roleId}-${index}`}>
                <TableCell>{userRole.userId}</TableCell>
                <TableCell>{userRole.username}</TableCell>
                <TableCell>{userRole.roleId}</TableCell>
                <TableCell>{userRole.roleName}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
