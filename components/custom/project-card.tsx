"use client";
import { CyberBadge } from "@/components/custom/cyber-badge";
import { CyberpunkButton } from "@/components/custom/cyber-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { HologramContainer } from "./hologram-container";
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

const ProjectCard = ({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const handleCloseImageViewer = useCallback(() => {
    setImageViewerOpen(false);
  }, []);

  const handleOpenImageViewer = useCallback(() => {
    setImageViewerOpen(true);
  }, []);

  const handleSelectProject = useCallback(() => {
    onSelect(project);
  }, [onSelect, project]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full h-full"
      whileHover={{ scale: 1.02 }}
    >
      <HologramContainer
        variant={project.featured ? "glitch" : "neon"}
        intensity="medium"
        className="h-full overflow-hidden"
      >
        <Card className="relative bg-black/80 border-0 h-full flex flex-col overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
            <motion.div
              className="absolute inset-0 cursor-pointer"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.8 }}
              onClick={handleOpenImageViewer}
            >
              <Image
                src={project.previewImage}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <div className="bg-black/60 text-cyan-400 px-3 py-1 rounded-sm text-xs border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  View Image
                </div>
              </div>
            </motion.div>

            {project.featured && (
              <motion.div
                className="absolute top-3 right-3 z-20"
                initial={{ rotate: 0 }}
                whileHover={{
                  rotate: 5,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                <motion.div
                  className="relative px-3 py-0.5 overflow-hidden rounded-sm"
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ boxShadow: "0 0 15px rgba(176, 38, 255, 0.5)" }}
                >
                  <div className="relative z-10 text-xs font-medium tracking-wide text-white">
                    <motion.span
                      animate={{
                        color: ["rgb(6, 182, 212)"],
                        textShadow: [
                          "0 0 5px rgba(255,255,255,0.5)",
                          "0 0 12px rgba(236,72,153,0.8)",
                          "0 0 15px rgba(6,182,212,0.9)",
                          "0 0 12px rgba(236,72,153,0.8)",
                          "0 0 5px rgba(255,255,255,0.5)",
                        ],
                      }}
                    >
                      FEATURED
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          <CardHeader className="p-4 pb-2 relative z-10">
            <motion.div
              initial={{ opacity: 0.9 }}
              whileHover={{
                opacity: 1,
                textShadow: "0 0 12px rgba(6,182,212,0.8)",
              }}
            >
              <CardTitle className="text-lg bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent font-medium">
                {project.title}
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="p-4 pt-0 pb-2 flex-grow relative z-10">
            <p className="text-sm text-gray-300 line-clamp-4">
              {project.description}
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-2 flex justify-between items-center relative z-10">
            <div className="flex flex-wrap gap-1">
              {project.techStack.slice(0, 3).map((tech, index) => {
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
                  <motion.div
                    key={tech.name}
                    initial={{ y: 0 }}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CyberBadge
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      variant={variants[tech.color] as any}
                      delay={index}
                      className="text-[8px] py-0 px-1.5"
                    >
                      {tech.name}
                    </CyberBadge>
                  </motion.div>
                );
              })}

              {project.techStack.length > 3 && (
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <CyberBadge
                    variant="holo"
                    delay={3}
                    className="text-[8px] py-0 px-1.5"
                  >
                    +{project.techStack.length - 3}
                  </CyberBadge>
                </motion.div>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CyberpunkButton
                size="sm"
                variant="secondary"
                onClick={handleSelectProject}
                className="shadow-[0_0_10px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(192,38,211,0.6)] transition-shadow duration-300"
              >
                VIEW
              </CyberpunkButton>
            </motion.div>
          </CardFooter>
        </Card>
      </HologramContainer>

      <ImageViewer
        isOpen={imageViewerOpen}
        onClose={handleCloseImageViewer}
        imageSrc={project.previewImage}
        altText={project.title}
      />
    </motion.div>
  );
};

export { ProjectCard };
