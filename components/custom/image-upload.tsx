import { useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Upload } from "lucide-react";
import { CyberpunkButton } from "./cyber-button";

interface ImageUploadProps {
  onChange: (imageUrl: string) => void;
}

export default function ImageUpload({ onChange }: ImageUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const mockUploadImage = () => {
    setIsUploading(true);

    setTimeout(() => {
      const mockImageUrl = `/blog-images/post-${Date.now()}.jpg`;
      onChange(mockImageUrl);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isHovering ? 1.05 : 1 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="mb-4"
      >
        <div className="relative w-24 h-24 border-2 border-dashed border-neon-cyan/50 rounded-full flex items-center justify-center bg-black/30 overflow-hidden group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-pink/10 to-neon-cyan/10"
            animate={{
              opacity: isHovering ? 0.5 : 0.2,
            }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="relative z-10"
            animate={{
              scale: isHovering ? 1.1 : 1,
              rotate: isUploading ? 360 : 0,
            }}
            transition={{
              scale: { duration: 0.2 },
              rotate: {
                duration: 2,
                repeat: isUploading ? Infinity : 0,
                ease: "linear",
              },
            }}
          >
            <ImagePlus
              size={40}
              className={`text-neon-cyan transition-colors ${
                isHovering ? "text-neon-pink" : ""
              }`}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CyberpunkButton
          variant="primary"
          size="sm"
          icon={<Upload className="h-4 w-4" />}
          loading={isUploading}
          onClick={mockUploadImage}
        >
          SELECT IMAGE
        </CyberpunkButton>
      </motion.div>

      <p className="text-xs text-zinc-500 mt-4 text-center max-w-xs">
        Upload your featured image for the blog post.
        <span className="block mt-1 text-neon-cyan/50">
          Recommended size: 1200×630px
        </span>
      </p>
    </div>
  );
}
