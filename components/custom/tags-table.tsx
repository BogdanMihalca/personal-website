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
  createTag,
  updateTag,
  deleteTag,
  getAllTags,
} from "@/lib/db-actions/tag-actions";
import { TagFormState } from "@/lib/types/form-types";
import { CyberpunkButton } from "./cyber-button";
import {
  useTableDialogs,
  RowActions,
  DeleteDialog,
  FormError,
  SubmitButton,
  TableItemWithPosts,
} from "@/components/custom/table-utils";
import { CyberPagination } from "./cyber-pagination";

interface Tag extends TableItemWithPosts {
  name: string;
  slug: string;
}

export function TagsTable() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalTags, setTotalTags] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const TAGS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalTags / TAGS_PER_PAGE);

  const {
    editingItem: editingTag,
    setEditingItem: setEditingTag,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    itemToDelete: tagToDelete,
    setItemToDelete: setTagToDelete,
    deleteResult,
    setDeleteResult,
    openEditDialog,
    openCreateDialog,
    confirmDelete,
    itemHasPosts: tagHasPosts,
  } = useTableDialogs<Tag>();

  const initialState: TagFormState = {
    errors: {},
    success: false,
    message: "",
  };

  const [formState, formAction] = useActionState(
    async (prevState: TagFormState, formData: FormData) => {
      if (editingTag) {
        return updateTag(editingTag.id, prevState, formData);
      } else {
        return createTag(prevState, formData);
      }
    },
    initialState
  );

  // Load tags with pagination and search
  const loadTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllTags({
        skip: (page - 1) * TAGS_PER_PAGE,
        take: TAGS_PER_PAGE,
        searchQuery,
      });
      setTags(data.tags);
      setTotalTags(data.totalTags);
    } catch (error) {
      console.error("Error loading tags:", error);
      toast.error("Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  useEffect(() => {
    if (formState.success) {
      setIsDialogOpen(false);
      setEditingTag(null);
      loadTags();
      toast.success(formState.message);
    } else if (formState.message && !formState.success) {
      toast.error(formState.message);
    }
  }, [formState, setIsDialogOpen, setEditingTag, loadTags]);

  useEffect(() => {
    if (deleteResult) {
      if (deleteResult.success) {
        setIsDeleteDialogOpen(false);
        setTagToDelete(null);
        loadTags();
        toast.success(deleteResult.message);
      } else if (deleteResult.message) {
        toast.error(deleteResult.message);
      }
    }
  }, [deleteResult, setIsDeleteDialogOpen, setTagToDelete, loadTags]);

  async function handleDeleteTag() {
    if (!tagToDelete) return;

    try {
      const result = await deleteTag(tagToDelete);
      setDeleteResult(result);
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neon-cyan" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-neon-cyan/50"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={loadTags}
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
          New Tag
        </CyberpunkButton>
      </div>

      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <Card className="w-full h-full flex justify-center items-center bg-space-black/80 border-neon-cyan/30 backdrop-blur-md">
            <RefreshCw className="h-8 w-8 animate-spin text-neon-cyan" />
          </Card>
        </div>
      ) : tags.length > 0 ? (
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
              {tags.map((tag) => (
                <TableRow variant="cyberpunk" key={tag.id}>
                  <TableCell variant="cyberpunk" highlight>
                    {tag.name}
                  </TableCell>
                  <TableCell variant="cyberpunk">{tag.slug}</TableCell>
                  <TableCell variant="cyberpunk">{tag._count.posts}</TableCell>
                  <TableCell variant="cyberpunk" className="text-right">
                    <RowActions
                      item={tag}
                      onEdit={openEditDialog}
                      onDelete={confirmDelete}
                      isDisabled={tagHasPosts(tag.id, tags)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="w-full p-10 text-center bg-space-black/80 border-neon-cyan/30 text-neon-cyan backdrop-blur-md">
          No tags found. Create your first tag to get started.
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
              {editingTag ? "EDIT_TAG" : "CREATE_TAG"}
              <span className="text-neon-pink ml-2">]</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingTag
                ? "Edit your tag details below."
                : "Enter the details for your new tag."}
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
                defaultValue={editingTag?.name || ""}
                placeholder="Tag name"
                aria-describedby={
                  formState.errors &&
                  "name" in formState.errors &&
                  formState.errors.name
                    ? "name-error"
                    : undefined
                }
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
                defaultValue={editingTag?.slug || ""}
                placeholder="tag-slug"
                aria-describedby={
                  formState.errors &&
                  "slug" in formState.errors &&
                  formState.errors.slug
                    ? "slug-error"
                    : undefined
                }
                className="bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-gray-500"
              />
              <FormError formState={formState} fieldName="slug" />
              <p className="text-xs text-gray-500">
                URL-friendly version of the tag name
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
        onDelete={handleDeleteTag}
        itemType="tag"
        warningMessage={
          tagToDelete !== null && tagHasPosts(tagToDelete, tags)
            ? "You cannot delete a tag that is used by posts. Please remove the tag from all posts first."
            : null
        }
        disabled={tagToDelete !== null ? tagHasPosts(tagToDelete, tags) : false}
      />
    </div>
  );
}
