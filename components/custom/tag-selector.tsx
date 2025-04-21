/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { CyberBadge } from "./cyber-badge";
import { motion } from "framer-motion";
import { getAllTags } from "@/lib/db-actions/tag-actions";

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  selectedTags: number[];
  onChange: (tags: number[]) => void;
}

export default function TagSelector({
  selectedTags,
  onChange,
}: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { tags } = await getAllTags({ returnAll: true });
        setTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleToggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black/50 border border-neon-purple/30 rounded-sm p-4 min-h-[100px] flex flex-wrap gap-2">
        <div className="w-16 h-6 bg-neon-purple/20 rounded-sm animate-pulse"></div>
        <div className="w-24 h-6 bg-neon-purple/20 rounded-sm animate-pulse"></div>
        <div className="w-20 h-6 bg-neon-purple/20 rounded-sm animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-black/50 border border-neon-purple/30 rounded-sm p-4 min-h-[100px]">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => {
          const isSelected = selectedTags.includes(tag.id);

          const getVariant = () => {
            if (isSelected) return "neon";
            if (index % 3 === 0) return "holo";
            if (index % 3 === 1) return "glitch";
            return "circuit";
          };

          return (
            <motion.div
              key={tag.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToggleTag(tag.id)}
            >
              <CyberBadge
                variant={getVariant() as any}
                delay={index * 0.1}
                className="cursor-pointer select-none"
              >
                {tag.name}
              </CyberBadge>
            </motion.div>
          );
        })}
      </div>

      {tags.length === 0 && (
        <p className="text-neon-purple/50 text-sm">No tags available</p>
      )}

      {selectedTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neon-purple/20">
          <p className="text-xs text-neon-purple mb-2">Selected Tags:</p>
          <div className="flex flex-wrap gap-2">
            {tags
              .filter((tag) => selectedTags.includes(tag.id))
              .map((tag, index) => (
                <CyberBadge
                  key={`selected-${tag.id}`}
                  variant="neon"
                  delay={index * 0.1}
                  className="text-xs"
                >
                  {tag.name}
                </CyberBadge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
