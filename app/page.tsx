import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Users, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="page-container">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          RBAC Application
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          A tool to support the development of NestJS projects
        </p>
      </div>

      <div className="grid-container space-y-2">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Create Project NestJS
              </CardTitle>
              <Code className="h-6 w-6 text-primary" />
            </div>
            <CardDescription>
              Initiate a new NestJS project with your desired configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Fill in the information to create a new NestJS project with your
              desired configurations.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/create-project" className="w-full">
              <Button className="w-full">
                Start
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Check User-Role
              </CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardDescription>
              Check conflicts between users and roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload your NestJS project source code and XML configuration file
              to check conflicts between users and roles.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/user-role-checker" className="w-full">
              <Button className="w-full">
                Start
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Check Role-Permission
              </CardTitle>
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardDescription>
              Check conflicts between roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload your NestJS project source code and XML configuration file
              to check conflicts between roles and permissions.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/role-permission-checker" className="w-full">
              <Button className="w-full">
                Start
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
