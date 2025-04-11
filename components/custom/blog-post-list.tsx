"use client";

import type { BlogPost } from "@/components/custom/blog-post-card";
import { BlogPostCard } from "@/components/custom/blog-post-card";
import { CyberPagination } from "@/components/custom/cyber-pagination";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface BlogPostListProps {
  initialPosts: BlogPost[];
  totalPages: number;
  currentPage: number;
}

export function BlogPostList({
  initialPosts,
  totalPages,
  currentPage,
}: BlogPostListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params}`);
  };

  return (
    <div className="space-y-8">
      {initialPosts.length > 0 ? (
        <div className="space-y-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50 pointer-events-none" />
          {initialPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-zinc-800/50 rounded-lg bg-black/30 backdrop-blur-sm">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 blur opacity-75" />
            <p className="relative text-zinc-500 mb-4">
              No posts match your filters
            </p>
          </div>
          <Link
            href="/blog"
            className="relative text-purple-500 hover:text-purple-400 transition-all duration-200"
          >
            Clear Filters
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 blur opacity-75" />
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 blur-lg opacity-50" />
          <CyberPagination
            currentPage={currentPage}
            totalPages={totalPages}
            className="relative z-10"
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
