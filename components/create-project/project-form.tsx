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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
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
import { ProjectFormData } from "@/types";

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Tên dự án phải có ít nhất 2 ký tự.",
  }),
  description: z.string().optional(),
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
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      enableAuth: false,
      enableSwagger: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setStatus(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Giả lập call API
      // const response = await fetch('/api/create-project', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values)
      // })

      // if (!response.ok) throw new Error('Có lỗi xảy ra khi tạo dự án')
      // const data = await response.json()

      setStatus({
        type: "success",
        message: `Dự án "${values.projectName}" đã được tạo thành công!`,
      });

      toast({
        title: "Thành công",
        description: `Dự án "${values.projectName}" đã được tạo thành công!`,
      });

      form.reset();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tạo dự án.",
      });

      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tạo dự án.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create new nestjs project</CardTitle>
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
              {status.type === "success" ? "Thành công" : "Lỗi"}
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
                  <FormLabel>Project name</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về dự án của bạn"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Option</h3>

              <FormField
                control={form.control}
                name="enableAuth"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Authentication</FormLabel>
                      <FormDescription>
                        Enable authentication in your project.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

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

            <div className="form-footer">
              <Button type="submit" disabled={isLoading}>
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
