import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
  return (
    <Card className="overflow-hidden border-[1px] border-zinc-800/50 bg-black/30 backdrop-blur-md">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/3 md:min-h-[220px] overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="relative p-4 space-y-3 md:w-2/3 md:flex md:flex-col">
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
            <Skeleton className="h-5 w-14" />
          </div>

          <div className="md:flex-grow"></div>

          <div className="flex justify-between items-center pt-3 border-t border-zinc-800/30 mt-auto">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function BlogPostSkeletonList() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <BlogPostSkeleton key={i} />
      ))}
    </div>
  );
}
