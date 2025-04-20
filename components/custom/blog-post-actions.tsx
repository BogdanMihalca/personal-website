"use client";

import {
  incrementShareCount,
  togglePostLike,
} from "@/lib/db-actions/post-actions";
import { scrollToSection } from "@/lib/utils";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { LoginModal } from "./login-modal";

interface BlogPostActionsProps {
  postId: number;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  hasLiked: boolean;
}

const BlogPostActions = ({
  postId,
  hasLiked: initialHasLiked,
  likesCount = 0,
  commentsCount = 0,
  sharesCount = 0,
}: BlogPostActionsProps) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const session = useSession();
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [currentSharesCount, setCurrentSharesCount] = useState(sharesCount);
  const [isLiking, setIsLiking] = useState(false);
  const isAuthenticated = session.status === "authenticated";

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const handleGithubLogin = async () => {
    await signIn("github");
  };

  async function handleLike() {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }

    setHasLiked((prev) => !prev);
    setCurrentLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));
    setIsLiking(true);

    try {
      await togglePostLike(postId, session.data.user!.id!);
    } catch {
      setHasLiked((prev) => !prev);
      setCurrentLikesCount((prev) => (!hasLiked ? prev - 1 : prev + 1));
      toast.error("Failed to update like status. Please try again.");
    } finally {
      setIsLiking(false);
    }
  }

  async function handleComment() {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    scrollToSection("comments");
  }

  async function handleShare() {
    const prevCount = currentSharesCount;
    setCurrentSharesCount(prevCount + 1);

    // basic share functionality
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this blog post!",
          text: "I found this blog post interesting. Check it out!",
          url: window.location.href,
        });

        await incrementShareCount(postId);
      } catch {
        setCurrentSharesCount(prevCount);
        toast.error("Failed to share the post.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        await incrementShareCount(postId);
        toast.success("Link copied to clipboard!");
      } catch {
        setCurrentSharesCount(prevCount);
        toast.error("Unable to copy link. Please try again.");
      }
    }
  }
  return (
    <div className="flex gap-2">
      <button
        onClick={handleLike}
        disabled={isLiking}
        className={`flex items-center gap-2 group hover:scale-105 transition-transform ${
          isLiking ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div
          className={`flex items-center justify-center h-9 w-9 rounded-full border ${
            hasLiked
              ? "bg-neon-cyan/10 border-neon-cyan"
              : "border-slate-700 hover:border-neon-cyan"
          } ${isLiking ? "animate-pulse" : ""}`}
        >
          {hasLiked ? (
            <Heart size={16} className="fill-neon-cyan text-neon-cyan" />
          ) : (
            <Heart size={16} className="group-hover:text-neon-cyan" />
          )}
        </div>
        <span
          className={`text-sm font-medium ${
            hasLiked
              ? "text-neon-cyan"
              : "text-slate-400 group-hover:text-neon-cyan"
          }`}
        >
          {currentLikesCount}
        </span>
      </button>

      <button
        onClick={handleComment}
        className="flex items-center gap-2 group hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="flex items-center justify-center h-9 w-9 rounded-full border border-slate-700 hover:border-neon-pink">
          <MessageSquare size={16} className="group-hover:text-neon-pink" />
        </div>
        <span className="text-sm font-medium text-slate-400 group-hover:text-neon-pink">
          {commentsCount}
        </span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 group hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="flex items-center justify-center h-9 w-9 rounded-full border border-slate-700 hover:border-neon-purple">
          <Share2 size={16} className="group-hover:text-neon-purple" />
        </div>
        <span className="text-sm font-medium text-slate-400 group-hover:text-neon-purple">
          {currentSharesCount}
        </span>
      </button>

      <LoginModal
        isOpen={isLoginModalOpen}
        setOpen={setLoginModalOpen}
        handleGoogleLogin={handleGoogleLogin}
        handleGithubLogin={handleGithubLogin}
      />
    </div>
  );
};

export { BlogPostActions };
