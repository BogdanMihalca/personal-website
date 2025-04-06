"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Camera,
  Code,
  Download,
  Joystick,
  PlaneTakeoff,
  Rocket,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CyberBadge } from "./cyber-badge";
import { DecoDivider } from "./deco-divider";
import { GlitchText } from "./glitch-text";
import { HologramContainer } from "./hologram-container";
import { CyberpunkButton } from "./cyber-button";

const {
  copy,
  hobbies,
  workHistory,
  personalDescription,
  education,
  techStack,
} = {
  copy: "Full-time Software Engineer | Part-time Traveler",
  hobbies: [
    { name: "Traveling", icon: <PlaneTakeoff className="h-4 w-4" /> },
    { name: "Photography", icon: <Camera className="h-4 w-4" /> },
    { name: "Drones", icon: <Joystick className="h-4 w-4" /> },
    { name: "Tech", icon: <Code className="h-4 w-4" /> },
    { name: "Space Exploration", icon: <Rocket className="h-4 w-4" /> },
  ],
  workHistory: [
    {
      company: "Lateral Group",
      role: "Software Engineer",
      duration: "Jul 2021 - Present",
      description: `I have worked on diverse and impactful projects, including a waste management SaaS, where I upgraded the mapping system to Mapbox GL, integrated advanced geo-drawing tools, and built an interactive route navigation system with React. I also developed a scientific collaboration platform using React, GatsbyJS, and GraphQL to create a headless CMS that enhances global research efforts. Additionally, I contributed to a leave management system, building a scalable backend with NestJS and crafting an intuitive UI with React and GraphQL. Furthermore, I worked for a major UK loans company, maintaining and improving a microfrontend architecture, adding new features, and optimizing performance for a seamless user experience.`,
      tags: [
        "React",
        "Redux",
        "Node.js",
        "GraphQL",
        "Mapbox GL",
        "GatsbyJS",
        "SCSS",
        "Styled Components",
      ],
    },

    {
      company: "Lateral Group",
      role: "React Developer intern",
      duration: "Apr 2021 - Jun 2021",
      description: `Completed React with Hooks and Redux courses, enhancing proficiency in React development.
-Successfully developed various web applications under mentor guidance, culminating in the creation of a sophisticated social platform utilizing MongoDB as the backend database.`,
      tags: [
        "React",
        "JavaScript",
        "Redux",
        "HTML",
        "CSS",
        "Responsive Design",
      ],
    },
    {
      company: "Logiscool România",
      role: "Trainer",
      duration: "Mar 2020 - Jun 2021 ",
      description: `Led interactive classes focused on developing logical and critical thinking skills among children through project-based learning on a Scratch-based platform.
m. For high school teenagers, conducted engaging sessions on JavaScript, employing interactive methods to create games and other engaging projects.`,
      tags: [
        "Scratch",
        "JavaScript",
        "HTML",
        "CSS",
        "Project-based Teaching",
        "Gamification",
        "Interactive Teaching",
      ],
    },
  ],
  techStack: [
    { name: "React", level: 9, category: "Frontend" },
    { name: "TypeScript", level: 8, category: "Language" },
    { name: "Node.js", level: 7, category: "Backend" },
    { name: "Next.js", level: 8, category: "Framework" },
    { name: "TailwindCSS", level: 9, category: "CSS" },
    { name: "GraphQL", level: 7, category: "API" },
    { name: "GatsbyJS", level: 7, category: "Framework" },
    { name: "Go", level: 1, category: "Backend" },
  ],
  education: [
    {
      institution: "University of Oradea",
      degree:
        "Master's degree, Computer/Information Technology Administration and Management",
      year: "2024",
    },
    {
      institution: "University of Oradea",
      degree: "Bachelor degree, Computer Science",
      year: "2022",
    },
  ],
  personalDescription: `
  Passionate about technology and its potential to transform lives. I thrive on challenges and am always eager to learn and grow. My interests span from software development to photography, travel, and space exploration. I believe in the power of collaboration and enjoy working with diverse teams to create innovative solutions. My goal is to leverage my skills and experiences to make a positive impact in the tech industry while continuously expanding my horizons.",
    `,
};

const AboutSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const contentInView = useInView(contentRef, { once: false, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [20, -20] : [80, -80]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.95, 1, 1, 0.95]
  );
  // Removing the rotation transform

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative bg-space-black/50  pb-8 overflow-hidden`}
    >
      <DecoDivider className="top-0 left-0 absolute opacity-70" />

      <motion.div
        className="absolute left-1/4 top-1/3 w-64 h-64 rounded-full bg-neon-pink/10 filter blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.18, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/3 w-64 h-64 rounded-full bg-neon-cyan/10 filter blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        style={{ opacity, y: translateY, scale }}
        className="container mx-auto px-4 relative z-10"
        ref={contentRef}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center mb-10"
        >
          <div className="inline-block relative p-6">
            <GlitchText
              color="cyan"
              intensity="high"
              className="text-xl md:text-2xl font-cyber"
            >
              About.ME
            </GlitchText>
            <div className="absolute -inset-2 bg-neon-cyan/15 blur-xl rounded-lg -z-10"></div>
          </div>

          <motion.div
            className="relative my-4 py-4 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="absolute left-0 top-0 w-2/3 h-[1px] bg-gradient-to-r from-neon-pink/70 to-transparent" />
            <div className="absolute right-0 bottom-0 w-2/3 h-[1px] bg-gradient-to-l from-neon-cyan/70 to-transparent" />

            <p className="text-neon-blue text-lg md:text-xl inline-block relative font-cyber tracking-wide leading-relaxed">
              <span className="text-neon-pink opacity-70">&lt;</span>
              <motion.span
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {copy}
              </motion.span>
              <span className="text-neon-pink opacity-70">/&gt;</span>
            </p>
          </motion.div>
        </motion.div>

        <div className="text-center mb-8">
          <CyberpunkButton
            icon={<Download />}
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/resume.pdf"; // Replace with your CV URL
              link.download = "resume.pdf"; // Replace with the desired file name
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download CV
          </CyberpunkButton>
        </div>

        <div className="relative z-10 mb-16 max-w-4xl mx-auto">
          <HologramContainer
            variant="holo"
            className="p-6 relative overflow-hidden"
          >
            <div className="relative">
              <h2 className="text-neon-cyan font-bold text-xl mb-4 flex items-center">
                <span className="text-neon-pink mr-2">[</span>
                <GlitchText color="cyan" intensity="medium">
                  PERSONAL_MATRIC
                </GlitchText>
                <span className="text-neon-pink ml-2">]</span>
              </h2>

              <div className="relative pl-4 border-l-2 border-neon-cyan">
                <motion.p
                  className="text-neon-blue/90 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <span className={`text-neon-cyan `}>&gt;</span>{" "}
                  <span className={`font-mono`}>
                    {personalDescription
                      ? personalDescription
                      : "No data available."}
                  </span>
                </motion.p>

                <motion.div
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-neon-cyan via-neon-pink to-transparent"
                  animate={{
                    scaleX: [0, 1, 1, 0],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.4, 0.6, 1],
                  }}
                />
              </div>
            </div>
          </HologramContainer>
        </div>

        <div className="relative z-10 mt-16 grid gap-12 md:grid-cols-2">
          <div className="space-y-10">
            <HologramContainer
              variant="neon"
              className="p-6 rounded-sm relative overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={
                  contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                }
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <GlitchText
                  color="cyan"
                  intensity="medium"
                  className="text-neon-cyan font-bold text-md mb-4"
                >
                  WORK_HISTORY
                </GlitchText>

                <div className="relative pl-6 space-y-8 mb-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-4 before:w-[2px] before:bg-neon-blue/30">
                  {workHistory.map((job, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        contentInView
                          ? {
                              opacity: 1,
                              x: 0,
                            }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{
                        duration: 0.7,
                        delay: 0.6 + index * 0.2,
                      }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      className={`relative pl-6 transition-all duration-300 group pb-2`}
                    >
                      <div
                        className={`absolute -left-[22px] top-[0.4rem] w-5 h-5 rounded-full 
                                    bg-neon-cyan/20 border-2 
                                     border-neon-blue/50
                                    `}
                      />

                      <motion.div
                        className="absolute -left-3 top-0 h-full w-[2px] bg-neon-cyan/0 group-hover:bg-neon-cyan/50"
                        whileHover={{ scaleY: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />

                      <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-neon-blue font-bold text-lg group-hover:text-neon-cyan transition-colors duration-300">
                            {job.role}
                          </h3>
                          <span className="text-neon-pink px-3 py-1 text-sm border border-neon-pink/30 rounded-sm">
                            {job.duration}
                          </span>
                        </div>
                        <p className="text-neon-cyan/70 group-hover:text-neon-cyan/90 transition-colors duration-300 mb-2">
                          {job.company}
                        </p>
                        {job.description && (
                          <p className="text-neon-blue/60 text-xs font-mono mt-1 group-hover:text-neon-blue/80 transition-colors duration-300">
                            {job.description}
                          </p>
                        )}

                        <motion.div
                          className="mt-2 flex gap-1.5 flex-wrap"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {job.tags.map((tag, index) => (
                            <CyberBadge
                              key={index}
                              className="text-neon-blue text-xs font-mono"
                              delay={index}
                            >
                              {tag}
                            </CyberBadge>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </HologramContainer>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={
              contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-10"
          >
            <HologramContainer
              variant="neon"
              className="p-6 rounded-sm relative overflow-hidden group"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={
                  contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                }
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <GlitchText
                  color="fuchsia"
                  intensity="medium"
                  className="text-neon-cyan font-bold text-md mb-4"
                >
                  EDUCATION
                </GlitchText>

                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      animate={
                        contentInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: 30 }
                      }
                      transition={{
                        duration: 0.7,
                        delay: 0.5 + index * 0.15,
                      }}
                      whileHover={{ x: -5, transition: { duration: 0.2 } }}
                      className="border-l-2 border-neon-pink pl-4 relative hover:bg-gradient-to-r hover:from-neon-pink/10 hover:to-transparent transition-all duration-300 group"
                    >
                      <motion.div
                        className="absolute -left-1.5 top-0 w-3 h-3 bg-neon-pink rounded-full"
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(255, 0, 255, 0.5)",
                            "0 0 10px rgba(255, 0, 255, 0.8)",
                            "0 0 0px rgba(255, 0, 255, 0.5)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      />

                      <motion.p
                        className="text-neon-blue font-semibold text-lg group-hover:text-neon-pink transition-colors duration-300"
                        transition={{ duration: 0.2 }}
                      >
                        {edu.degree}
                      </motion.p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-neon-cyan group-hover:text-opacity-100 text-opacity-80 transition-all duration-300">
                          {edu.institution}
                        </span>
                        <span className="text-neon-pink bg-neon-pink/10 px-3 py-1 rounded group-hover:bg-neon-pink/20 transition-all duration-300 border-b border-neon-pink/30">
                          {edu.year}
                        </span>
                      </div>
                      <motion.div className="absolute bottom-0 right-0 h-[1px] bg-neon-pink/70 w-0 group-hover:w-full transition-all duration-700" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </HologramContainer>

            <HologramContainer
              variant="holo"
              className="p-6 rounded-sm relative overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={
                  contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                }
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <GlitchText
                  color="fuchsia"
                  intensity="medium"
                  className="text-neon-purple font-bold text-md mb-6 tracking-wider flex items-center"
                >
                  TECH_STACK
                </GlitchText>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {techStack?.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        contentInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + index * 0.05,
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(57, 255, 20, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                      className="relative group border border-neon-green/20 rounded-sm px-2 py-1.5"
                    >
                      <div
                        className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            tech.level >= 8
                              ? "var(--color-neon-green)"
                              : tech.level >= 5
                              ? "var(--color-neon-cyan)"
                              : "var(--color-neon-purple)",
                        }}
                      />

                      <div className="flex justify-between items-center">
                        <span className="text-neon-blue text-sm font-medium group-hover:text-neon-green transition-colors duration-300">
                          {tech.name}
                        </span>

                        <div className="flex space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 w-1 rounded-full ${
                                i < Math.ceil(tech.level / 2)
                                  ? tech.level >= 8
                                    ? "bg-neon-green"
                                    : tech.level >= 5
                                    ? "bg-neon-cyan"
                                    : "bg-neon-purple"
                                  : "bg-neon-green/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {tech.category && (
                        <motion.div
                          initial={{ opacity: 0.5, height: 10 }}
                          whileHover={{ opacity: 1, height: "auto" }}
                          className="text-[10px] text-neon-cyan/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          {tech.category}
                        </motion.div>
                      )}

                      <motion.div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-neon-green to-transparent w-0 group-hover:w-full transition-all duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </HologramContainer>
            <HologramContainer
              variant="glitch"
              className="p-6 rounded-sm relative overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={
                  contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                }
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <GlitchText
                  color="green"
                  intensity="high"
                  className="text-neon-pink font-bold text-md mb-4"
                >
                  HOBBIES
                </GlitchText>

                <div className="flex flex-wrap gap-4">
                  {hobbies.map((hobby, index) => (
                    <CyberBadge
                      key={index}
                      className="text-md"
                      delay={index}
                      variant="circuit"
                    >
                      <div className="flex items-center space-x-2">
                        {hobby.icon && <span>{hobby.icon}</span>}
                        <span className="text-neon-blue">{hobby.name}</span>
                      </div>
                    </CyberBadge>
                  ))}
                </div>
              </motion.div>
            </HologramContainer>
          </motion.div>
        </div>
      </motion.div>

      <DecoDivider className="bottom-0 left-0 absolute" variant="holo" />
    </section>
  );
};

export { AboutSection };
