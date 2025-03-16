/**
 * Custom hook for fetching and managing weather data
 * @param city - City name for weather data
 * @param refreshInterval - Auto-refresh interval in ms
 */
import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  intensity: "light" | "moderate" | "heavy";
}

export const useWeatherData = (city: string, refreshInterval = 300000) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);

      // In a real implementation, you would fetch from an actual weather API
      // For demonstration, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock weather data - replace with actual API call
      const mockWeatherConditions = ["clear", "cloudy", "rain", "fog", "storm"];
      const randomCondition =
        mockWeatherConditions[
          Math.floor(Math.random() * mockWeatherConditions.length)
        ];

      const intensities: Array<"light" | "moderate" | "heavy"> = [
        "light",
        "moderate",
        "heavy",
      ];
      const intensityMap: Record<string, "light" | "moderate" | "heavy"> = {
        rain: intensities[Math.floor(Math.random() * intensities.length)],
        fog: "moderate",
        storm: "heavy",
        cloudy: "light",
        clear: "light",
      };

      const mockData: WeatherData = {
        temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
        feelsLike: Math.floor(Math.random() * 30) + 5,
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 60) + 40, // 40-100%
        windSpeed: Math.floor(Math.random() * 30) + 5, // 5-35 km/h
        visibility: Math.floor(Math.random() * 10) + 1, // 1-10 km
        intensity: intensityMap[randomCondition],
      };

      setData(mockData);
      setError(null);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refresh interval
  useEffect(() => {
    fetchWeatherData();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchWeatherData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [city, refreshInterval]);

  return { data, isLoading, error, refetch: fetchWeatherData };
};
