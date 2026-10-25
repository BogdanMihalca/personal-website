import { NextRequest } from "next/server";

/**
 * Contact form API route.
 *
 * Bot-protection layers applied:
 *  1. Honeypot field — bots fill ALL fields; a hidden `_hp` field being
 *     non-empty means the submitter is almost certainly a bot.
 *  2. Timing check — legitimate users take at least a few seconds to fill a
 *     form. Submissions faster than MIN_FORM_MS are silently "succeeded"
 *     (fake 200) but never delivered.
 *  3. Basic field validation (unchanged).
 */

const MIN_FORM_MS = 3000; // 3 seconds — humans are slower than bots

function logSuspiciousSubmission(
  req: NextRequest,
  reason: string,
  fields: object
) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";
  console.warn(
    JSON.stringify({
      event: "SUSPICIOUS_CONTACT_SUBMISSION",
      reason,
      ip,
      userAgent: ua,
      fields,
      timestamp: new Date().toISOString(),
    })
  );
}

// Re-usable fake success — bots think they succeeded, we just don't send
const fakeOk = () => new Response("Message sent", { status: 200 });

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    email,
    message,
    name,
    // Honeypot: hidden via CSS on the client. Bots fill every field they see.
    _hp,
    // Unix ms timestamp set by the client when the form first renders
    _t,
  } = body;

  // ── 1. Honeypot check ──────────────────────────────────────────────────────
  if (_hp) {
    logSuspiciousSubmission(req, "honeypot_triggered", { email, _hp });
    return fakeOk(); // Silent fake success
  }

  // ── 2. Timing check ───────────────────────────────────────────────────────
  if (_t) {
    const elapsed = Date.now() - Number(_t);
    if (elapsed < MIN_FORM_MS) {
      logSuspiciousSubmission(req, "too_fast", { email, elapsed_ms: elapsed });
      return fakeOk(); // Silent fake success
    }
  }

  // ── 3. Field validation ───────────────────────────────────────────────────
  if (!email || !email.includes("@")) {
    return new Response("Invalid email", { status: 400 });
  }

  if (!message) {
    return new Response("Invalid message", { status: 400 });
  }

  if (!name) {
    return new Response("Invalid name", { status: 400 });
  }

  // ── 4. Deliver message ────────────────────────────────────────────────────
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
