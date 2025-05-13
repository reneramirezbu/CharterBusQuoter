import React from "react";
import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Trip Details" },
  { number: 2, label: "Bus Options" },
  { number: 3, label: "Quote Summary" }
];

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between items-center max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div 
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2", 
                currentStep >= step.number 
                  ? "step-active" 
                  : "text-gray-400 border-gray-300"
              )}
              id={`step-${step.number}-indicator`}
            >
              <span className="font-medium">{step.number}</span>
            </div>
            <span 
              className={cn(
                "text-xs sm:text-sm font-medium",
                currentStep >= step.number ? "" : "text-gray-400"
              )}
            >
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div 
              className={cn(
                "flex-1 h-1", 
                index < currentStep - 1 ? "bg-primary" : "bg-gray-200",
                "mx-2"
              )}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;
