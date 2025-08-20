import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  Share,
  Archive,
  RefreshCw,
} from "lucide-react";

export interface ActionItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  separator?: boolean;
}

export interface ActionMenuProps {
  items: ActionItem[];
  trigger?: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

/**
 * Generic Action Menu component
 * Provides consistent action menus across the application
 */
export function ActionMenu({
  items,
  trigger,
  align = "end",
  className,
}: ActionMenuProps) {
  const defaultTrigger = (
    <Button variant="ghost" className="h-8 w-8 p-0">
      <span className="sr-only">Open menu</span>
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={className}>
        {items.map((item, index) => (
          <React.Fragment key={item.key}>
            {item.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                item.variant === "destructive" &&
                  "text-red-600 focus:text-red-600 focus:bg-red-50"
              )}
            >
              {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Pre-built action items
export const COMMON_ACTIONS = {
  view: (onClick: () => void): ActionItem => ({
    key: "view",
    label: "View",
    icon: <Eye className="h-4 w-4" />,
    onClick,
  }),

  edit: (onClick: () => void): ActionItem => ({
    key: "edit",
    label: "Edit",
    icon: <Edit className="h-4 w-4" />,
    onClick,
  }),

  delete: (onClick: () => void): ActionItem => ({
    key: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4" />,
    onClick,
    variant: "destructive",
    separator: true,
  }),

  duplicate: (onClick: () => void): ActionItem => ({
    key: "duplicate",
    label: "Duplicate",
    icon: <Copy className="h-4 w-4" />,
    onClick,
  }),

  download: (onClick: () => void): ActionItem => ({
    key: "download",
    label: "Download",
    icon: <Download className="h-4 w-4" />,
    onClick,
  }),

  share: (onClick: () => void): ActionItem => ({
    key: "share",
    label: "Share",
    icon: <Share className="h-4 w-4" />,
    onClick,
  }),

  archive: (onClick: () => void): ActionItem => ({
    key: "archive",
    label: "Archive",
    icon: <Archive className="h-4 w-4" />,
    onClick,
  }),

  refresh: (onClick: () => void): ActionItem => ({
    key: "refresh",
    label: "Refresh",
    icon: <RefreshCw className="h-4 w-4" />,
    onClick,
  }),
};

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

/**
 * Confirmation Dialog component
 * Provides consistent confirmation dialogs
 */
export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={variant === "destructive" ? "destructive" : "default"}
          >
            {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  actions: ActionItem[];
  className?: string;
}

/**
 * Bulk Actions component
 * Provides bulk operation interface
 */
export function BulkActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  actions,
  className,
}: BulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-blue-900">
          {selectedCount} of {totalCount} selected
        </span>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSelectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            Clear Selection
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant={
              action.variant === "destructive" ? "destructive" : "outline"
            }
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
