import { motion } from "framer-motion";
import { Cpu, Camera, Globe, Video, PlaneTakeoff } from "lucide-react";

const CyberTerminal = () => {
  return (
    <div className="bg-black backdrop-blur-md p-4 border border-fuchsia-500/50 rounded-md my-6 relative overflow-hidden shadow-lg font-mono">
      <motion.div
        className="absolute left-0 w-full h-1 bg-cyan-500/30"
        animate={{ top: [0, "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <div className="flex items-center justify-between mb-3 border-b border-fuchsia-800/30 pb-2">
        <div className="flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-fuchsia-500" />
          <span className="text-fuchsia-500   text-sm">
            x:/system/core/interface.exe
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-lime-500"></div>
          <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
          <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
        </div>
      </div>

      <p className="  text-gray-300 pl-4 border-l border-cyan-500/50 text-sm leading-relaxed">
        <span className="text-cyan-400">CORE&gt;</span> PRIMARY SYSTEMS ONLINE
        <br />
        <span className="text-fuchsia-500">SKILL&gt;</span> SPECIALIZED IN{" "}
        <span className="text-lime-400">REALITY DISTORTION</span> AND{" "}
        <span className="text-lime-400">QUANTUM INTERFACES</span>
        <br />
        <span className="text-yellow-400">ALERT&gt;</span> DISRUPTING DIGITAL
        BOUNDARIES SINCE 2018
        <br />
        <span className="text-cyan-400">STATUS&gt;</span>{" "}
        <span className="animate-pulse text-lime-500">
          READY FOR NEW CHALLENGES
        </span>
        <br />
        <span className="text-cyan-400">ABOUT&gt;</span> SOFTWARE ENGINEER WITH
        PASSION FOR AI, TRAVEL, AND PHOTOGRAPHY
        <br />
        <span className="text-fuchsia-500">HOBBIES&gt;</span>{" "}
        <span className="flex items-center">
          <Camera className="h-4 w-4 mr-1 text-fuchsia-500" /> PHOTOGRAPHY
        </span>
        <span className="flex items-center">
          <Globe className="h-4 w-4 mr-1 text-fuchsia-500" /> TRAVEL
        </span>
        <span className="flex items-center">
          <Video className="h-4 w-4 mr-1 text-fuchsia-500" /> VIDEOGRAPHY
        </span>
        <span className="flex items-center">
          <PlaneTakeoff className="h-4 w-4 mr-1 text-fuchsia-500" /> DRONES
        </span>
        <br />
        <span className="text-cyan-400">LOVE&gt;</span> EVERYTHING ABOUT TECH
      </p>
    </div>
  );
};

export { CyberTerminal };
