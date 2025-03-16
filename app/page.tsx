import { CyberpunkDisplay } from "@/components/custom/cyber-diplay";
import { CyberpunkHero } from "@/components/custom/hero-section";
import { RainEffect } from "@/components/custom/rain-effect";
import { StatsDisplay } from "@/components/custom/stat-display";

const CyberpunkPortfolio = () => {
  return (
    <div className="bg-transparent">
      <CyberpunkHero />
      <div className="h-[1000px]">
        {/* Stats Display for system metrics */}
        <StatsDisplay endpoint="/api/system-stats" title="System Performance" />
        {/* Stats Display for network metrics */}
        <StatsDisplay endpoint="/api/network-stats" title="Network Status" />
        {/* Stats Display for user metrics */}
        <StatsDisplay endpoint="/api/user-stats" title="User Activity" />
        <CyberpunkDisplay title="Rainy Night">
          <p className="text-lg text-white">
            It was a dark and stormy night. The rain fell in torrents, except at
            occasional intervals, when it was checked by a violent gust of wind
            which swept up the streets (for it is in London that our scene
            lies), rattling along the housetops, and fiercely agitating the
            scanty flame of the lamps that struggled against the darkness.
          </p>
        </CyberpunkDisplay>

        <RainEffect
          intensity="moderate"
          color="cyan"
          className="w-full h-96 relative"
        />
        <RainEffect
          intensity="heavy"
          color="pink"
          className="w-full h-96 relative"
        />
      </div>
    </div>
  );
};

export default CyberpunkPortfolio;
