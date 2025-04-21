"use client";

import { useState, useEffect, useActionState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { RefreshCw, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from "@/lib/db-actions/category-actions";
import { CyberpunkButton } from "./cyber-button";
import {
  useTableDialogs,
  RowActions,
  DeleteDialog,
  FormError,
  SubmitButton,
  TableItemWithPosts,
} from "@/components/custom/table-utils";
import { CategoryFormState } from "@/lib/types/form-types";
import { CyberPagination } from "./cyber-pagination";

interface Category extends TableItemWithPosts {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const CATEGORIES_PER_PAGE = 10;
  const totalPages = Math.ceil(totalCategories / CATEGORIES_PER_PAGE);

  const {
    editingItem: editingCategory,
    setEditingItem: setEditingCategory,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    itemToDelete: categoryToDelete,
    setItemToDelete: setCategoryToDelete,
    deleteResult,
    setDeleteResult,
    openEditDialog,
    openCreateDialog,
    confirmDelete,
    itemHasPosts: categoryHasPosts,
  } = useTableDialogs<Category>();

  const initialState: CategoryFormState = {
    errors: {},
    success: false,
    message: "",
  };

  const [formState, formAction] = useActionState(
    async (_prevState: CategoryFormState, formData: FormData) => {
      if (editingCategory) {
        return updateCategory(editingCategory.id, formData);
      } else {
        return createCategory(formData);
      }
    },
    initialState
  );

  // Load categories with pagination and search
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories({
        skip: (page - 1) * CATEGORIES_PER_PAGE,
        take: CATEGORIES_PER_PAGE,
        searchQuery,
      });
      setCategories(data.categories);
      setTotalCategories(data.totalCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (formState.success) {
      setIsDialogOpen(false);
      setEditingCategory(null);
      loadCategories();
      toast.success(formState.message);
    } else if (formState.message && !formState.success) {
      toast.error(formState.message);
    }
  }, [formState, setIsDialogOpen, setEditingCategory, loadCategories]);

  useEffect(() => {
    if (deleteResult) {
      if (deleteResult.success) {
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
        loadCategories();
        toast.success(deleteResult.message);
      } else if (deleteResult.message) {
        toast.error(deleteResult.message);
      }
    }
  }, [
    deleteResult,
    setIsDeleteDialogOpen,
    setCategoryToDelete,
    loadCategories,
  ]);

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;

    try {
      const result = await deleteCategory(categoryToDelete);
      setDeleteResult(result);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neon-cyan" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-neon-cyan/50"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={loadCategories}
            title="Refresh"
            className="border border-neon-cyan/30 bg-space-black/80 text-neon-cyan hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan/60"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <CyberpunkButton
          onClick={openCreateDialog}
          icon={<Plus className="h-4 w-4" />}
          size="sm"
          variant="secondary"
        >
          New Category
        </CyberpunkButton>
      </div>

      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <Card className="w-full h-full flex justify-center items-center bg-space-black/80 border-neon-cyan/30 backdrop-blur-md">
            <RefreshCw className="h-8 w-8 animate-spin text-neon-cyan" />
          </Card>
        </div>
      ) : categories.length > 0 ? (
        <div className="border border-neon-cyan/30 rounded-md bg-space-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <Table variant="cyberpunk">
            <TableHeader variant="cyberpunk">
              <TableRow variant="cyberpunk">
                <TableHead variant="cyberpunk">Name</TableHead>
                <TableHead variant="cyberpunk">Slug</TableHead>
                <TableHead variant="cyberpunk">Posts</TableHead>
                <TableHead variant="cyberpunk" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody variant="cyberpunk">
              {categories.map((category) => (
                <TableRow variant="cyberpunk" key={category.id}>
                  <TableCell variant="cyberpunk" highlight>
                    {category.name}
                  </TableCell>
                  <TableCell variant="cyberpunk">{category.slug}</TableCell>
                  <TableCell variant="cyberpunk">
                    {category._count.posts}
                  </TableCell>
                  <TableCell variant="cyberpunk" className="text-right">
                    <RowActions
                      item={category}
                      onEdit={openEditDialog}
                      onDelete={confirmDelete}
                      isDisabled={categoryHasPosts(category.id, categories)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="w-full p-10 text-center bg-space-black/80 border-neon-cyan/30 text-neon-cyan backdrop-blur-md">
          No categories found. Create your first category to get started.
        </Card>
      )}

      {totalPages > 1 && (
        <CyberPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 text-gray-200 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
          <DialogHeader>
            <DialogTitle className="text-neon-cyan font-mono flex items-center">
              <span className="text-neon-pink mr-2">[</span>
              {editingCategory ? "EDIT_CATEGORY" : "CREATE_CATEGORY"}
              <span className="text-neon-pink ml-2">]</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingCategory
                ? "Edit your category details below."
                : "Enter the details for your new category."}
            </DialogDescription>
          </DialogHeader>

          <form action={formAction} className="space-y-4">
            <FormError formState={formState} />

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-neon-cyan"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={editingCategory?.name || ""}
                placeholder="Category name"
                className="bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-gray-500"
              />
              <FormError formState={formState} fieldName="name" />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-sm font-medium text-neon-cyan"
              >
                Slug
              </label>
              <Input
                id="slug"
                name="slug"
                defaultValue={editingCategory?.slug || ""}
                placeholder="category-slug"
                className="bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-gray-500"
              />
              <FormError formState={formState} fieldName="slug" />
              <p className="text-xs text-gray-500">
                URL-friendly version of the category name
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-neon-cyan flex items-center"
              >
                Description{" "}
                <span className="text-gray-500 text-xs ml-1">(optional)</span>
              </label>
              <Input
                id="description"
                name="description"
                defaultValue={editingCategory?.description || ""}
                placeholder="Brief description of this category"
                className="bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-gray-500"
              />
              <FormError formState={formState} fieldName="description" />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="image"
                className="text-sm font-medium text-neon-cyan flex items-center"
              >
                Image URL{" "}
                <span className="text-gray-500 text-xs ml-1">(optional)</span>
              </label>
              <Input
                id="image"
                name="image"
                defaultValue={editingCategory?.image || ""}
                placeholder="https://example.com/image.jpg"
                className="bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-gray-500"
              />
              <FormError formState={formState} fieldName="image" />
              <p className="text-xs text-gray-500">
                URL to an image representing this category
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-space-black/80 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-500"
              >
                Cancel
              </Button>
              <SubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteCategory}
        itemType="category"
        warningMessage={
          categoryToDelete !== null &&
          categoryHasPosts(categoryToDelete, categories)
            ? "You cannot delete a category that is used by posts. Please remove the category from all posts first."
            : null
        }
        disabled={
          categoryToDelete !== null
            ? categoryHasPosts(categoryToDelete, categories)
            : false
        }
      />
    </div>
  );
}
