"use client";

import { useState } from "react";
import { DbConnectionForm } from "./db-connection-form";
import { UserRoleConflictChecker } from "./user-role-conflict-checker";
import { DatabaseConnection } from "@/types";
import { Steps, Step } from "@/components/ui/steps";

export default function UserRoleCheckerPage() {
  const [connection, setConnection] = useState<DatabaseConnection | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleConnect = (connectionData: DatabaseConnection) => {
    setConnection(connectionData);
    setCurrentStep(2);
  };

  return (
    <div className="page-container">
      <h1 className="page-title text-center">Check User-Role Conflicts</h1>

      <Steps currentStep={currentStep} className="mb-8 justify-center">
        <Step title="Connect to Database" />
        <Step title="Check Conflicts" />
      </Steps>

      {!connection ? (
        <DbConnectionForm onConnect={handleConnect} />
      ) : (
        <UserRoleConflictChecker connection={connection} />
      )}
    </div>
  );
}
