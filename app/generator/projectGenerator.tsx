"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Plus } from "lucide-react";

const ProjectGenerator = () => {
  const [projectName, setProjectName] = useState("");
  const [features, setFeatures] = useState({
    authentication: false,
    swagger: false,
    typeorm: false,
    caching: false,
    websockets: false,
  });

  const handleGenerateProject = () => {
    // Logic to generate project structure will go here
    console.log("Generating project with:", { projectName, features });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>NestJS Project Generator</CardTitle>
          <CardDescription>
            Generate a custom NestJS project with your preferred features and
            configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Project Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                placeholder="my-nest-project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            {/* Features Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="authentication"
                    checked={features.authentication}
                    onCheckedChange={(checked) =>
                      setFeatures((prev) => ({
                        ...prev,
                        authentication: checked === true,
                      }))
                    }
                  />
                  <label htmlFor="authentication">Authentication (JWT)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="swagger"
                    checked={features.swagger}
                    onCheckedChange={(checked) =>
                      setFeatures((prev) => ({
                        ...prev,
                        swagger: checked === true,
                      }))
                    }
                  />
                  <label htmlFor="swagger">Swagger Documentation</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="typeorm"
                    checked={features.typeorm}
                    onCheckedChange={(checked) =>
                      setFeatures((prev) => ({
                        ...prev,
                        typeorm: checked === true,
                      }))
                    }
                  />
                  <label htmlFor="typeorm">TypeORM Integration</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="caching"
                    checked={features.caching}
                    onCheckedChange={(checked) =>
                      setFeatures((prev) => ({
                        ...prev,
                        caching: checked === true,
                      }))
                    }
                  />
                  <label htmlFor="caching">Caching</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="websockets"
                    checked={features.websockets}
                    onCheckedChange={(checked) =>
                      setFeatures((prev) => ({
                        ...prev,
                        websockets: checked == true,
                      }))
                    }
                  />
                  <label htmlFor="websockets">WebSockets</label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() =>
                  setFeatures({
                    authentication: false,
                    swagger: false,
                    typeorm: false,
                    caching: false,
                    websockets: false,
                  })
                }
              >
                Reset
              </Button>
              <Button onClick={handleGenerateProject} disabled={!projectName}>
                <Download className="w-4 h-4 mr-2" />
                Generate Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectGenerator;
