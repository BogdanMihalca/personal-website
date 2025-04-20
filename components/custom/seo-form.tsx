"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSEODataByPostId } from "@/lib/db-actions/seo-actions";

export interface SEOData {
  metaTitle?: string;
  metaDesc?: string;
  ogTitle?: string;
  ogDesc?: string;
  ogImage?: string;
  keywords?: string;
  canonicalUrl?: string;
}

interface SEOFormProps {
  postId?: number;
  initialData?: SEOData;
  onChange?: (data: SEOData) => void;
}

export default function SEOForm({
  postId,
  initialData,
  onChange,
}: SEOFormProps) {
  const [seoData, setSeoData] = useState<SEOData>(
    initialData || {
      metaTitle: "",
      metaDesc: "",
      ogTitle: "",
      ogDesc: "",
      ogImage: "",
      keywords: "",
      canonicalUrl: "",
    }
  );

  useEffect(() => {
    if (postId && !initialData) {
      const loadSEOData = async () => {
        try {
          const data = await getSEODataByPostId(postId);
          if (data) {
            setSeoData(data);
            if (onChange) onChange(data);
          }
        } catch (error) {
          console.error("Failed to load SEO data", error);
        }
      };

      loadSEOData();
    }
  }, [postId, initialData, onChange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedData = { ...seoData, [name]: value };
    setSeoData(updatedData);

    if (onChange) {
      onChange(updatedData);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-neon-pink text-sm mb-1">Meta Title</label>
        <Input
          name="metaTitle"
          value={seoData.metaTitle}
          onChange={handleChange}
          placeholder="Meta title for search engines"
          className="bg-black/50 border-neon-pink/30 text-zinc-200"
        />
      </div>

      <div>
        <label className="block text-neon-pink text-sm mb-1">
          Meta Description
        </label>
        <Textarea
          name="metaDesc"
          value={seoData.metaDesc}
          onChange={handleChange}
          placeholder="Meta description for search engines"
          className="bg-black/50 border-neon-pink/30 text-zinc-200 resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-pink text-sm mb-1">OG Title</label>
          <Input
            name="ogTitle"
            value={seoData.ogTitle}
            onChange={handleChange}
            placeholder="Title for social sharing"
            className="bg-black/50 border-neon-pink/30 text-zinc-200"
          />
        </div>

        <div>
          <label className="block text-neon-pink text-sm mb-1">OG Image</label>
          <Input
            name="ogImage"
            value={seoData.ogImage}
            onChange={handleChange}
            placeholder="Image URL for social sharing"
            className="bg-black/50 border-neon-pink/30 text-zinc-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-pink text-sm mb-1">
          OG Description
        </label>
        <Textarea
          name="ogDesc"
          value={seoData.ogDesc}
          onChange={handleChange}
          placeholder="Description for social sharing"
          className="bg-black/50 border-neon-pink/30 text-zinc-200 resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-neon-pink text-sm mb-1">Keywords</label>
        <Input
          name="keywords"
          value={seoData.keywords}
          onChange={handleChange}
          placeholder="Comma-separated keywords"
          className="bg-black/50 border-neon-pink/30 text-zinc-200"
        />
      </div>

      <div>
        <label className="block text-neon-pink text-sm mb-1">
          Canonical URL
        </label>
        <Input
          name="canonicalUrl"
          value={seoData.canonicalUrl}
          onChange={handleChange}
          placeholder="Canonical URL (optional)"
          className="bg-black/50 border-neon-pink/30 text-zinc-200"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <p className="text-xs text-zinc-500">
          <span className="text-neon-pink">*</span> SEO data will be saved with
          the post
        </p>
      </div>
    </div>
  );
}
