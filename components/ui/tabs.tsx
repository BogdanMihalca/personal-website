"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-black/50 text-cyan-400 inline-flex h-12 w-fit items-center justify-center rounded-md p-1 border border-cyan-900/50 shadow-[0_0_10px_rgba(0,200,255,0.3)]",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-1 text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-300 border-b-2 border-transparent",
        "text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-900/20",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-cyan-700",
        "data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:bg-cyan-900/20 data-[state=active]:text-cyan-300",
        "data-[state=active]:shadow-[0_0_8px_rgba(6,182,212,0.5),inset_0_0_10px_rgba(6,182,212,0.2)]",
        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:scale-x-0 after:bg-cyan-400 after:transition-transform",
        "hover:after:scale-x-100",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none p-4 border border-cyan-900/30 rounded-md mt-2 bg-black/40 shadow-[0_0_15px_rgba(0,200,255,0.1)]",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
