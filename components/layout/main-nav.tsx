"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Code, Users, Shield } from "lucide-react";

interface Route {
  href: string;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}

export function MainNav() {
  const pathname = usePathname();

  const routes: Route[] = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/create-project",
      label: "Create NestJS Project",
      active: pathname === "/create-project",
      icon: <Code className="mr-2 h-4 w-4" />,
    },
    {
      href: "/user-role-checker",
      label: "Check User-Role",
      active: pathname === "/user-role-checker",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/role-permission-checker",
      label: "Check Role-Permission",
      active: pathname === "/role-permission-checker",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      <Link
        href="/"
        className="text-xl font-bold text-primary mr-8 flex items-center"
      >
        <Code className="mr-2 h-6 w-6" />
        RBAC Application
      </Link>

      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground"
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
