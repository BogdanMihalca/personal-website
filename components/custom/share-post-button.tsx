"use client";

import { Share } from "lucide-react";
import { CyberpunkButton } from "./cyber-button";
import { toast } from "sonner";

interface SharePostButtonProps {
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  tags: string[];
}

export function SharePostButton({
  title,
  content,
  url,
  imageUrl,
  tags,
}: SharePostButtonProps) {
  const handleShare = async () => {
    try {
      const response = await fetch("/api/automation/share-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          url,
          imageUrl: imageUrl || "",
          tags,
        }),
      });

      if (response.ok) {
        toast.success("Post shared to social media!");
      } else {
        toast.error("Failed to share post");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share post");
    }
  };

  return (
    <CyberpunkButton
      icon={<Share className="h-4 w-4" />}
      variant="secondary"
      size="sm"
      onClick={handleShare}
    >
      Share
    </CyberpunkButton>
  );
}
