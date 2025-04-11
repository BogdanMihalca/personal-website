"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

  useEffect(() => {
    const savedPreference = localStorage.getItem("reducedAnimations");
    if (savedPreference !== null) {
      setReducedAnimations(savedPreference === "true");
      return;
    }

    if ("navigator" in window && "getBattery" in navigator) {
      // @ts-expect-error because getBattery is not in the types
      navigator
        .getBattery() //eslint-disable-next-line
        .then((battery: any) => {
          if (battery.level < 0.2 && !battery.charging) {
            setReducedAnimations(true);
          }
        })
        .catch(() => {
          checkLowPowerDevice();
        });
    } else {
      checkLowPowerDevice();
    }
  }, []);

  const checkLowPowerDevice = () => {
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
