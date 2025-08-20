import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BulkAction<T = Record<string, unknown>> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedItems: T[]) => void;
  variant?: "default" | "destructive" | "outline";
  disabled?: (selectedItems: T[]) => boolean;
}

interface BulkActionsProps<T = Record<string, unknown>> {
  selectedItems: T[];
  actions: BulkAction<T>[];
  className?: string;
  onClearSelection?: () => void;
}

export function BulkActions<T = Record<string, unknown>>({
  selectedItems,
  actions,
  className,
  onClearSelection,
}: BulkActionsProps<T>) {
  if (selectedItems.length === 0) {
    return null;
  }

  const handleAction = (action: BulkAction<T>) => {
    action.onClick(selectedItems);
    onClearSelection?.();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-4 bg-muted/50 rounded-lg border",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">
        {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
        selected
      </span>

      <div className="flex items-center gap-2 ml-auto">
        {actions.length === 1 ? (
          <Button
            size="sm"
            variant={actions[0].variant || "default"}
            onClick={() => handleAction(actions[0])}
            disabled={actions[0].disabled?.(selectedItems)}
          >
            {actions[0].icon}
            {actions[0].label}
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                Actions
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  onClick={() => handleAction(action)}
                  disabled={action.disabled?.(selectedItems)}
                  className={cn(
                    action.variant === "destructive" &&
                      "text-red-600 focus:text-red-600"
                  )}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {onClearSelection && (
          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            Clear selection
          </Button>
        )}
      </div>
    </div>
  );
}
