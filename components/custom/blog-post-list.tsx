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
  const searchQuery =
    searchParams.get("categories") || searchParams.get("tags");

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params}`);
  };

  const pathParts = pathname.split("/");
  const isCategoryPage = pathParts.includes("category");
  const categoryName =
    isCategoryPage && pathParts.length > 3
      ? initialPosts[0]?.category || ""
      : "";

  const renderInfoDisplay = () => {
    const totalPosts =
      initialPosts.length > 0 ? initialPosts.length * totalPages : 0;

    const hasFilters = searchQuery || isCategoryPage;

    const clearFiltersButton = hasFilters && (
      <Link
        href="/blog"
        className="ml-2 text-purple-500 hover:text-purple-400 text-sm transition-all duration-200 inline-flex items-center"
      >
        <span>Clear filters</span>
        <span className="ml-1 text-xs">&times;</span>
      </Link>
    );

    if (searchQuery) {
      return (
        <div className="text-zinc-400 text-sm mb-4 flex items-center">
          <span>
            Found {totalPosts} {totalPosts === 1 ? "result" : "results"}
            for &quot;{searchQuery}&quot;
            {categoryName ? ` in ${categoryName}` : ""}
          </span>
          {clearFiltersButton}
        </div>
      );
    } else if (currentPage > 1) {
      return (
        <div className="text-zinc-400 text-sm mb-4 flex items-center">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {clearFiltersButton}
        </div>
      );
    } else if (totalPosts > 0) {
      return (
        <div className="text-zinc-400 text-sm mb-4 flex items-center">
          <span>
            Showing {totalPosts} {totalPosts === 1 ? "post" : "posts"}
            {categoryName ? ` in ${categoryName}` : ""}
          </span>
          {clearFiltersButton}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      {renderInfoDisplay()}

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
