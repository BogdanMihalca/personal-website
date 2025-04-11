"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { CyberpunkButton } from "./cyber-button";
import { HologramContainer } from "./hologram-container";
import { LogOut, Key, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { DecoDivider } from "./deco-divider";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CyberpunkButton
          variant="primary"
          size="sm"
          icon={<Key className="h-4 w-4" />}
          className="ml-3 shadow-[0_0_10px_rgba(6,182,212,0.4)] hover:shadow-[0_0_15px_rgba(192,38,211,0.6)]"
        >
          LOGIN
        </CyberpunkButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] border-cyan-500/50 bg-gray-900/95 backdrop-blur-md font-mono">
        <HologramContainer variant="glitch" intensity="medium" className="p-4">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-cyan-300 flex items-center justify-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-neon-pink" />
              <span>AUTHENTICATION_REQUIRED</span>
            </DialogTitle>
            <DialogDescription className="text-center text-cyan-400/70 font-mono">
              Connect to mainframe using secure protocol
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="block text-center mt-4">
            <CyberpunkButton
              variant="primary"
              type="button"
              onClick={handleGoogleLogin}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="27"
                  height="27"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              }
              className="w-full shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            >
              CONNECT_WITH_GOOGLE
            </CyberpunkButton>
            <CyberpunkButton
              variant="primary"
              type="button"
              onClick={handleGithubLogin}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="27"
                  height="27"
                  viewBox="0,0,256,256"
                >
                  <g fill="#ffffff">
                    <g transform="scale(5.12,5.12)">
                      <path d="M17.791,46.836c0.711,-0.306 1.209,-1.013 1.209,-1.836v-5.4c0,-0.197 0.016,-0.402 0.041,-0.61c-0.014,0.004 -0.027,0.007 -0.041,0.01c0,0 -3,0 -3.6,0c-1.5,0 -2.8,-0.6 -3.4,-1.8c-0.7,-1.3 -1,-3.5 -2.8,-4.7c-0.3,-0.2 -0.1,-0.5 0.5,-0.5c0.6,0.1 1.9,0.9 2.7,2c0.9,1.1 1.8,2 3.4,2c2.487,0 3.82,-0.125 4.622,-0.555c0.934,-1.389 2.227,-2.445 3.578,-2.445v-0.025c-5.668,-0.182 -9.289,-2.066 -10.975,-4.975c-3.665,0.042 -6.856,0.405 -8.677,0.707c-0.058,-0.327 -0.108,-0.656 -0.151,-0.987c1.797,-0.296 4.843,-0.647 8.345,-0.714c-0.112,-0.276 -0.209,-0.559 -0.291,-0.849c-3.511,-0.178 -6.541,-0.039 -8.187,0.097c-0.02,-0.332 -0.047,-0.663 -0.051,-0.999c1.649,-0.135 4.597,-0.27 8.018,-0.111c-0.079,-0.5 -0.13,-1.011 -0.13,-1.543c0,-1.7 0.6,-3.5 1.7,-5c-0.5,-1.7 -1.2,-5.3 0.2,-6.6c2.7,0 4.6,1.3 5.5,2.1c1.699,-0.701 3.599,-1.101 5.699,-1.101c2.1,0 4,0.4 5.6,1.1c0.9,-0.8 2.8,-2.1 5.5,-2.1c1.5,1.4 0.7,5 0.2,6.6c1.1,1.5 1.7,3.2 1.6,5c0,0.484 -0.045,0.951 -0.11,1.409c3.499,-0.172 6.527,-0.034 8.204,0.102c-0.002,0.337 -0.033,0.666 -0.051,0.999c-1.671,-0.138 -4.775,-0.28 -8.359,-0.089c-0.089,0.336 -0.197,0.663 -0.325,0.98c3.546,0.046 6.665,0.389 8.548,0.689c-0.043,0.332 -0.093,0.661 -0.151,0.987c-1.912,-0.306 -5.171,-0.664 -8.879,-0.682c-1.665,2.878 -5.22,4.755 -10.777,4.974v0.031c2.6,0 5,3.9 5,6.6v5.4c0,0.823 0.498,1.53 1.209,1.836c9.161,-3.032 15.791,-11.672 15.791,-21.836c0,-12.682 -10.317,-23 -23,-23c-12.683,0 -23,10.318 -23,23c0,10.164 6.63,18.804 15.791,21.836z"></path>
                    </g>
                  </g>
                </svg>
              }
              className="w-full shadow-[0_0_10px_rgba(6,182,212,0.4)] mt-3"
            >
              CONNECT_WITH_GITHUB
            </CyberpunkButton>
          </DialogFooter>
        </HologramContainer>
      </DialogContent>
    </Dialog>
  );
}
