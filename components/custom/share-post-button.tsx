"use client";

import { Share, Loader2 } from "lucide-react";
import { useState } from "react";
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
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
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
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <CyberpunkButton
      icon={
        isSharing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share className="h-4 w-4" />
        )
      }
      variant="secondary"
      size="sm"
      onClick={handleShare}
      disabled={isSharing}
    >
      {isSharing ? "Sharing..." : "Share"}
    </CyberpunkButton>
  );
}
