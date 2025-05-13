import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  icon?: string;
  type?: "radio" | "checkbox";
  imageSrc?: string;
  features?: string[];
}

export function CheckboxItem({
  label,
  description,
  icon,
  imageSrc,
  features,
  className,
  type = "checkbox",
  ...props
}: CheckboxItemProps) {
  const isLarge = !!imageSrc || !!description;

  return (
    <label className={cn("checkbox-item cursor-pointer", className)}>
      <input type={type} className="sr-only" {...props} />
      <div className={cn(
        "rounded border border-gray-300 flex items-start transition duration-200",
        isLarge ? "p-4 rounded-lg" : "p-3"
      )}>
        <div className="flex-1">
          {imageSrc && (
            <img 
              src={imageSrc} 
              alt={label} 
              className="rounded-md mb-3 w-full h-40 object-cover" 
            />
          )}
          
          <div className={cn("flex items-center", !isLarge && "w-full justify-between")}>
            {icon && <i className={`${icon} ${isLarge ? "mr-2" : "mr-2"} text-gray-600`}></i>}
            <span className={isLarge ? "font-medium text-gray-800 mb-1" : ""}>{label}</span>
            
            {!isLarge && (
              <div className="checkmark hidden w-5 h-5 bg-primary rounded-full items-center justify-center text-white">
                <i className="ri-check-line text-xs"></i>
              </div>
            )}
          </div>
          
          {description && <p className="text-sm text-gray-600 mb-2">{description}</p>}
          
          {features && features.map((feature, idx) => (
            <div key={idx} className="flex items-center text-xs text-gray-500 mb-1">
              <i className={feature.split(' ')[0]} style={{ marginRight: '0.25rem' }}></i>
              <span>{feature.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
        
        {isLarge && (
          <div className="ml-3 mt-2">
            <div className="checkmark hidden w-5 h-5 bg-primary rounded-full items-center justify-center text-white">
              <i className="ri-check-line text-xs"></i>
            </div>
          </div>
        )}
      </div>
    </label>
  );
}
