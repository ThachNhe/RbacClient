"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileArchive,
  FileCode,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";
import { RolePermission, RolePermissionCheckResult } from "@/types";

export function RolePermissionChecker() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [results, setResults] = useState<RolePermissionCheckResult | null>(
    null
  );

  const handleProjectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check if file is a zip file
      if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
        toast.error("Project file must be a ZIP file");
        return;
      }

      setProjectFile(file);
    }
  };

  const handleConfigFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check if file is an XML file
      if (file.type !== "application/xml" && !file.name.endsWith(".xml")) {
        toast.error("Configuration file must be an XML file");
        return;
      }

      setConfigFile(file);
    }
  };

  async function handleCheck() {
    if (!projectFile || !configFile) {
      toast.error(
        "Please upload both the project ZIP and XML configuration files"
      );
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      clearInterval(progressInterval);
      setUploadProgress(100);

      // In a real scenario, you would upload the files
      // const formData = new FormData()
      // formData.append('projectFile', projectFile)
      // formData.append('configFile', configFile)

      // const response = await fetch('/api/check-role-permission', {
      //   method: 'POST',
      //   body: formData,
      //   onUploadProgress: (progressEvent) => {
      //     if (progressEvent.total) {
      //       const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      //       setUploadProgress(percentCompleted)
      //     }
      //   }
      // })

      // if (!response.ok) throw new Error('Failed to check role-permission conflicts')
      // const data = await response.json()

      // Simulate results for demonstration
      const mockResults: RolePermissionCheckResult = {
        missingPermissions: [
          {
            roleId: "admin",
            permissionId: "user:delete",
            roleName: "Administrator",
            permissionName: "Delete User",
          },
          {
            roleId: "editor",
            permissionId: "post:publish",
            roleName: "Content Editor",
            permissionName: "Publish Post",
          },
        ],
        extraPermissions: [
          {
            roleId: "viewer",
            permissionId: "post:edit",
            roleName: "Content Viewer",
            permissionName: "Edit Post",
          },
        ],
        validPermissions: [
          {
            roleId: "admin",
            permissionId: "user:create",
            roleName: "Administrator",
            permissionName: "Create User",
          },
          {
            roleId: "editor",
            permissionId: "post:edit",
            roleName: "Content Editor",
            permissionName: "Edit Post",
          },
          {
            roleId: "viewer",
            permissionId: "post:read",
            roleName: "Content Viewer",
            permissionName: "Read Post",
          },
        ],
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      setResults(mockResults);
      toast.success("Role-permission check completed");
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
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role-Permission Conflict Check
        </CardTitle>
        <CardDescription>
          Upload your NestJS project source code (ZIP) and XML configuration
          file to check for role-permission conflicts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="project-file" className="text-base">
              NestJS Project (ZIP)
            </Label>
            <div className="border rounded-lg p-4 h-32 flex flex-col justify-center items-center">
              {projectFile ? (
                <div className="w-full text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileArchive className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium truncate">
                    {projectFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(projectFile.size)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setProjectFile(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <Label
                    htmlFor="project-file"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload ZIP file
                    </span>
                  </Label>
                  <Input
                    id="project-file"
                    type="file"
                    accept=".zip"
                    onChange={handleProjectFileChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="config-file" className="text-base">
              XML Configuration
            </Label>
            <div className="border rounded-lg p-4 h-32 flex flex-col justify-center items-center">
              {configFile ? (
                <div className="w-full text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileCode className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium truncate">
                    {configFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(configFile.size)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setConfigFile(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <Label
                    htmlFor="config-file"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload XML file
                    </span>
                  </Label>
                  <Input
                    id="config-file"
                    type="file"
                    accept=".xml"
                    onChange={handleConfigFileChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Uploading and analyzing files...
              </span>
              <span className="text-sm font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {results && (
          <Alert className="mb-4 border-blue-500">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              Found {results.missingPermissions.length} missing permissions and{" "}
              {results.extraPermissions.length} extra permissions.
            </AlertDescription>
          </Alert>
        )}

        {results && (
          <Tabs defaultValue="missing" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="missing" className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Missing ({results.missingPermissions.length})
              </TabsTrigger>
              <TabsTrigger value="extra" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Extra ({results.extraPermissions.length})
              </TabsTrigger>
              <TabsTrigger value="valid" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Valid ({results.validPermissions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="missing" className="max-h-96 overflow-auto">
              <RolePermissionTable
                permissions={results.missingPermissions}
                type="missing"
              />
            </TabsContent>

            <TabsContent value="extra" className="max-h-96 overflow-auto">
              <RolePermissionTable
                permissions={results.extraPermissions}
                type="extra"
              />
            </TabsContent>

            <TabsContent value="valid" className="max-h-96 overflow-auto">
              <RolePermissionTable
                permissions={results.validPermissions}
                type="valid"
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleCheck}
          disabled={!projectFile || !configFile || isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Check Conflicts</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function RolePermissionTable({
  permissions,
  type,
}: {
  permissions: RolePermission[];
  type: "missing" | "extra" | "valid";
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role ID</TableHead>
            <TableHead>Role Name</TableHead>
            <TableHead>Permission ID</TableHead>
            <TableHead>Permission Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No {type} permissions found
              </TableCell>
            </TableRow>
          ) : (
            permissions.map((permission, index) => (
              <TableRow
                key={`${permission.roleId}-${permission.permissionId}-${index}`}
              >
                <TableCell>{permission.roleId}</TableCell>
                <TableCell>{permission.roleName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {permission.permissionId}
                  </Badge>
                </TableCell>
                <TableCell>{permission.permissionName}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
