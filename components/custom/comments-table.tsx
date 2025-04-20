/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { CommentStatus } from "@prisma/client";
import { RefreshCw, Search, Check, X, Ban, Eye, Trash } from "lucide-react";
import { toast } from "sonner";
import { CyberpunkButton } from "./cyber-button";
import { useTableDialogs, DeleteDialog } from "@/components/custom/table-utils";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAllComments,
  updateCommentStatus,
  deleteComment,
} from "@/lib/db-actions/comment-actions";
import { CyberPagination } from "./cyber-pagination";

interface Comment {
  id: number;
  content: string;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  status: CommentStatus;
  postId: number;
  post: {
    id: number;
    title: string;
    slug: string;
  };
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    likes: number;
    replies: number;
  };
}

export function CommentsTable() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewComment, setPreviewComment] = useState<Comment | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    CommentStatus | undefined
  >(undefined);

  const COMMENTS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);

  const {
    itemToDelete: commentToDelete,
    setItemToDelete: setCommentToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteResult,
    setDeleteResult,
    confirmDelete,
  } = useTableDialogs<any>();

  // Load comments when dependencies change
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { comments: fetchedComments, totalComments: total } =
        await getAllComments({
          skip: (page - 1) * COMMENTS_PER_PAGE,
          take: COMMENTS_PER_PAGE,
          status: selectedStatus,
          searchQuery,
        });
      setComments(fetchedComments);
      setTotalComments(total);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, selectedStatus]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (deleteResult) {
      if (deleteResult.success) {
        setIsDeleteDialogOpen(false);
        setCommentToDelete(null);
        loadComments();
        toast.success(deleteResult.message || "Comment deleted successfully");
      } else if (deleteResult.message) {
        toast.error(deleteResult.message);
      }
    }
  }, [deleteResult, setIsDeleteDialogOpen, setCommentToDelete, loadComments]);

  async function handleDeleteComment() {
    if (!commentToDelete) return;

    try {
      await deleteComment(commentToDelete);
      setDeleteResult({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      setDeleteResult({ success: false, message: "Failed to delete comment" });
    }
  }

  async function handleStatusUpdate(
    commentId: number,
    newStatus: CommentStatus
  ) {
    setStatusUpdateLoading(commentId);
    try {
      await updateCommentStatus(commentId, newStatus);

      // Reload comments to get fresh data
      loadComments();

      toast.success(`Comment ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error(`Error updating comment status to ${newStatus}:`, error);
      toast.error(`Failed to update comment status to ${newStatus}`);
    } finally {
      setStatusUpdateLoading(null);
    }
  }

  function getStatusBadge(status: CommentStatus) {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-700/20 text-green-400 hover:bg-green-700/30 border border-green-600/30">
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-700/20 text-yellow-400 hover:bg-yellow-700/30 border border-yellow-600/30">
            Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-700/20 text-red-400 hover:bg-red-700/30 border border-red-600/30">
            Rejected
          </Badge>
        );
      case "SPAM":
        return (
          <Badge className="bg-purple-700/20 text-purple-400 hover:bg-purple-700/30 border border-purple-600/30">
            Spam
          </Badge>
        );
      default:
        return null;
    }
  }

  function handlePreview(comment: Comment) {
    setPreviewComment(comment);
    setIsPreviewOpen(true);
  }

  const statusButtons = (comment: Comment) => (
    <div className="flex space-x-1">
      {comment.status !== "APPROVED" && (
        <Button
          variant="ghost"
          size="icon"
          disabled={statusUpdateLoading === comment.id}
          onClick={() => handleStatusUpdate(comment.id, "APPROVED")}
          className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-900/30"
          title="Approve"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
      {comment.status !== "REJECTED" && (
        <Button
          variant="ghost"
          size="icon"
          disabled={statusUpdateLoading === comment.id}
          onClick={() => handleStatusUpdate(comment.id, "REJECTED")}
          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/30"
          title="Reject"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {comment.status !== "SPAM" && (
        <Button
          variant="ghost"
          size="icon"
          disabled={statusUpdateLoading === comment.id}
          onClick={() => handleStatusUpdate(comment.id, "SPAM")}
          className="h-8 w-8 text-purple-500 hover:text-purple-400 hover:bg-purple-900/30"
          title="Mark as spam"
        >
          <Ban className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePreview(comment)}
        className="h-8 w-8 text-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/20"
        title="Preview"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neon-cyan" />
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-neon-cyan/50"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => loadComments()}
            title="Refresh"
            className="border border-neon-cyan/30 bg-space-black/80 text-neon-cyan hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan/60"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-space-black/80 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/70 hover:text-neon-cyan/70"
              >
                {selectedStatus ? selectedStatus : "All Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-space-black/90 backdrop-blur-md border-neon-cyan/40">
              <DropdownMenuItem
                onClick={() => setSelectedStatus(undefined)}
                className="text-neon-cyan hover:text-white hover:bg-neon-cyan/10 focus:bg-neon-cyan/20 cursor-pointer"
              >
                All Status
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neon-cyan/20" />
              <DropdownMenuItem
                onClick={() => setSelectedStatus(CommentStatus.APPROVED)}
                className="text-green-400 hover:text-white hover:bg-green-800/20 focus:bg-green-800/30 cursor-pointer"
              >
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus(CommentStatus.PENDING)}
                className="text-yellow-400 hover:text-white hover:bg-yellow-800/20 focus:bg-yellow-800/30 cursor-pointer"
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus(CommentStatus.REJECTED)}
                className="text-red-400 hover:text-white hover:bg-red-800/20 focus:bg-red-800/30 cursor-pointer"
              >
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus(CommentStatus.SPAM)}
                className="text-purple-400 hover:text-white hover:bg-purple-800/20 focus:bg-purple-800/30 cursor-pointer"
              >
                Spam
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <Card className="w-full h-full flex justify-center items-center bg-space-black/80 border-neon-cyan/30 backdrop-blur-md">
            <RefreshCw className="h-8 w-8 animate-spin text-neon-cyan" />
          </Card>
        </div>
      ) : comments.length > 0 ? (
        <div className="border border-neon-cyan/30 rounded-md bg-space-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <Table variant="cyberpunk">
            <TableHeader variant="cyberpunk">
              <TableRow variant="cyberpunk">
                <TableHead variant="cyberpunk">Author</TableHead>
                <TableHead variant="cyberpunk">Comment</TableHead>
                <TableHead variant="cyberpunk">Post</TableHead>
                <TableHead variant="cyberpunk">Status</TableHead>
                <TableHead variant="cyberpunk">Date</TableHead>
                <TableHead variant="cyberpunk" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody variant="cyberpunk">
              {comments.map((comment) => (
                <TableRow variant="cyberpunk" key={comment.id}>
                  <TableCell variant="cyberpunk" className="whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8 border border-neon-cyan/30">
                        <AvatarImage
                          src={comment.author.image || ""}
                          alt={comment.author.name || ""}
                        />
                        <AvatarFallback className="bg-space-black text-neon-cyan">
                          {comment.author.name?.substring(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-neon-cyan">
                        {comment.author.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell variant="cyberpunk">
                    <div className="max-w-xs truncate">
                      {comment.content.length > 60
                        ? `${comment.content.substring(0, 60)}...`
                        : comment.content}
                    </div>
                  </TableCell>
                  <TableCell variant="cyberpunk">
                    <Link
                      href={`/blog/${comment.post.slug}`}
                      className="text-neon-cyan hover:text-neon-pink hover:underline transition-colors"
                    >
                      {comment.post.title.length > 25
                        ? `${comment.post.title.substring(0, 25)}...`
                        : comment.post.title}
                    </Link>
                  </TableCell>
                  <TableCell variant="cyberpunk">
                    {getStatusBadge(comment.status)}
                  </TableCell>
                  <TableCell variant="cyberpunk" className="whitespace-nowrap">
                    {formatRelativeTime(
                      new Date(comment.createdAt),
                      new Date()
                    )}
                  </TableCell>
                  <TableCell variant="cyberpunk" className="text-right">
                    <div className="flex justify-end items-center space-x-1">
                      {statusButtons(comment)}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(comment.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/30"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="w-full p-10 text-center bg-space-black/80 border-neon-cyan/30 text-neon-cyan backdrop-blur-md">
          No comments found.
        </Card>
      )}

      {totalPages > 1 && (
        <CyberPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 text-gray-200 shadow-[0_0_20px_rgba(0,255,255,0.2)] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-neon-cyan font-mono flex items-center">
              <span className="text-neon-pink mr-2">[</span>
              COMMENT_PREVIEW
              <span className="text-neon-pink ml-2">]</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Full comment details
            </DialogDescription>
          </DialogHeader>

          {previewComment && (
            <div className="space-y-4 mt-4">
              <div className="border border-neon-cyan/30 rounded-lg p-4 bg-space-black/60">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10 border border-neon-cyan/50">
                    <AvatarImage
                      src={previewComment.author.image || ""}
                      alt={previewComment.author.name || ""}
                    />
                    <AvatarFallback className="bg-space-black text-neon-cyan">
                      {previewComment.author.name?.substring(0, 2) || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-neon-cyan">
                      {previewComment.author.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(previewComment.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="border-l-2 border-neon-cyan/30 pl-4 py-2 my-2">
                  <p className="text-gray-200 whitespace-pre-wrap">
                    {previewComment.content}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      Post: {previewComment.post.title}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="text-xs text-gray-400">
                      {previewComment._count.likes} likes
                    </div>
                    <div className="text-xs text-gray-400">
                      {previewComment._count.replies} replies
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>{getStatusBadge(previewComment.status)}</div>
                <div className="flex space-x-2">
                  {previewComment.status !== "APPROVED" && (
                    <CyberpunkButton
                      size="sm"
                      variant="success"
                      onClick={() => {
                        handleStatusUpdate(previewComment.id, "APPROVED");
                        setIsPreviewOpen(false);
                      }}
                    >
                      Approve
                    </CyberpunkButton>
                  )}
                  {previewComment.status !== "REJECTED" && (
                    <CyberpunkButton
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        handleStatusUpdate(previewComment.id, "REJECTED");
                        setIsPreviewOpen(false);
                      }}
                    >
                      Reject
                    </CyberpunkButton>
                  )}
                  {previewComment.status !== "SPAM" && (
                    <CyberpunkButton
                      size="sm"
                      variant="warning"
                      onClick={() => {
                        handleStatusUpdate(previewComment.id, "SPAM");
                        setIsPreviewOpen(false);
                      }}
                    >
                      Mark as Spam
                    </CyberpunkButton>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="bg-space-black/80 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-500"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteComment}
        itemType="comment"
      />
    </div>
  );
}
