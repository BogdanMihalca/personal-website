import { useEffect, useMemo, useState } from "react";
import "./cyber-logo.scss";
import Link from "next/link";

interface CyberpunkLogoProps {
  name: string;
  className?: string;
}

export const CyberpunkLogo: React.FC<CyberpunkLogoProps> = ({
  name,
  className,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nameToRender = useMemo(() => {
    if (isMobile) {
      return name;
    } else {
      // return first letter of each word
      return name
        .split(" ")
        .map((word) => word[0])
        .join("");
    }
  }, [isMobile, name]);

  return (
    <Link href="/">
      <div className={`logo-glitch relative ${className}`}>
        <span className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
          {nameToRender}
        </span>
        <span className="absolute top-0 left-0 w-full h-full text-2xl font-bold tracking-wider text-cyan-400 logo-glitch-1">
          {nameToRender}
        </span>
        <span className="absolute top-0 left-0 w-full h-full text-2xl font-bold tracking-wider text-pink-400 logo-glitch-2">
          {nameToRender}
        </span>
      </div>
    </Link>
  );
};
