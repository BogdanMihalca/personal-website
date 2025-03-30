import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useCallback } from "react";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  altText: string;
}

export const ImageViewer = ({
  isOpen,
  onClose,
  imageSrc,
  altText,
}: ImageViewerProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border border-cyan-500/30 overflow-hidden min-h-[70vh] min-w-[70vw]"
        title="Image Viewer"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full min-h-[50vh] flex items-center justify-center"
            >
              <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
                <Image
                  src={imageSrc}
                  alt={altText}
                  width={1200}
                  height={800}
                  className="object-contain object-center "
                  priority
                />
              </div>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full 
                           bg-black/50 hover:bg-black/70 transition-colors z-50
                           border border-cyan-500/30 hover:border-cyan-400/50
                           shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
