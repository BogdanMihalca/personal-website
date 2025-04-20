import { useState } from "react";
import { BaseFormState } from "@/lib/types/form-types";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { AlertCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TableItemWithPosts {
  id: number;
  _count: {
    posts: number;
  };
}

export function useTableDialogs<T extends TableItemWithPosts>() {
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleteResult, setDeleteResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  function openEditDialog(item: T) {
    setEditingItem(item);
    setIsDialogOpen(true);
  }

  function openCreateDialog() {
    setEditingItem(null);
    setIsDialogOpen(true);
  }

  function confirmDelete(id: number) {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  function itemHasPosts(id: number, items: T[]): boolean {
    const item = items.find((i) => i.id === id);
    return (item?._count.posts || 0) > 0;
  }

  return {
    editingItem,
    setEditingItem,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    itemToDelete,
    setItemToDelete,
    deleteResult,
    setDeleteResult,
    openEditDialog,
    openCreateDialog,
    confirmDelete,
    itemHasPosts,
  };
}

export function useTableSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  initialQuery = ""
) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredItems = items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    })
  );

  return { searchQuery, setSearchQuery, filteredItems };
}

export function RowActions<T extends { id: number }>({
  item,
  onEdit,
  onDelete,
  isDisabled = false,
  extraActions,
}: {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  isDisabled?: boolean;
  extraActions?: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-pink/10"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-space-black/90 backdrop-blur-md border-neon-cyan/40"
      >
        <DropdownMenuItem
          onClick={() => onEdit(item)}
          className="text-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/10 focus:bg-neon-cyan/20 cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>

        {extraActions}

        {extraActions && <DropdownMenuSeparator className="bg-neon-cyan/20" />}

        <DropdownMenuItem
          onClick={() => onDelete(item.id)}
          className={`${
            isDisabled
              ? "text-gray-500 cursor-not-allowed"
              : "text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:bg-red-900/30 cursor-pointer"
          }`}
          disabled={isDisabled}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DeleteDialog({
  open,
  onOpenChange,
  onDelete,
  itemType = "item",
  warningMessage,
  disabled = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  itemType?: string;
  warningMessage?: string | null;
  disabled?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-space-black/90 backdrop-blur-md border border-red-500/50 text-gray-200 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-red-400 font-mono flex items-center">
            <span className="text-neon-cyan mr-2">[</span>
            CONFIRM_DELETION
            <span className="text-neon-cyan ml-2">]</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete this {itemType}? This action cannot
            be undone.
            {warningMessage && (
              <p className="text-red-400 mt-2 border border-red-500/30 bg-red-900/20 p-2 rounded">
                <AlertCircle className="inline-block h-4 w-4 mr-1" />
                {warningMessage}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-space-black/80 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-500"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={disabled}
            className="bg-space-black/80 border border-red-500/70 text-red-400 hover:bg-red-900/50 hover:text-white shadow-[0_0_10px_rgba(255,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FormError({
  formState,
  fieldName,
}: {
  formState: BaseFormState;
  fieldName?: string;
}) {
  if (!fieldName && formState.errors?._form) {
    return (
      <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-md p-3 flex gap-2 text-sm">
        <AlertCircle className="h-4 w-4" />
        {formState.errors._form}
      </div>
    );
  }

  if (fieldName && formState.errors && formState.errors[fieldName]) {
    return (
      <p className="text-sm text-red-400">{formState.errors[fieldName]}</p>
    );
  }

  return null;
}

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-space-black/80 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 hover:text-white shadow-[0_0_10px_rgba(0,255,255,0.3)] disabled:opacity-70"
    >
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
