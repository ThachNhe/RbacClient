import { ProjectForm } from "@/components/create-project/project-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create NestJS Project",
  description: "Tạo dự án NestJS mới với các tùy chọn mong muốn",
};

export default function CreateProjectPage() {
  return (
    <div className="page-container">
      <h1 className="page-title text-center">Create Nestjs Project</h1>
      <ProjectForm />
    </div>
  );
}
