"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";
import { CyberpunkButton } from "./cyber-button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlitchText } from "./glitch-text";

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

// Sample projects data
const projects: Project[] = [
  {
    id: "fake-news-detector",
    title: "RO AI fake news detector",
    description: `A Next.js platform that detects fake news in Romanian using browser-side AI inference with transformers.js and ONNX. Supports text and URL analysis, with research findings available.`,
    fullDescription: `This platform is a sophisticated Next.js-based tool designed to combat misinformation in Romanian-language content. Using transformers.js, it performs browser-side AI inference, allowing users to detect fake news from both raw text and URLs without relying on external servers.
To ensure accuracy, I trained multiple AI models on a dataset enhanced through web scraping from Veridica, comparing their performance to select the best one. The final model was converted to ONNX, enabling efficient execution directly in the browser. Users can explore the research findings, including insights into model performance and dataset improvements, directly on the website.`,
    techStack: [
      { name: "Next.js", color: "red" },
      { name: "React", color: "cyan" },
      { name: "Transformers.js", color: "fuchsia" },
      { name: "ONNX", color: "blue" },
      { name: "Python", color: "purple" },
      { name: "PyTorch", color: "red" },
    ],
    previewImage: "/projects/ai-fake-preview.png",
    images: [
      "/projects/ai-fake1.png",
      "/projects/ai-fake2.png",
      "/projects/ai-fake3.png",
      "/projects/ai-fake4.png",
      "/projects/ai-fake5.png",
    ],
    url: "https://ai-fake-news-ro.vercel.app",
    githubUrl: "https://github.com/BogdanMihalca/AI_fake-news-ro",
    featured: false,
  },
  {
    id: "medi-connect",
    title: "MediConnect - Health Data",
    description: `MediConnect streamlines medical referrals with AI-driven diagnosis, BERT-based symptom analysis, and a pro dashboard. Built during a hackathon`,
    fullDescription: `MediConnect is an AI-driven healthcare platform designed to transform the medical referral process. Using a locally trained BERT model optimized with ONNX, it performs client-side symptom analysis while also integrating OpenAI for comparative results. Patients can interactively input symptoms via a guided journey or free text, receive detailed PDF reports, and visualize confidence scores with interactive charts.

For healthcare providers, the platform includes a professional dashboard, appointment management, and patient data organization tools. The system ensures modern authentication with NextAuth, secure session management, and a scalable Neon Edge database while maintaining HIPAA compliance.

🚀 Key Features:
✔ AI-powered symptom analysis (ONNX + OpenAI)
✔ Client-side ML inference for fast results
✔ Professional dashboard for healthcare providers
✔ Google-integrated condition search
✔ Secure authentication & HIPAA compliance`,
    techStack: [
      { name: "Next.js", color: "fuchsia" },
      { name: "TypeScript", color: "blue" },
      { name: "TailwindCSS", color: "cyan" },
      { name: "Framer Motion", color: "green" },
      { name: "Recharts", color: "purple" },
      { name: "OpenAI", color: "red" },
      { name: "Prisma", color: "amber" },
      { name: "Transformers.js", color: "rose" },
    ],
    previewImage: "/projects/medi-preview.png",
    images: [
      "/projects/medi-1.png",
      "/projects/medi-2.png",
      "/projects/medi-3.png",
      "/projects/medi-4.png",
      "/projects/medi-5.png",
    ],
    url: "https://my-med-ai.vercel.app",
    githubUrl: "https://github.com/BogdanMihalca/my-med-ai",
    featured: false,
  },
];

const ProjectSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);

  const displayedProjects = projects.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section
      className="relative py-20 bg-space-black/50 overflow-hidden"
      id="projects"
    >
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute h-px w-full top-1/3 bg-linear-to-r from-transparent via-fuchsia-600 to-transparent animate-pulse" />
        <div
          className="absolute h-px w-full top-2/3 bg-linear-to-r from-transparent via-cyan-500 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-px h-full left-1/3 bg-linear-to-b from-transparent via-lime-500 to-transparent animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute w-px h-full right-1/3 bg-linear-to-b from-transparent via-fuchsia-500 to-transparent animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="mb-12 relative text-center">
          <div className="inline-block relative p-6 mx-auto">
            <GlitchText
              text="Projects"
              variant="neon"
              intensity="high"
              className="text-xl md:text-2xl font-cyber"
            />
            <div className="absolute -inset-2 bg-neon-cyan/15 blur-xl rounded-lg -z-10"></div>
          </div>

          <p className="my-4 md:my-8 text-gray-300 max-w-2xl mx-auto  text-sm">
            Browse through some of my recent work - a collection of projects
            ranging from data visualizations to interactive applications. Each
            one represents different challenges I&apos;ve built and technologies
            I&apos;ve explored. Feel free to click on any project that catches
            your interest to see more details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-4">
            <CyberpunkButton
              onClick={prevPage}
              disabled={currentPage === 0}
              variant={currentPage === 0 ? "secondary" : "primary"}
              size="sm"
              icon={<ChevronLeft size={16} />}
            >
              PREV
            </CyberpunkButton>

            <div className="text-center">
              <span className="text-xs text-cyan-400 font-mono tracking-wider bg-black/50 px-3 py-1 rounded-sm border border-cyan-500/30">
                PAGE {currentPage + 1} / {totalPages}
              </span>
            </div>

            <CyberpunkButton
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              variant={currentPage === totalPages - 1 ? "secondary" : "primary"}
              size="sm"
              icon={<ChevronRight size={16} className="ml-1 order-2" />}
            >
              NEXT
            </CyberpunkButton>
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export { ProjectSection };
