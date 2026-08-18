import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/utils";
import { getDashboardPosts } from "@/lib/db-actions/post-actions";

// returns an array of recent posts titles
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { posts } = await getDashboardPosts({ take: 10 });

    return NextResponse.json({
      recentPosts: posts.map((post) => post.title),
    });
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch recent posts",
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
