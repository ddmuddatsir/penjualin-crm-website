import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingWrapper } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface FormDialogField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "select"
    | "textarea"
    | "date"
    | "datetime-local";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormDialogAction {
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormDialogField[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  customActions?: FormDialogAction[];
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  readOnly?: boolean;
  hideCancel?: boolean;
  children?: React.ReactNode;
}

/**
 * Generic Form Dialog component
 * Provides consistent form dialogs across the application
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  values,
  onChange,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  customActions,
  className,
  size = "md",
  readOnly = false,
  hideCancel = false,
  children,
}: FormDialogProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const renderField = (field: FormDialogField) => {
    const value = values[field.name];
    const stringValue =
      typeof value === "string" || typeof value === "number"
        ? String(value)
        : "";

    const commonProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder,
      required: field.required,
      disabled: field.disabled,
      value: stringValue,
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const newValue =
          field.type === "number"
            ? parseFloat(e.target.value) || 0
            : e.target.value;
        onChange(field.name, newValue);
      },
      className: cn(
        "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        field.disabled && "bg-gray-100 cursor-not-allowed",
        field.className
      ),
    };

    switch (field.type) {
      case "select":
        return (
          <Select
            value={stringValue || undefined}
            onValueChange={(value) => onChange(field.name, value)}
            disabled={field.disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full",
                field.disabled && "bg-gray-100 cursor-not-allowed",
                field.className
              )}
            >
              <SelectValue
                placeholder={field.placeholder || "Select an option"}
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

      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={3}
            className={cn(commonProps.className, "resize-none")}
          />
        );

      default:
        return <input {...commonProps} type={field.type} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        <LoadingWrapper isLoading={isSubmitting}>
          <form onSubmit={onSubmit} className="space-y-4">
            {children
              ? children
              : fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                      {field.required && !readOnly && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {renderField({
                      ...field,
                      disabled: field.disabled || readOnly,
                    })}
                    {field.validation?.message && !readOnly && (
                      <p className="text-xs text-red-600">
                        {field.validation.message}
                      </p>
                    )}
                  </div>
                ))}

            <DialogFooter className="flex gap-2 pt-4">
              {!hideCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button>
              )}

              {customActions?.map((action, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={action.variant}
                  onClick={action.onClick}
                  disabled={action.disabled || isSubmitting}
                >
                  {action.loading && (
                    <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                  )}
                  {action.label}
                </Button>
              ))}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                )}
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </LoadingWrapper>
      </DialogContent>
    </Dialog>
  );
}
