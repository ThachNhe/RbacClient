import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import React from "react";

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number;
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export function Steps({
  currentStep,
  className,
  children,
  ...props
}: StepsProps) {
  const steps = React.Children.toArray(children);

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {steps.map((step, index) => {
        const stepProps = (step as React.ReactElement<StepProps>).props;
        const isCompleted = currentStep > index + 1;
        const isCurrent = currentStep === index + 1;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-center font-medium",
                  isCompleted ? "bg-primary text-primary-foreground" : "",
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : !isCompleted
                    ? "border-muted-foreground/20 text-muted-foreground"
                    : ""
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div
                className={cn(
                  "mt-2 text-center text-xs font-medium",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {stepProps.title}
              </div>
            </div>

            {!isLast && (
              <div
                className={cn(
                  "h-[2px] w-12 mx-2 bg-muted-foreground/20",
                  isCompleted ? "bg-primary" : ""
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Step({ title }: StepProps) {
  return null;
}
