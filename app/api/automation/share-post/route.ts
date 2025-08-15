import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract post data
    const { title, content, url, imageUrl, tags } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Prepare data for n8n webhook
    const webhookData = {
      title,
      content,
      url,
      imageUrl,
      tags,
      timestamp: new Date().toISOString(),
    };

    // Call n8n webhook - replace with your actual webhook URL
    const webhookUrl = process.env.SHARE_HOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Webhook URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.AUTOMATION_API_KEY,
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      throw new Error(`Webhook call failed: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json(
      { success: true, message: "Post shared successfully", data: result },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to share post" },
      { status: 500 }
    );
  }
}
