"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GlitchText } from "@/components/custom/glitch-text";
import { HologramContainer } from "@/components/custom/hologram-container";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number;
  max: number;
  color?: string;
}

interface StatsDisplay {
  endpoint: string;
  title: string;
  className?: string;
  refreshInterval?: number;
  maxItems?: number;
}

const StatsDisplay = ({
  endpoint,
  title,
  className,
  refreshInterval = 60000, // 1 minute default
  maxItems = 5,
}: StatsDisplay) => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const processedStats = Object.entries(data)
        .slice(0, maxItems)
        .map(([key, value]: [string, unknown]) => ({
          label: key,
          value: typeof value === "number" ? value : 0,
          max: 100,
          color: getRandomNeonColor(),
        }));

      setStats(processedStats);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, maxItems]);

  // Random neon color generator for variety
  const getRandomNeonColor = () => {
    const colors = [
      "neon-cyan",
      "neon-purple",
      "neon-pink",
      "neon-green",
      "neon-yellow",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    fetchData();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [endpoint, fetchData, refreshInterval]);

  return (
    <HologramContainer className={cn("w-full", className)}>
      <Card className="bg-space-black/70 border-neon-cyan/30 backdrop-blur-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="font-retro text-neon-cyan">
              <GlitchText text={title.toUpperCase()} />
            </CardTitle>

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isLoading ? "bg-neon-yellow animate-pulse" : "bg-neon-green"
                )}
              />
              <span className="text-xs text-gray-400  ">
                {isLoading ? "SYNCING" : "LIVE"}
              </span>
            </div>
          </div>

          {lastUpdated && (
            <div className="text-xs text-gray-500  ">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="text-neon-pink text-center py-4 font-glitch">
              CONNECTION ERROR: {error}
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading && stats.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-800 rounded w-1/4 mb-2"></div>
                      <div className="h-2 bg-gray-800 rounded"></div>
                    </div>
                  ))
                : stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-300  ">
                          {stat.label}
                        </div>
                        <div
                          className={`text-sm text-${stat.color} font-medium`}
                        >
                          {stat.value} / {stat.max}
                        </div>
                      </div>

                      <Progress
                        value={(stat.value / stat.max) * 100}
                        className={`h-1.5 bg-gray-800`}
                        color={stat.color}
                      />
                    </motion.div>
                  ))}
            </div>
          )}
        </CardContent>
      </Card>
    </HologramContainer>
  );
};

export { StatsDisplay };
