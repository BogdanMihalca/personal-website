"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group z-50"
      style={
        {
          "--normal-bg": "hsl(240, 15%, 8%)",
          "--normal-text": "hsl(180, 100%, 75%)",
          "--normal-border": "hsl(210, 100%, 50%)",
          "--font": "'JetBrains Mono', monospace",
          "--border-radius": "4px",
        } as React.CSSProperties
      }
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "border-l-4 border-r border-t border-b border-[hsl(210,100%,50%)] rounded-md shadow-[0_0_15px_rgba(0,200,255,0.4)] backdrop-blur-sm p-3 grid grid-cols-[auto_1fr_auto] gap-2 items-center bg-[hsla(240,20%,7%,0.85)] max-w-sm ",
          title:
            "font-bold text-[hsl(180,100%,75%)] text-sm flex items-center gap-2",
          error:
            "border-l-4 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.4)]",
          success:
            "border-l-4 border-green-500 shadow-[0_0_15px_rgba(0,255,0,0.4)]",
          warning:
            "border-l-4 border-yellow-500 shadow-[0_0_15px_rgba(255,255,0,0.4)]",
          info: "border-l-4 border-blue-500 shadow-[0_0_15px_rgba(0,0,255,0.4)]",
          description: "text-[hsl(180,70%,65%)] opacity-90 mt-0.5 text-xs",
          actionButton:
            "bg-[hsl(210,100%,50%)] text-black hover:bg-[hsl(210,100%,70%)] text-xs px-2 py-1 ml-2 transition-colors rounded",
          cancelButton:
            "bg-transparent border border-[hsl(0,100%,50%)] text-[hsl(0,100%,70%)] hover:bg-[hsla(0,100%,50%,0.1)] px-3 py-1 transition-colors",
          closeButton:
            "text-[hsl(180,100%,75%)] opacity-70 hover:opacity-100 ml-auto",
          loader: "text-[hsl(180,100%,75%)]",
          icon: "flex-shrink-0 mr-2 text-[hsl(180,100%,75%)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
