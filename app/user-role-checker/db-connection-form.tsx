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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { post } from "@/lib/api";
import { DatabaseConnection } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Database, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  ipAddress: z.string().min(1, { message: "IP address is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string(),
  database: z.string().min(1, { message: "Database name is required" }),
  port: z.coerce.number().optional(),
});

type FormStatus = {
  type: "success" | "error" | null;
  message: string;
} | null;

export function DbConnectionForm({
  onConnect,
}: {
  onConnect: (connection: DatabaseConnection) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<FormStatus>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ipAddress: "",
      username: "",
      password: "",
      database: "",
      port: 4000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setStatus(null);

      // Simulate API call to test database connection
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // Actual API call would be something like:
      // const response = await fetch("/api/database/connect", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(values),
      // });
      console.log("check values", values);
      const response = await post("/api/database/connect", values);

      console.log("response", response);

      // console.log("response", response.json());

      // if (!response.ok) throw new Error("Failed to connect to database");
      // const data = await response.json();

      setIsConnected(true);
      setStatus({
        type: "success",
        message: `Successfully connected to database "${values.database}"`,
      });

      toast.success("Database connected successfully");

      // Notify parent component about successful connection
      onConnect(values);
    } catch (error) {
      setIsConnected(false);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to connect to database",
      });

      toast.error("Connection failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to connect to database",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection
        </CardTitle>
        <CardDescription>
          Enter your database connection details to check user-role conflicts
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
            <AlertTitle className="flex items-center gap-2">
              {status.type === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Connected
                </>
              ) : (
                "Connection Failed"
              )}
            </AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address/Hostname</FormLabel>
                  <FormControl>
                    <Input placeholder="localhost or 127.0.0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder="3306" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="database"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Database Name</FormLabel>
                    <FormControl>
                      <Input placeholder="mydatabase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="root" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="•••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={isLoading || isConnected}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isConnected ? "Connected" : "Test Connection"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
