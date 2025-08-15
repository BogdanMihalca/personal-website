"use client";

import { sharePostToSocialMedia } from "@/lib/db-actions/social-sharing";
import { Share } from "lucide-react";
import { useState } from "react";
import { CyberpunkButton } from "./cyber-button";

interface AdminPostActionsProps {
  postId: number;
  title: string;
  slug: string;
  imageUrl?: string;
  tags?: string[];
}

export function AdminPostActions({
  postId,
  title,
  slug,
  imageUrl,
  tags,
}: AdminPostActionsProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShareToSocialMedia = async () => {
    setIsSharing(true);
    try {
      const postUrl = `${window.location.origin}/blog/${slug}`;
      await sharePostToSocialMedia({
        postId,
        title,
        url: postUrl,
        imageUrl,
        tags,
      });
    } catch (error) {
      console.error("Error sharing post to social media:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <CyberpunkButton
        variant="secondary"
        size="sm"
        icon={<Share className="h-4 w-4" />}
        onClick={handleShareToSocialMedia}
        loading={isSharing}
      >
        SHARE_TO_SOCIAL
      </CyberpunkButton>
    </div>
  );
}
