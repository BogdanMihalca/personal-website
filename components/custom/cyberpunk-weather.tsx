"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wind,
  Droplets,
  Sun,
  Cloud,
  CloudFog,
  CloudSnow,
  CloudLightning,
  Thermometer,
  Search,
  MapPin,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RainEffect } from "@/components/custom/rain-effect";
import { CyberpunkButton } from "./cyber-button";

const CyberpunkWeather = ({ defaultCity = "Oradea" }) => {
  const [city, setCity] = useState(defaultCity);
  const [inputCity, setInputCity] = useState("");
  const [weather, setWeather] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showRainEffect, setShowRainEffect] = useState(false);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity("");
    }
  };

  const handleGetCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `api/weather?lat=${latitude}&lon=${longitude}`
            );

            if (!response.ok) {
              throw new Error("Weather data not available for your location");
            }

            const data = await response.json();
            setWeather(data);
            setCity(data.name); // Update city name from API response
            setLoading(false);
            checkForRainEffect(data.weather[0].main);
          } catch (err: unknown) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unknown error occurred");
            }

            setLoading(false);
          }
        },
        () => {
          setError("Unable to retrieve your location. Please search manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  const checkForRainEffect = (weatherMain: string) => {
    setShowRainEffect(
      weatherMain.toLowerCase().includes("rain") ||
        weatherMain.toLowerCase().includes("drizzle")
    );
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(`api/weather?q=${city}`);

        if (!response.ok) {
          throw new Error("Weather data not available");
        }

        const data = await response.json();
        setWeather(data);
        setLoading(false);
        checkForRainEffect(data.weather[0].main);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Weather icon mapping
  const getWeatherIcon = (weatherCode: string) => {
    const code = weatherCode?.toLowerCase() || "";

    if (code.includes("clear"))
      return <Sun className="text-yellow-400" size={36} />;
    if (code.includes("cloud"))
      return <Cloud className="text-blue-300" size={36} />;
    if (code.includes("rain"))
      return <Droplets className="text-blue-400" size={36} />;
    if (code.includes("snow"))
      return <CloudSnow className="text-white" size={36} />;
    if (code.includes("fog") || code.includes("mist"))
      return <CloudFog className="text-gray-400" size={36} />;
    if (code.includes("thunder"))
      return <CloudLightning className="text-yellow-500" size={36} />;
    return <Thermometer className="text-red-400" size={36} />;
  };

  // Neon color based on temperature
  const getNeonColor = (temp: number) => {
    if (temp < 0) return "from-blue-500 to-purple-600";
    if (temp < 10) return "from-cyan-500 to-blue-600";
    if (temp < 20) return "from-green-500 to-teal-600";
    if (temp < 30) return "from-yellow-500 to-amber-600";
    return "from-red-500 to-pink-600";
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-black bg-opacity-80 rounded-lg border border-blue-900">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-full"
          />
          <p className="text-cyan-400   text-sm">SCANNING ATMOSPHERE</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-black bg-opacity-80 text-red-500 border border-red-800 rounded-lg min-h-[200px] flex flex-col justify-center">
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 bg-red-600 animate-pulse mr-2 rounded-full"></div>
          <h3 className="  text-lg">SYSTEM ERROR</h3>
        </div>
        <p className="  font-bold">[ERROR]: {error}</p>
        <p className="  text-sm text-gray-400 mt-2">
          Check API key and connection status
        </p>
        <motion.div
          className="w-full h-1 bg-red-900 mt-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
        />
      </div>
    );
  }

  if (!weather) return null;

  const temp = Math.round(weather.main.temp);
  const tempNeonColor = getNeonColor(temp);
  const weatherDescription = weather.weather[0].description;
  const windSpeed = Math.round(weather.wind.speed);
  const humidity = weather.main.humidity;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full  backdrop-blur-sm rounded-lg overflow-hidden relative"
    >
      {showRainEffect && (
        <RainEffect
          intensity={
            windSpeed > 10 ? "heavy" : windSpeed > 5 ? "moderate" : "light"
          }
          className="w-full h-full absolute top-0 left-0"
          color="cyan"
        />
      )}

      <div className="p-3 border-b border-blue-900 bg-black bg-opacity-60">
        <form onSubmit={handleCitySubmit} className="flex flex-wrap gap-2">
          <Input
            type="text"
            placeholder="Enter city name..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className="bg-gray-900 border-blue-800 text-cyan-100  text-sm placeholder:text-gray-500 focus:border-cyan-500 flex-grow min-w-[150px]"
          />
          <div className="flex gap-2">
            <CyberpunkButton
              loading={loading}
              type="submit"
              loadingText="SYS::SYNCING_"
              size="sm"
              variant="primary"
              icon={<Search size={16} className="mr-1 text-cyan-300" />}
            >
              SCAN
            </CyberpunkButton>
            <CyberpunkButton
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleGetCurrentLocation}
              icon={<MapPin size={16} className="mr-1 text-pink-300" />}
            >
              GEOLOCATE
            </CyberpunkButton>
          </div>
        </form>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 h-full">
        {/* Left Panel - Main Weather */}
        <div className="flex flex-col space-y-2">
          {/* City Name with Typing Effect */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <motion.h2
              className="  text-xl text-white uppercase tracking-widest overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {city}
            </motion.h2>
          </motion.div>

          {/* Temperature Display */}
          <div className="flex items-center space-x-4 bg-black bg-opacity-40 p-3 rounded-md border border-gray-800">
            {getWeatherIcon(weather.weather[0].main)}
            <div className="flex items-end">
              <motion.span
                className={`text-5xl font-bold bg-gradient-to-r ${tempNeonColor} bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                {temp}
              </motion.span>
              <span className="text-xl text-blue-300">°C</span>
            </div>
          </div>

          {/* Weather Description */}
          <div className="bg-gray-900 bg-opacity-60 p-3 rounded border border-gray-800">
            <div className="flex items-center">
              <div className="w-1 h-1 rounded-full bg-cyan-500 mr-2 animate-pulse"></div>
              <p className="  text-cyan-400 uppercase tracking-wider">
                {weatherDescription}
              </p>
            </div>
          </div>

          {/* Digital Frame */}
          <motion.div
            className="border border-blue-800 p-3 rounded-md bg-black bg-opacity-60 flex-grow flex flex-col justify-between"
            whileHover={{ boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)" }}
          >
            <div className="">
              <p className="text-gray-400   text-xs">LOCATION ID</p>
              <p className="text-cyan-300   text-xs">{weather.id}</p>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-900 to-transparent my-2"></div>
            <div className="">
              <p className="text-gray-400   text-xs">COORDINATES</p>
              <p className="text-cyan-300   text-xs">
                {weather.coord.lat.toFixed(2)}, {weather.coord.lon.toFixed(2)}
              </p>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-900 to-transparent my-2"></div>
            <div className="f">
              <p className="text-gray-400   text-xs">TIME CAPTURED</p>
              <p className="text-cyan-300   text-xs">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Details */}
        <div className="flex flex-col space-y-2">
          {/* Status Bar */}
          <div className="flex items-center justify-between bg-black bg-opacity-60 p-2 rounded border border-gray-800">
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-400   text-xs">SYSTEM ONLINE</span>
            </div>
            <span className="text-blue-300   text-xs">WTR-OS v1.3.7</span>
          </div>

          {/* Humidity */}
          <Card className="bg-gray-900 bg-opacity-70 border-blue-900 p-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Droplets size={14} className="text-blue-400 mr-1" />
                <span className="text-gray-300   text-xs">HUMIDITY</span>
              </div>
              <span className="text-blue-300  ">{humidity}%</span>
            </div>
            <Progress value={humidity} className="h-2 bg-gray-800">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{
                  boxShadow: "0 0 5px rgba(147, 51, 234, 0.5)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${humidity}%` }}
                transition={{ duration: 1 }}
              />
            </Progress>
          </Card>

          {/* Wind Speed */}
          <Card className="bg-gray-900 bg-opacity-70 border-blue-900 p-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Wind size={14} className="text-cyan-400 mr-1" />
                <span className="text-gray-300   text-xs">WIND</span>
              </div>
              <span className="text-cyan-300  ">{windSpeed} m/s</span>
            </div>
            <div className="relative h-4">
              <motion.div
                className="absolute left-0 top-0 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                style={{
                  boxShadow: "0 0 5px rgba(6, 182, 212, 0.5)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(windSpeed * 10, 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-2 flex-grow">
            <Card className="bg-gray-900 bg-opacity-70 border-blue-900 p-2 flex flex-col justify-between hover:bg-opacity-80 transition-all duration-300">
              <span className="text-gray-400   text-xs">PRESSURE</span>
              <span className="text-purple-400   text-lg drop-shadow-[0_0_3px_rgba(168,85,247,0.5)]">
                {weather.main.pressure}
              </span>
              <span className="text-gray-500   text-xs">hPa</span>
            </Card>

            <Card className="bg-gray-900 bg-opacity-70 border-blue-900 p-2 flex flex-col justify-between hover:bg-opacity-80 transition-all duration-300">
              <span className="text-gray-400   text-xs">VISIBILITY</span>
              <span className="text-yellow-400   text-lg drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]">
                {weather.visibility / 1000}
              </span>
              <span className="text-gray-500   text-xs">km</span>
            </Card>

            {weather.rain && (
              <Card className="bg-gray-900 bg-opacity-70 border-blue-900 p-2 flex flex-col justify-between hover:bg-opacity-80 transition-all duration-300">
                <span className="text-gray-400   text-xs">RAIN VOL</span>
                <span className="text-blue-400   text-lg drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]">
                  {weather.rain["1h"] || 0}
                </span>
                <span className="text-gray-500   text-xs">mm</span>
              </Card>
            )}

            <Card className="bg-gray-900 bg-opacity-70 border-blue-900 p-2 flex flex-col justify-between hover:bg-opacity-80 transition-all duration-300">
              <span className="text-gray-400   text-xs">FEELS LIKE</span>
              <span className="text-red-400   text-lg drop-shadow-[0_0_3px_rgba(239,68,68,0.5)]">
                {Math.round(weather.main.feels_like)}
              </span>
              <span className="text-gray-500   text-xs">°C</span>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Cyberpunk Highlight */}
      <div className="relative h-2 w-full overflow-hidden">
        <motion.div
          className={`h-full w-full bg-gradient-to-r ${tempNeonColor}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full w-20 bg-white opacity-30"
          animate={{
            x: ["0%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
};

export default CyberpunkWeather;
