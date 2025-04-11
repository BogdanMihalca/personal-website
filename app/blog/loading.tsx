import { BlogPostSkeletonList } from "@/components/custom/blog-post-skeleton";
import { DecoDivider } from "@/components/custom/deco-divider";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-purple-950/20 pt-20">
      <div className="container mx-auto px-4">
        <div className="relative space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Skeleton className="h-10 w-48" />
              <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-lg -z-10"></div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-5 w-2/3" />
          <DecoDivider className="relative" />
        </div>

        <div className="mb-12">
          <div className="border-l-2 border-purple-500/50 pl-4 mb-6">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="relative">
                <Card className="overflow-hidden border-[1px] border-zinc-800/50 bg-black/30 backdrop-blur-md">
                  <div className="relative h-48 overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="relative p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-7 w-full max-w-[90%]" />

                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[85%]" />

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>

                    <div className="flex items-center space-x-2 pt-3 border-t border-zinc-800/30">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="border-l-2 border-purple-500/50 pl-4 mb-6">
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="space-y-6 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50 pointer-events-none" />
              <BlogPostSkeletonList />
            </div>{" "}
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
          </div>
        </div>
      </div>
    </div>
  );
}
