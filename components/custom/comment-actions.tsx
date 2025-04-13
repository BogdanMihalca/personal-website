import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Heart, MessageSquare, Trash } from "lucide-react";
import { deleteComment, toggleCommentLike } from "@/lib/db-utils";
import { Session } from "next-auth";
import { Comment } from "@prisma/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CyberpunkButton } from "./cyber-button";
import { LoginModal } from "./login-modal";
import { signIn } from "next-auth/react";

interface CommentActionsProps {
  comment: Comment;
  session: Session;
  onEditClick: () => void;
  onReplyClick?: () => void;
  initialLikeState: boolean;
  initialLikeCount: number;
}

export function CommentActions({
  comment,
  session,
  onEditClick,
  onReplyClick,
  initialLikeState = false,
  initialLikeCount,
}: CommentActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(initialLikeState);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const handleGithubLogin = async () => {
    await signIn("github");
  };

  const isAuthor = session?.user?.id === comment.authorId;

  const handleDelete = async () => {
    if (!session || !session.user || !session.user.id) return;

    setIsDeleting(true);
    try {
      await deleteComment(comment.id, session.user.id);
      toast.success("Comment deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleLike = async () => {
    if (!session || !session.user || !session.user.id) {
      setLoginModalOpen(true);
      return;
    }

    setIsLiking(true);
    try {
      const result = await toggleCommentLike(comment.id, session.user.id);
      setHasLiked(result.action === "liked");
      toast.success(
        result.action === "liked"
          ? "Comment liked successfully"
          : "Comment unliked successfully"
      );
      setLikeCount(likeCount + (result.action === "liked" ? 1 : -1));
    } catch (error) {
      console.error("Failed to like comment:", error);
      toast.error("Failed to like comment");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = () => {
    if (!session || !session.user || !session.user.id) {
      setLoginModalOpen(true);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onReplyClick && onReplyClick();
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      <button
        onClick={handleLike}
        className={`text-xs transition-colors flex items-center ${
          hasLiked ? "text-neon-pink" : "text-zinc-400 hover:text-neon-cyan"
        } cursor-pointer`}
        disabled={isLiking}
        title={session ? "Like this comment" : "Sign in to like"}
        aria-label={hasLiked ? "Unlike comment" : "Like comment"}
      >
        <Heart
          size={14}
          className={`inline mr-1 ${isLiking ? "animate-pulse" : ""}`}
          fill={hasLiked ? "currentColor" : "none"}
        />
        {likeCount}
      </button>

      {onReplyClick && (
        <button
          onClick={handleReply}
          className="text-xs text-zinc-400 hover:text-neon-cyan transition-colors flex items-center cursor-pointer"
          title={session ? "Reply to this comment" : "Sign in to reply"}
          aria-label="Reply to comment"
        >
          <MessageSquare size={14} className="inline mr-1" />
          Reply
        </button>
      )}

      {isAuthor && (
        <>
          <button
            onClick={onEditClick}
            className="text-xs text-zinc-400 hover:text-neon-cyan transition-colors flex items-center cursor-pointer"
            aria-label="Edit comment"
          >
            <Edit size={14} className="inline mr-1" />
            Edit
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
            className="text-xs text-zinc-400 hover:text-red-400 transition-colors flex items-center cursor-pointer"
            aria-label="Delete comment"
          >
            <Trash size={14} className="inline mr-1" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </>
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-lg p-6 shadow-xl shadow-neon-pink/10">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl text-white">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription className="text-zinc-300 mt-2">
              This action cannot be undone. This will permanently delete your
              comment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 justify-end mt-6">
            <CyberpunkButton
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-zinc-800 hover:bg-zinc-700"
            >
              Cancel
            </CyberpunkButton>
            <CyberpunkButton
              type="button"
              onClick={handleDelete}
              className="bg-red-800 hover:bg-red-700"
            >
              Delete
            </CyberpunkButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LoginModal
        isOpen={isLoginModalOpen}
        setOpen={setLoginModalOpen}
        handleGoogleLogin={handleGoogleLogin}
        handleGithubLogin={handleGithubLogin}
      />
    </div>
  );
}
