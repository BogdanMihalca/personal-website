import { GlitchText } from "@/components/custom/glitch-text";
import { DecoDivider } from "@/components/custom/deco-divider";
import { getFeaturedPosts } from "@/lib/db-actions/post-actions";
import { getFilters } from "@/lib/db-actions/filter-actions";
import { BlogSidebar } from "@/components/custom/blog-filers-sidebar";
import { SuspenseMainPostsList } from "@/components/custom/blog-post-fetcher";
import { SideDisplay } from "@/components/custom/side-display";
import { Filter } from "lucide-react";

interface BlogPageProps {
  searchParams: any; //eslint-disable-line @typescript-eslint/no-explicit-any
}

const POSTS_PER_PAGE = 3;

export default async function Page({ searchParams }: BlogPageProps) {
  const {
    page: pageParam,
    q: searchQuery,
    categories: categoryParam,
    tags: tagParam,
  } = await searchParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const skip = (page - 1) * POSTS_PER_PAGE;

  const categoryFilter = categoryParam
    ? categoryParam.split(",").filter(Boolean)
    : [];
  const tagFilter = tagParam ? tagParam.split(",").filter(Boolean) : [];

  const { categories, tags } = await getFilters({ category: "" });
  const featuredPosts = await getFeaturedPosts();

  return (
    <>
      <SideDisplay
        icon={<Filter width={30} height={30} />}
        title="Filters"
        theme="cyber"
        position="left"
        verticalPosition="top"
        verticalOffset={70}
        collapsedSize={40}
        width={420}
        hideOnDesktop={true}
      >
        <BlogSidebar categories={categories} tags={tags} />
      </SideDisplay>
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-purple-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="relative space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="relative">
                <GlitchText className="text-3xl">
                  {searchQuery
                    ? `SEARCH: ${searchQuery.toUpperCase()}`
                    : "BLOG"}
                </GlitchText>
                <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-lg -z-10"></div>
              </div>
            </div>
            <DecoDivider className="relative" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 space-y-8">
              <SuspenseMainPostsList
                skip={skip}
                categoryFilter={categoryFilter}
                tagFilter={tagFilter}
                postsPerPage={POSTS_PER_PAGE}
                searchQuery={searchQuery}
                currentPage={page}
              />
            </div>

            <div className="w-full lg:w-1/3 space-y-8 hidden lg:block">
              <BlogSidebar
                categories={categories}
                tags={tags}
                featuredPosts={featuredPosts}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
