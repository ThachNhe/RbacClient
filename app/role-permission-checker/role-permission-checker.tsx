"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadMultipleFiles } from "@/lib/api";
import { formatBytes } from "@/lib/utils";
import { RolePermissionCheckResult } from "@/types";
import {
  AlertCircle,
  FileArchive,
  FileCode,
  Loader2,
  Shield,
  Upload,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PermissionRuleTable } from "./permission-rule-table";

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

      const response = await uploadMultipleFiles<RolePermissionCheckResult>(
        "/role-permission/check",
        {
          file: configFile,
          projectFile: projectFile,
        },
        (percentage) => setUploadProgress(percentage)
      );

      console.log("check response: ", response);

      setResults(response);
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
              Found {results.lackRule.length} missing rules and{" "}
              {results.redundantRule.length} redundant rules.
            </AlertDescription>
          </Alert>
        )}

        {results && (
          <Tabs defaultValue="lack" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lack" className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Lack ({results.lackRule.length})
              </TabsTrigger>
              <TabsTrigger
                value="redundant"
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Redundant ({results.redundantRule.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lack" className="max-h-96 overflow-auto">
              <PermissionRuleTable rules={results.lackRule} type="lack" />
            </TabsContent>

            <TabsContent value="redundant" className="max-h-96 overflow-auto">
              <PermissionRuleTable
                rules={results.redundantRule}
                type="redundant"
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
