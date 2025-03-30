"use client";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { CyberpunkButton } from "@/components/custom/cyber-button";
import { CyberpunkDisplay } from "@/components/custom/cyber-diplay";
import { CyberBadge } from "@/components/custom/cyber-badge";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ImageViewer } from "./image-viewer";

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  techStack: {
    name: string;
    color:
      | "cyan"
      | "fuchsia"
      | "blue"
      | "purple"
      | "amber"
      | "rose"
      | "red"
      | "green";
  }[];
  previewImage: string;
  images: string[];
  url?: string;
  githubUrl?: string;
  featured?: boolean;
}

const ProjectModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  if (!project) return null;

  const nextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex + 1 >= project.images.length ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex - 1 < 0 ? project.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-4xl xl:max-w-5xl w-full max-h-[90vh] border-none bg-transparent p-0 overflow-hidden ">
        <CyberpunkDisplay
          title={project.title}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="text-cyan-100 overflow-y-auto max-h-[calc(80vh-100px)] w-full">
            <div className="relative h-64 lg:h-80 mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 z-0" />
              <div className="relative h-full overflow-hidden">
                <div
                  className="relative h-full cursor-pointer"
                  onClick={() => setImageViewerOpen(true)}
                >
                  <Image
                    src={project.images[activeImageIndex]}
                    alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="bg-black/60 text-cyan-400 px-3 py-1 rounded-sm text-xs border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      View Full Size
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-cyan-400 p-2 rounded-full opacity-70 hover:opacity-100 transition-all z-20 cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-cyan-400 p-2 rounded-full opacity-70 hover:opacity-100 transition-all z-20 cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-2 right-2 bg-black/70 text-cyan-400 px-2 py-1 text-xs rounded-sm">
                  {activeImageIndex + 1} / {project.images.length}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech, index) => {
                  const variants = {
                    cyan: "default",
                    fuchsia: "neon",
                    blue: "holo",
                    purple: "glitch",
                    amber: "circuit",
                    rose: "neon",
                    red: "neon",
                    green: "circuit",
                  };

                  return (
                    <CyberBadge
                      key={tech.name}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      variant={variants[tech.color] as any}
                      delay={index * 0.2}
                    >
                      {tech.name}
                    </CyberBadge>
                  );
                })}
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {project.fullDescription}
              </p>

              <div className="pt-4 flex gap-4">
                {project.url && (
                  <CyberpunkButton
                    size="md"
                    variant="primary"
                    icon={<ExternalLink size={16} className="mr-2" />}
                    onClick={() => window.open(project.url, "_blank")}
                  >
                    VISIT PROJECT
                  </CyberpunkButton>
                )}

                {project.githubUrl && (
                  <CyberpunkButton
                    size="md"
                    variant="secondary"
                    icon={<ArrowRight size={16} className="mr-2" />}
                    onClick={() => window.open(project.githubUrl, "_blank")}
                  >
                    VIEW CODE
                  </CyberpunkButton>
                )}
              </div>
            </div>
          </div>
        </CyberpunkDisplay>
      </DialogContent>

      <ImageViewer
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        imageSrc={project.images[activeImageIndex]}
        altText={`${project.title} screenshot ${activeImageIndex + 1}`}
      />
    </Dialog>
  );
};

export { ProjectModal };
