export async function POST(req: Request) {
  const { email, message, name } = await req.json();

  if (!email || !email.includes("@")) {
    return new Response("Invalid email", { status: 400 });
  }

  if (!message) {
    return new Response("Invalid message", { status: 400 });
  }

  if (!name) {
    return new Response("Invalid name", { status: 400 });
  }

  try {
    await fetch(process.env.CONTACT_HOOK_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.CONTACT_AUTHENTICATION as string,
      },
      body: JSON.stringify({
        email,
        date: new Date().toISOString(),
        message,
        name,
      }),
    });

    return new Response("Message sent", { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response("Error sending message", { status: 500 });
  }
}
