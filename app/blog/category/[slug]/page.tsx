import BlogSidebar from "@/components/custom/blog-filers-sidebar";
import { DecoDivider } from "@/components/custom/deco-divider";
import { GlitchText } from "@/components/custom/glitch-text";
import { SuspenseCategoryPostsList } from "@/components/custom/blog-post-fetcher";
import {
  getCategoryBySlug,
  getFeaturedPosts,
  getFilters,
} from "@/lib/db-utils";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    q?: string;
    tags?: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  // Get category details for metadata
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    };
  }

  return {
    title: `${category.name} | Blog | Bogdan Mihalca`,
    description:
      category.description || `Articles in the ${category.name} category`,
  };
}

const POSTS_PER_PAGE = 1;

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const {
    page: pageParam,
    tags: tagParam,
    q: searchQuery,
  } = await searchParams;

  const page = pageParam ? parseInt(pageParam) : 1;

  const { tags } = await getFilters({
    category: slug,
  });

  const featuredPosts = await getFeaturedPosts();

  const category = await getCategoryBySlug(slug);
  if (!category) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-purple-950/20 pt-20">
      <div className="container mx-auto px-4">
        <div className="relative space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="relative">
              <GlitchText className="text-3xl">
                CATEGORY: {category.name.toUpperCase()}
              </GlitchText>
              <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-lg -z-10"></div>
            </div>
          </div>
          {category.description && (
            <p className="text-zinc-400">{category.description}</p>
          )}
          <DecoDivider className="relative" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <SuspenseCategoryPostsList
              category={slug}
              skip={(page - 1) * POSTS_PER_PAGE}
              tagFilter={tagParam ? tagParam.split(",").filter(Boolean) : []}
              postsPerPage={POSTS_PER_PAGE}
              searchQuery={searchQuery}
              currentPage={page}
            />
          </div>

          <div className="w-full lg:w-1/3 space-y-8 hidden lg:block">
            <BlogSidebar
              categories={[]}
              tags={tags}
              featuredPosts={featuredPosts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
