export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  //this generates an image of the moon phase based on the current date
  const moonPhaseUrl = `https://api.astronomyapi.com/api/v2/studio/moon-phase`;

  const authString = btoa(
    `${process.env.ASTRONOMY_APP_ID}:${process.env.ASTRONOMY_API_KEY}`
  );
  const response = await fetch(moonPhaseUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      Origin: "https://astronomyapi.com",
    },
    body: JSON.stringify({
      format: "png",
      style: {
        moonStyle: "sketch",
        backgroundStyle: "stars",
        backgroundColor: "red",
        headingColor: "white",
        textColor: "red",
      },
      observer: {
        latitude: Number(lat),
        longitude: Number(lon),
        date: new Date().toISOString(),
      },
      view: {
        type: "portrait-simple",
        orientation: "south-up",
      },
    }),
  });

  const data = await response.json();
  console.log("Moon Phase Data:------->", data);

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch moon phase" }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
