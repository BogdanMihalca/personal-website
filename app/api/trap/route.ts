import { NextRequest } from "next/server";

/**
 * Honeypot API endpoint. Intentionally looks like a tempting admin/data API.
 * Bots that discover and probe this route are logged and receive fake success
 * responses to waste their time. This endpoint is referenced from llms.txt and
 * well-known paths that scanners typically crawl.
 *
 * Real users have no reason to access this endpoint; only automated scrapers
 * and vulnerability scanners will stumble upon it.
 */

function logBotProbe(req: NextRequest, method: string) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";
  const referer = req.headers.get("referer") ?? "none";
  const now = new Date().toISOString();

  // Server-side log — visible in your hosting platform's log stream
  console.warn(
    JSON.stringify({
      event: "HONEYPOT_HIT",
      method,
      path: "/api/trap",
      ip,
      userAgent: ua,
      referer,
      timestamp: now,
    })
  );
}

// Fake "successful" payload — looks like real data to keep bots engaged
const fakeSuccessPayload = {
  status: "ok",
  data: {
    users: 0,
    records: [],
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.HONEYPOT.do_not_use",
    admin: false,
    message: "No records found for your query.",
  },
  _meta: {
    checkpoint: true,
    note: "This endpoint is monitored. Unauthorized access is logged.",
  },
};

export async function GET(req: NextRequest) {
  logBotProbe(req, "GET");
  // Artificial delay to waste scraper time
  await new Promise((r) => setTimeout(r, 1500));
  return Response.json(fakeSuccessPayload, { status: 200 });
}

export async function POST(req: NextRequest) {
  logBotProbe(req, "POST");
  await new Promise((r) => setTimeout(r, 2000));
  return Response.json(
    { ...fakeSuccessPayload, status: "created" },
    { status: 201 }
  );
}

export async function PUT(req: NextRequest) {
  logBotProbe(req, "PUT");
  await new Promise((r) => setTimeout(r, 1500));
  return Response.json(fakeSuccessPayload, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  logBotProbe(req, "DELETE");
  await new Promise((r) => setTimeout(r, 1000));
  return Response.json({ status: "deleted", affected: 0 }, { status: 200 });
}
