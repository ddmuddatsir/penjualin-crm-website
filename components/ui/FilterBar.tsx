import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, Filter, X } from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "search" | "select" | "multiselect";
  placeholder?: string;
  options?: FilterOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  className?: string;
}

export interface FilterAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface FilterBarProps {
  title?: string;
  fields: FilterField[];
  actions?: FilterAction[];
  onClear?: () => void;
  className?: string;
  layout?: "horizontal" | "vertical";
  showClearButton?: boolean;
}

/**
 * Generic Filter Bar component
 * Provides consistent filtering interface across the application
 */
export function FilterBar({
  title,
  fields,
  actions,
  onClear,
  className,
  layout = "horizontal",
  showClearButton = true,
}: FilterBarProps) {
  const hasActiveFilters = fields.some((field) => {
    if (Array.isArray(field.value)) {
      return field.value.length > 0;
    }
    return field.value && field.value !== "";
  });

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case "search":
        return (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                field.placeholder || `Search ${field.label.toLowerCase()}...`
              }
              value={(field.value as string) || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={cn("pl-8", field.className)}
            />
          </div>
        );

      case "select":
        return (
          <Select
            value={(field.value as string) || undefined}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className={field.className}>
              <SelectValue
                placeholder={
                  field.placeholder || `Select ${field.label.toLowerCase()}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        // For now, simplified as single select - can be enhanced later
        return (
          <Select
            value={
              Array.isArray(field.value)
                ? field.value[0] || undefined
                : (field.value as string) || undefined
            }
            onValueChange={(value) => field.onChange([value])}
          >
            <SelectTrigger className={field.className}>
              <SelectValue
                placeholder={
                  field.placeholder || `Select ${field.label.toLowerCase()}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  const containerClasses = cn(
    "flex gap-4 p-4 bg-background border rounded-lg",
    layout === "vertical" ? "flex-col" : "flex-col sm:flex-row sm:items-center",
    className
  );

  const fieldsContainerClasses = cn(
    "flex gap-2",
    layout === "vertical" ? "flex-col" : "flex-col sm:flex-row sm:flex-wrap"
  );

  return (
    <div className={containerClasses}>
      {title && (
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">{title}</h3>
        </div>
      )}

      <div className={fieldsContainerClasses}>
        {fields.map((field) => (
          <div
            key={field.key}
            className="min-w-0 flex-1 sm:min-w-[200px] sm:max-w-[300px]"
          >
            <label className="sr-only">{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-shrink-0">
        {showClearButton && hasActiveFilters && onClear && (
          <Button variant="outline" size="sm" onClick={onClear}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}

        {actions?.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
