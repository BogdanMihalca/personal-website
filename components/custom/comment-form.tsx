"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CyberpunkButton } from "./cyber-button";
import { createComment, editComment } from "@/lib/db-actions/comment-actions";
import { useRouter } from "next/navigation";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be less than 500 characters"),
});

interface CommentFormProps {
  postId: number;
  userId: string;
  parentId?: number | null;
  initialContent?: string;
  commentId?: number | null;
  onCancel?: (() => void) | null;
  onSuccess?: () => void;
}

export function CommentForm({
  postId,
  userId,
  parentId = null,
  initialContent = "",
  commentId = null,
  onCancel = null,
  onSuccess,
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialContent,
    },
  });

  const isEditing = !!commentId;

  const handleSubmit = async (data: z.infer<typeof commentSchema>) => {
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("userId", userId);

      if (isEditing) {
        formData.append("commentId", commentId.toString());
        await editComment(formData);
      } else {
        formData.append("postId", postId.toString());
        if (parentId) {
          formData.append("parentId", parentId.toString());
        }
        await createComment(formData);
      }

      form.reset();
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {//eslint-disable-line
      setError(err.message || "Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={
                      isEditing ? "Edit your comment..." : "Write a comment..."
                    }
                    className="resize-none h-24 bg-zinc-800/40 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <CyberpunkButton type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting
                ? "Submitting..."
                : isEditing
                ? "Update Comment"
                : "Post Comment"}
            </CyberpunkButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
