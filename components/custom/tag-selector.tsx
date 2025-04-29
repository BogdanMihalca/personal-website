import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllTags } from "@/lib/db-actions/tag-actions";
import { MultiSelect } from "./multiselect";
import { Tag } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black/50 border border-neon-purple/30 rounded-sm p-4 min-h-[100px]"
    >
      <div className="flex flex-wrap gap-2">
        <MultiSelect
          options={tags.map((tag) => ({
            value: `${tag.id}`,
            label: tag.name,
            icon: Tag,
          }))}
          selectedValues={selectedTags}
          onChange={onChange}
          placeholder="Select tags..."
          variant="cyberpurple"
          className="w-full"
          animation={0.5}
          maxCount={5}
          classNames={{
            input:
              "bg-black/70 border border-neon-purple/30 rounded-sm p-2 hover:border-neon-purple/50",
            dropdown: "bg-black/90 border border-neon-purple/30 rounded-sm",
            option: "p-2 hover:bg-neon-purple/10 cursor-pointer",
          }}
        />
      </div>

      {tags.length === 0 && (
        <p className="text-neon-purple/50 text-sm">No tags available</p>
      )}
    </motion.div>
  );
}
