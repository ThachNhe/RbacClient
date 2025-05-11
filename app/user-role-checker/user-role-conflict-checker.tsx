"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadFile } from "@/lib/api";
import { ApiResponse, ConflictResult, DatabaseConnection } from "@/types";
import { AlertCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRoleTable } from "./user-role-table";

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

  // console.log("results", results?.extra);

  async function handleCheck() {
    if (!csvFile) {
      toast.error("Please upload a CSV file first");
      return;
    }

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response: ApiResponse = await uploadFile(
        "/user-role/check",
        csvFile
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      const mockResults: ConflictResult = {
        missing: response?.data?.lackingPermissions,
        extra: response?.data?.redundantPermissions,
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="missing" className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Lack ({results.missing.length})
              </TabsTrigger>
              <TabsTrigger value="extra" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Redundant ({results.extra.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="missing" className="max-h-96 overflow-auto">
              <UserRoleTable userRoles={results.missing} type="missing" />
            </TabsContent>

            <TabsContent value="extra" className="max-h-96 overflow-auto">
              <UserRoleTable userRoles={results.extra} type="extra" />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
