import { DecoDivider } from "@/components/custom/deco-divider";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-purple-950/20 pt-20">
      <div className="container mx-auto px-4">
        <div className="space-y-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="h-5 w-24" />
            <span className="text-zinc-500">
              <ChevronRight />
            </span>
            <Skeleton className="h-5 w-32" />
          </div>

          <Skeleton className="h-12 w-3/4 max-w-2xl" />

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>

            <span className="text-zinc-500">|</span>

            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>

          <DecoDivider />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="w-full lg:w-2/3">
            <div className="space-y-6 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50 pointer-events-none" />

              <div className="aspect-video w-full relative mb-8">
                <Skeleton className="h-full w-full" />
              </div>

              <div className="space-y-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />

                <div className="py-4">
                  <Skeleton className="h-8 w-48" />
                </div>

                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-11/12" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />

                <div className="py-4">
                  <Skeleton className="h-8 w-48" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            </div>

            {/* Actions section */}
            <div className="mt-12 flex justify-between items-center border-t border-zinc-800/50 pt-6">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <Skeleton className="h-8 w-48" />

              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-zinc-800/50 rounded-lg p-4 bg-black/30"
                  >
                    <div className="flex items-start space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-11/12" />
                          <Skeleton className="h-4 w-4/5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 space-y-8 hidden lg:block">
            <div className="border border-zinc-800/50 rounded-lg bg-black/30 backdrop-blur-sm p-4 space-y-4 sticky top-24">
              <Skeleton className="h-7 w-40" />

              <div className="space-y-3">
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

              <div className="mt-6">
                <Skeleton className="h-7 w-32" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
