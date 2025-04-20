import { BlogPostSkeletonList } from "@/components/custom/blog-post-skeleton";
import { DecoDivider } from "@/components/custom/deco-divider";
import { Skeleton } from "@/components/ui/skeleton";
import { SideDisplay } from "@/components/custom/side-display";
import { Filter } from "lucide-react";

export default function BlogLoading() {
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
        <div className="p-4 space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
          <Skeleton className="h-7 w-32 mt-6" />
          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
        </div>
      </SideDisplay>
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-purple-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="relative space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Skeleton className="h-10 w-48" />
                <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-lg -z-10"></div>
              </div>
            </div>
            <DecoDivider className="relative" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 space-y-8">
              <div className="space-y-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50 pointer-events-none" />
                <BlogPostSkeletonList />
              </div>
              <div className="relative py-4">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 blur-lg opacity-50" />
                <div className="flex justify-center gap-2 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10" />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/3 space-y-8 hidden lg:block">
              <div className="border border-zinc-800/50 rounded-lg bg-black/30 backdrop-blur-sm p-4 space-y-4">
                <Skeleton className="h-7 w-40" />

                <div className="space-y-3 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Skeleton className="h-16 w-16" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>

                <Skeleton className="h-7 w-32 mt-6" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
