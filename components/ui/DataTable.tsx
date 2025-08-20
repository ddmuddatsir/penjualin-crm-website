import React, { useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LoadingWrapper, EmptyState, Checkbox } from "@/components/ui";
import { BulkActionsComponent as BulkActions } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
  className?: string;
  width?: string;
}

export interface DataTableAction<T = Record<string, unknown>> {
  label: string;
  onClick: (item: T) => void;
  variant?: "default" | "destructive" | "outline";
  icon?: React.ReactNode;
  disabled?: (item: T) => boolean;
}

export interface BulkActionItem<T = Record<string, unknown>> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedItems: T[]) => void;
  variant?: "default" | "destructive" | "outline";
  disabled?: (selectedItems: T[]) => boolean;
}

export interface DataTableProps<T = Record<string, unknown>> {
  data?: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  bulkActions?: BulkActionItem<T>[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  rowKey?: keyof T | ((item: T) => string);
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
}

/**
 * Generic DataTable component
 * Provides consistent table functionality across all data tables
 */
export function DataTable<T = Record<string, unknown>>({
  data,
  columns,
  actions,
  bulkActions,
  isLoading = false,
  emptyTitle = "No data available",
  emptyDescription = "There are no items to display.",
  className,
  sortBy,
  sortOrder,
  onSort,
  rowKey = "id" as keyof T,
  selectable = false,
  onSelectionChange,
}: DataTableProps<T>) {
  // Selection state
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const getRowKey = useCallback(
    (item: T, index: number): string => {
      if (typeof rowKey === "function") {
        return rowKey(item);
      }
      return String(item[rowKey] || index);
    },
    [rowKey]
  );

  // Selection logic
  const isSelected = useCallback(
    (item: T) => {
      return selectedItems.some(
        (selected) => getRowKey(selected, 0) === getRowKey(item, 0)
      );
    },
    [selectedItems, getRowKey]
  );

  const isAllSelected = useMemo(() => {
    return data && data.length > 0 && selectedItems.length === data.length;
  }, [data, selectedItems.length]);

  const isIndeterminate = useMemo(() => {
    return (
      selectedItems.length > 0 && data && selectedItems.length < data.length
    );
  }, [data, selectedItems.length]);

  const handleSelectItem = useCallback(
    (item: T, checked: boolean) => {
      setSelectedItems((prev) => {
        const updated = checked
          ? [...prev, item]
          : prev.filter(
              (selected) => getRowKey(selected, 0) !== getRowKey(item, 0)
            );
        onSelectionChange?.(updated);
        return updated;
      });
    },
    [getRowKey, onSelectionChange]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const updated = checked ? [...(data || [])] : [];
      setSelectedItems(updated);
      onSelectionChange?.(updated);
    },
    [data, onSelectionChange]
  );

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const handleSort = (key: string) => {
    if (onSort && columns.find((col) => col.key === key)?.sortable) {
      onSort(key);
    }
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return null;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-1 h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3" />
    );
  };

  const renderCell = (column: DataTableColumn<T>, item: T) => {
    const value = item[column.key as keyof T];

    if (column.render) {
      return column.render(value, item);
    }

    return value?.toString() || "-";
  };

  const renderActions = (item: T) => {
    if (!actions || actions.length === 0) {
      return null;
    }

    if (actions.length === 1) {
      const action = actions[0];
      return (
        <Button
          size="sm"
          variant={action.variant || "outline"}
          onClick={() => action.onClick(item)}
          disabled={action.disabled?.(item)}
        >
          {action.icon}
          {action.label}
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(item)}
              disabled={action.disabled?.(item)}
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
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Bulk Actions */}
      {selectable && bulkActions && bulkActions.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          actions={bulkActions}
          onClearSelection={clearSelection}
        />
      )}

      {/* Data Table */}
      <div className="overflow-x-auto">
        <LoadingWrapper isLoading={isLoading}>
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      column.className,
                      column.sortable && "cursor-pointer hover:bg-muted/50",
                      column.width && `w-[${column.width}]`
                    )}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && renderSortIcon(column.key)}
                    </div>
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead className="w-[100px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data || data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (actions?.length ? 1 : 0) +
                      (selectable ? 1 : 0)
                    }
                    className="p-0"
                  >
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      variant="minimal"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                (data || []).map((item, index) => (
                  <TableRow key={getRowKey(item, index)}>
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected(item)}
                          onCheckedChange={(checked) =>
                            handleSelectItem(item, checked as boolean)
                          }
                          aria-label={`Select row`}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {renderCell(column, item)}
                      </TableCell>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableCell>{renderActions(item)}</TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </LoadingWrapper>
      </div>
    </div>
  );
}
