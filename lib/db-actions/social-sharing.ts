"use client";

import { toast } from "sonner";

interface SharePostData {
  postId: number;
  title: string;
  content?: string;
  url: string;
  imageUrl?: string;
  tags?: string[];
}

export async function sharePostToSocialMedia(postData: SharePostData) {
  try {
    const response = await fetch("/api/automation/share-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content || "",
        url: postData.url,
        imageUrl: postData.imageUrl,
        tags: postData.tags,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to share post");
    }

    toast.success("Post shared to social media successfully!");
    return result;
  } catch (error) {
    console.error("Error sharing post to social media:", error);
    toast.error("Failed to share post to social media");
    throw error;
  }
}
