"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Performance context to control animation intensity site-wide
type PerformanceContextType = {
  reducedAnimations: boolean;
  togglePerformanceMode: () => void;
};

const PerformanceContext = createContext<PerformanceContextType>({
  reducedAnimations: false,
  togglePerformanceMode: () => {},
});

export const usePerformanceMode = () => useContext(PerformanceContext);

export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
  const [reducedAnimations, setReducedAnimations] = useState(false);

  // Check for user preference or device capability
  useEffect(() => {
    // Check if user has set preference before
    const savedPreference = localStorage.getItem("reducedAnimations");
    if (savedPreference !== null) {
      setReducedAnimations(savedPreference === "true");
      return;
    }

    // Optionally check for battery status if available
    if ("navigator" in window && "getBattery" in navigator) {
      // @ts-expect-error because getBattery is not in the types
      navigator
        .getBattery() //eslint-disable-next-line
        .then((battery: any) => {
          // If battery is below 20%, suggest reduced animations
          if (battery.level < 0.2 && !battery.charging) {
            setReducedAnimations(true);
          }
        })
        .catch(() => {
          // Battery API not available, fall back to checking device
          checkLowPowerDevice();
        });
    } else {
      checkLowPowerDevice();
    }
  }, []);

  // Simple check for potentially low-power devices
  const checkLowPowerDevice = () => {
    // Check if device is mobile and potentially lower power
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) {
      setReducedAnimations(true);
    }
  };

  const togglePerformanceMode = () => {
    setReducedAnimations((prev) => {
      const newValue = !prev;
      localStorage.setItem("reducedAnimations", String(newValue));
      return newValue;
    });
  };

  return (
    <PerformanceContext.Provider
      value={{ reducedAnimations, togglePerformanceMode }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};
