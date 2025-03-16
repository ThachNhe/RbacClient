"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { generateAndDownloadProject, ProjectGeneratorParams } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name only has two characters.",
  }),
  packageManager: z.enum(["npm", "yarn", "pnpm"], {
    required_error: "Please choose package manager.",
  }),
  description: z.string().min(1, {
    message: "Project description is not empty().",
  }),
  enableAuth: z.boolean().default(false),
  enableSwagger: z.boolean().default(false),
});

type FormStatus = {
  type: "success" | "error" | null;
  message: string;
} | null;

export function ProjectForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<FormStatus>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [formIsValid, setFormIsValid] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      packageManager: "npm",
      description: "",
      enableAuth: true,
      enableSwagger: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((formValues) => {
      const values = formValues as z.infer<typeof formSchema>;

      const isValid =
        values.projectName &&
        values.projectName.length >= 2 &&
        values.packageManager &&
        values.description &&
        values.description.length >= 1
          ? true
          : false;

      setFormIsValid(isValid);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "text/xml" || file.name.endsWith(".xml")) {
        setXmlFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "error",
          description: "Only XML files are allowed",
        });
        e.target.value = "";
      }
    }
  };

  const removeFile = () => {
    setXmlFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setStatus(null);
      setUploadProgress(0);

      const projectData: ProjectGeneratorParams = {
        name: values.projectName,
        packageManager: values.packageManager,
        description: values.description,
        swagger: values.enableSwagger,
        auth: values.enableAuth,
        file: xmlFile || undefined,
      };

      await generateAndDownloadProject(
        "/api/project-generator/create",
        projectData,
        (percentage) => setUploadProgress(percentage)
      );

      setStatus({
        type: "success",
        message: `Project "${values.projectName}" created successfully and downloaded!`,
      });

      toast({
        title: "Success",
        description: `Project "${values.projectName}" created successfully and downloaded!`,
      });

      // Reset form
      form.reset();
      setXmlFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred when creating the project",
      });

      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred when creating the project",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create new NestJS project</CardTitle>
        <CardDescription>
          Fill in the information to create a new NestJS project with your
          desired configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status && (
          <Alert
            className={`mb-6 ${
              status.type === "error"
                ? "border-destructive"
                : "border-green-500"
            }`}
            variant={status.type === "error" ? "destructive" : "default"}
          >
            <AlertTitle>
              {status.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name *</FormLabel>
                  <FormControl>
                    <Input placeholder="my-nestjs-project" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your project. This will be used as the folder
                    name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="packageManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Manager *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="npm">npm</SelectItem>
                      <SelectItem value="yarn">yarn</SelectItem>
                      <SelectItem value="pnpm">pnpm</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your preferred package manager for the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Quick description about the project"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* XML File Upload Section */}
            <FormItem>
              <FormLabel>XML Configuration *</FormLabel>
              <div className="mt-1">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="xml-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {!xmlFile ? (
                        <>
                          <Upload className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            XML file (Required)
                          </p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="text-sm font-medium">{xmlFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(xmlFile.size / 1024).toFixed(2)} KB
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFile();
                            }}
                          >
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      )}
                    </div>
                    <input
                      id="xml-upload"
                      ref={fileInputRef}
                      type="file"
                      accept=".xml,text/xml"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
              <FormDescription>
                Upload an XML configuration file for your project.
              </FormDescription>
            </FormItem>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options</h3>
              <FormField
                control={form.control}
                name="enableSwagger"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Swagger Documentation</FormLabel>
                      <FormDescription>
                        Enable Swagger documentation in your project.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {isLoading && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="form-footer">
              <Button type="submit" disabled={isLoading || !formIsValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
