import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/utils";
import { getPosts } from "@/lib/db-actions/post-actions";

// returns an array of recent posts titles
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { posts } = await getPosts({});

    return NextResponse.json({
      recentPosts: posts.map((post) => post.title),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
