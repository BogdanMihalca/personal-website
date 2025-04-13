"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Key, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { DecoDivider } from "./deco-divider";
import { LoginModal } from "./login-modal";
import { CyberpunkButton } from "./cyber-button";

export function LoginButton() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const handleGithubLogin = async () => {
    await signIn("github");
  };

  const { data: session, status } = useSession();

  console.log("Session data:", session);
  console.log("Session status:", status);

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-900/30 to-purple-900/30 animate-pulse border border-cyan-500/30" />
          <div className="absolute inset-0 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.3)] animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-[80px] bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-sm" />
          <Skeleton className="h-2.5 w-[120px] bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-sm" />
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    if (isMobile) {
      return (
        <div className="border-b border-cyan-500/30 pb-3 mb-3">
          <div className="flex items-center space-x-3 mb-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-2 border-cyan-500 rounded-full p-0.5 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            >
              <Avatar>
                <AvatarImage src={session.user?.image as string} alt="user" />
                <AvatarFallback className="bg-black text-neon-pink font-mono">
                  {session.user?.name
                    ?.split(" ")
                    .map((name: string) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex flex-col">
              <div className="font-mono text-cyan-300 tracking-wider">
                <span className="text-neon-pink mr-1">[</span>
                {session.user?.name || session.user?.email}
                <span className="text-neon-pink ml-1">]</span>
              </div>
              <div className="text-xs text-cyan-400/70 font-mono">
                {session.user?.email}
              </div>
            </div>
          </div>

          <DecoDivider variant="neon" size="sm" className="my-2" />

          <div
            onClick={() => signOut()}
            className="text-red-400 hover:bg-red-500/20 cursor-pointer flex items-center justify-between px-4 py-2 text-sm font-mono mt-2"
          >
            <div className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>LOG_OUT:://</span>
            </div>
            <span className="text-xs text-red-300/70">⇧⌘Q</span>
          </div>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <div className="flex align-middle justify-center">
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="border-2 border-cyan-500 rounded-full p-0.5 shadow-[0_0_10px_rgba(6,182,212,0.5)] cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={session.user?.image as string} alt="user" />
                <AvatarFallback className="bg-black text-neon-pink font-mono">
                  {session.user?.name
                    ?.split(" ")
                    .map((name: string) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </DropdownMenuTrigger>
          <div className="ml-3 mt-2 flex align-middle justify-center font-mono text-cyan-300 tracking-wider">
            <span className="text-neon-pink mr-1">[</span>
            {session.user?.name || session.user?.email}
            <span className="text-neon-pink ml-1">]</span>
          </div>
        </div>
        <DropdownMenuContent className="min-w-40 border-cyan-500/50 bg-black/90 backdrop-blur-sm text-cyan-300 font-mono">
          <DropdownMenuLabel className="border-b border-cyan-500/30">
            {session.user?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-cyan-500/20" />
          <DropdownMenuGroup className="text-red-400 hover:bg-red-500/20 cursor-pointer">
            <div
              onClick={() => signOut()}
              className="text-red-400 hover:bg-red-500/20 cursor-pointer flex items-baseline justify-between px-4 py-2 text-sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>LOG_OUT:://</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <CyberpunkButton
        onClick={() => setOpen(true)}
        variant="primary"
        size="sm"
        icon={<Key className="h-4 w-4" />}
        className="ml-3 shadow-[0_0_10px_rgba(6,182,212,0.4)] hover:shadow-[0_0_15px_rgba(192,38,211,0.6)]"
      >
        LOGIN
      </CyberpunkButton>
      <LoginModal
        isOpen={open}
        setOpen={setOpen}
        handleGoogleLogin={handleGoogleLogin}
        handleGithubLogin={handleGithubLogin}
      />
    </>
  );
}
