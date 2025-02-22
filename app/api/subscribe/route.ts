export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return new Response("Invalid email", { status: 400 });
  }
  await fetch(process.env.HOOK_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AUTHENTICATION as string,
    },
    body: JSON.stringify({ email, date: new Date().toISOString() }),
  });

  return new Response("Success", { status: 200 });
}
