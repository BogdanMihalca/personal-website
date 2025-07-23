"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      onCheckedChange={(checked) => {
        setIsChecked(checked);
        props.onCheckedChange?.(checked);
      }}
      className={cn(
        "peer relative inline-flex h-6 w-11 shrink-0 items-center transition-all duration-300 outline-none overflow-hidden",
        "bg-gray-900 border border-gray-700",
        "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-900/50 data-[state=checked]:to-purple-900/50",
        "data-[state=checked]:border-cyan-500 data-[state=checked]:shadow-[0_0_15px_rgba(6,182,212,0.3)]",
        "data-[state=unchecked]:bg-gray-900 data-[state=unchecked]:border-gray-600",
        "focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-700 disabled:hover:shadow-none",
        "before:absolute before:top-0 before:left-0 before:w-1 before:h-1 before:border-l before:border-t before:border-cyan-400/30",
        "after:absolute after:bottom-0 after:right-0 after:w-1 after:h-1 after:border-r after:border-b after:border-cyan-400/30",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-4 w-4 transition-all duration-300 relative",
          "border border-gray-600 bg-gradient-to-br from-gray-300 to-gray-500",
          "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0.5",
          "data-[state=checked]:border-cyan-400 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-cyan-300 data-[state=checked]:to-cyan-500",
          "data-[state=checked]:shadow-[0_0_10px_rgba(6,182,212,0.5)]",
          "data-[state=unchecked]:border-gray-500 data-[state=unchecked]:bg-gradient-to-br data-[state=unchecked]:from-gray-400 data-[state=unchecked]:to-gray-600",
          "before:absolute before:top-0 before:left-0 before:w-1 before:h-1 before:bg-gray-900 before:rotate-45 before:transform before:-translate-x-0.5 before:-translate-y-0.5",
          "after:absolute after:bottom-0 after:right-0 after:w-1 after:h-1 after:bg-gray-900 after:rotate-45 after:transform after:translate-x-0.5 after:translate-y-0.5",
          "data-[state=checked]:animate-pulse"
        )}
      />

      {isChecked && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent",
            "animate-[scan_2s_ease-in-out_infinite]"
          )}
        />
      )}
    </SwitchPrimitive.Root>
  );
}

export { Switch };
