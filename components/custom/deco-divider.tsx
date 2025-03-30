import { cn } from "@/lib/utils";

interface DecoDividerProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "neon" | "holo" | "glitch";
}

const DecoDivider = ({
    className,
    size = "md",
    variant = "neon",
}: DecoDividerProps) => {
    const sizeClasses = {
        sm: "h-px",
        md: "h-1",
        lg: "h-2",
    };

    const variantClasses = {
        neon: "from-transparent via-neon-cyan to-transparent animate-pulse",
        holo: "from-transparent via-purple-500 to-transparent animate-shimmer",
        glitch: "from-red-500 via-neon-cyan to-purple-500 animate-glitch",
    };

    return (
        <div className={cn(
            "bg-gradient-to-r w-full rounded-sm",
            sizeClasses[size],
            variantClasses[variant],
            className
        )} />
    );
}

export { DecoDivider };