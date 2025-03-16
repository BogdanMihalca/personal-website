"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useGlitchText } from "@/lib/hooks/useGlitchText";
import { CyberpunkButton } from "./cyber-button";

const MoonPhase = () => {
  const [moonImageUrl, setMoonImageUrl] = useState<string | null>(null);
  const [moonData, setMoonData] = useState<any>(null); //eslint-disable-line
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useGlitchText({ interval: 200 });

  const fetchMoonPhase = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      const formattedLat = latitude.toFixed(4);
      const formattedLon = longitude.toFixed(4);

      // Add artificial delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await fetch(
        `/api/moon-phase?lat=${formattedLat}&lon=${formattedLon}`
      );

      if (!response.ok) {
        throw new Error("DATA TRANSMISSION FAILED");
      }

      const data = await response.json();

      if (data.data && data.data.imageUrl) {
        setMoonImageUrl(data.data.imageUrl);
        setMoonData({
          coords: `${formattedLat}°N ${formattedLon}°E`,
          timestamp: new Date().toISOString(),
          ...data.data,
        });
      } else {
        throw new Error("CORRUPT DATA RECEIVED");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "SYS_ERROR: UNKNOWN FAILURE"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoonPhase();
  }, []);

  return (
    <div className="w-full relative overflow-hidden">
      <div className="relative flex flex-col items-center p-2 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/90 to-cyan-900/80 z-0" />

        <div className="absolute inset-0 bg-scanline z-10 pointer-events-none opacity-10"></div>

        <div className="flex flex-col items-center mb-2 z-20">
          <div className="flex items-center mb-1">
            <div className="h-px w-8 bg-cyan-500"></div>
            <span className="text-xs font-mono text-cyan-500 mx-2 tracking-widest">
              NETRUNNER//CORP
            </span>
            <div className="h-px w-8 bg-cyan-500"></div>
          </div>

          <h2
            className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 z-20 glitch-text"
            data-text="LUNAR INTERFACE v3.1"
          >
            LUNAR INTERFACE v3.1
          </h2>

          <div className="text-xs font-mono text-purple-400 mt-1 tracking-wider">
            {loading ? (
              <span className="animate-pulse">ESTABLISHING CONNECTION...</span>
            ) : (
              <span
                className="glitch-text"
                data-text={`SYNC: ${new Date()
                  .toISOString()
                  .split("T")[1]
                  .substring(0, 8)}`}
              >
                SYNC: {new Date().toISOString().split("T")[1].substring(0, 8)}
              </span>
            )}
          </div>
        </div>

        <div className="relative bg-black/70 border border-purple-600/50 p-2 mb-4 z-20 w-96 h-96 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500"></div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-32 h-32 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500"></div>
                <div className="absolute inset-4 rounded-full border border-cyan-400"></div>
              </div>
              <div className="mt-4 font-mono text-purple-400 text-sm animate-pulse">
                ACQUIRING SATELLITE FEED
              </div>
              <div className="mt-2 font-mono text-cyan-300 text-xs">
                [DATA PACKETS:{" "}
                <span className="text-purple-300 animate-pulse">
                  {Math.floor(Math.random() * 100)}%
                </span>
                ]
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
              <div
                className="text-xl mb-2 font-mono animate-pulse glitch-text"
                data-text="TRANSMISSION ERROR"
              >
                TRANSMISSION ERROR
              </div>
              <div className="text-sm text-red-400 font-mono">
                ERROR_CODE: {(Math.random() * 9999).toFixed(0)}
              </div>
              <div className="mt-2 p-2 bg-black/50 border border-red-500/50 text-red-300 text-xs max-w-xs">
                {error}
              </div>
            </div>
          ) : moonImageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={moonImageUrl}
                alt="Current moon phase"
                fill
                className="object-contain z-20"
                layout="fill"
              />

              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm border border-purple-500/30 text-xs font-mono text-cyan-400 p-2 z-30">
                <div className="flex justify-between">
                  <span>LAT/LON:</span>
                  <span className="text-purple-300">
                    {moonData?.coords || "CALCULATING..."}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-purple-500 font-mono">
              NO LUNAR DATA AVAILABLE
            </div>
          )}
        </div>

        <div className="font-mono text-cyan-400 text-sm mb-4 z-20 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              loading
                ? "bg-yellow-500 animate-pulse"
                : error
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          ></span>
          {loading ? (
            <span className="animate-pulse">ANALYZING LUNAR DATA...</span>
          ) : error ? (
            <span
              className="text-red-400 glitch-text"
              data-text="SYSTEM ERROR • CHECK CONSOLE"
            >
              SYSTEM ERROR • CHECK CONSOLE
            </span>
          ) : (
            <span
              className="glitch-text"
              data-text="CURRENT LUNAR PHASE • LIVE FEED"
            >
              CURRENT LUNAR PHASE • LIVE FEED
            </span>
          )}
        </div>

        <div className="flex gap-4 z-20">
          <CyberpunkButton
            loading={loading}
            onClick={fetchMoonPhase}
            loadingText="SYS::SYNCING_"
            size="sm"
            variant="primary"
          >
            REFRESH_DATA::MOON
          </CyberpunkButton>
        </div>

        <div className="w-full mt-4 z-20">
          <div className="bg-black/70 border-t border-purple-500/30 font-mono text-xs text-green-400 p-2 text-left overflow-hidden">
            <div className="animate-typing">
              $ moon_track --init --sector=local --render=true
            </div>
            <div className="text-cyan-300">
              &gt; Connection established. Lunar tracking active.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MoonPhase };
