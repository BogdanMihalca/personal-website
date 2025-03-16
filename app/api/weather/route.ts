export async function GET(req: Request) {
  // Fetch weather data from lat long unit or q city name is provided
  const url = new URL(req.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const q = url.searchParams.get("q");
  const unit = url.searchParams.get("unit") || "metric";

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${
    lat && lon ? `lat=${lat}&lon=${lon}` : `q=${q || "Oradea"}`
  }&units=${unit}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
  const response = await fetch(weatherUrl);
  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
