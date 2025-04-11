"use server";

import { getPosts, getPostsByCategory } from "@/lib/db-utils";
import { BlogPostList } from "@/components/custom/blog-post-list";
import { Suspense } from "react";
import { BlogPostSkeletonList } from "@/components/custom/blog-post-skeleton";

interface PostFetcherProps {
  skip: number;
  categoryFilter?: string[];
  tagFilter?: string[];
  postsPerPage: number;
  searchQuery?: string;
  currentPage: number;
}

interface CategoryPostFetcherProps {
  category: string; // slug
  skip: number;
  tagFilter?: string[];
  postsPerPage: number;
  searchQuery?: string;
  currentPage: number;
}

async function MainPostsFetcher({
  skip,
  categoryFilter = [],
  tagFilter = [],
  postsPerPage,
  searchQuery = "",
  currentPage,
}: PostFetcherProps) {
  const posts = await getPosts({
    skip,
    categoryFilter,
    tagFilter,
    POSTS_PER_PAGE: postsPerPage,
    searchQuery,
  });

  return (
    <BlogPostList
      initialPosts={posts.posts}
      totalPages={posts.totalPages}
      currentPage={currentPage}
    />
  );
}

async function CategoryPostsFetcher({
  category,
  skip,
  tagFilter = [],
  postsPerPage,
  searchQuery = "",
  currentPage,
}: CategoryPostFetcherProps) {
  const posts = await getPostsByCategory({
    category,
    skip,
    tagFilter,
    POSTS_PER_PAGE: postsPerPage,
    searchQuery,
  });

  return (
    <BlogPostList
      initialPosts={posts.posts}
      totalPages={posts.totalPages}
      currentPage={currentPage}
    />
  );
}

export async function SuspenseMainPostsList({
  skip,
  categoryFilter = [],
  tagFilter = [],
  postsPerPage,
  searchQuery = "",
  currentPage,
}: PostFetcherProps) {
  const cacheKey = `main-page-${currentPage}-${categoryFilter.join(
    ","
  )}-${tagFilter.join(",")}-${searchQuery}`;

  return (
    <Suspense key={cacheKey} fallback={<BlogPostSkeletonList />}>
      <MainPostsFetcher
        skip={skip}
        categoryFilter={categoryFilter}
        tagFilter={tagFilter}
        postsPerPage={postsPerPage}
        searchQuery={searchQuery}
        currentPage={currentPage}
      />
    </Suspense>
  );
}

export async function SuspenseCategoryPostsList({
  category,
  skip,
  tagFilter = [],
  postsPerPage,
  searchQuery = "",
  currentPage,
}: CategoryPostFetcherProps) {
  const cacheKey = `category-${category}-page-${currentPage}-${tagFilter.join(
    ","
  )}-${searchQuery}`;

  return (
    <Suspense key={cacheKey} fallback={<BlogPostSkeletonList />}>
      <CategoryPostsFetcher
        category={category}
        skip={skip}
        tagFilter={tagFilter}
        postsPerPage={postsPerPage}
        searchQuery={searchQuery}
        currentPage={currentPage}
      />
    </Suspense>
  );
}
