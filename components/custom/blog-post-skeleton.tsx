import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
  return (
    <Card className="group relative overflow-hidden border-[1px] border-zinc-800/50 bg-black/30 backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-in-out" />

      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/3 md:min-h-[220px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/90 via-black/50 to-transparent z-10" />
          <Skeleton className="w-full h-full bg-gray-900/50 animate-pulse" />
        </div>

        <div className="relative p-4 space-y-3 md:w-2/3 md:flex md:flex-col">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24 bg-neon-cyan/10" />
            <Skeleton className="h-4 w-16" />
          </div>

          <Skeleton className="h-7 w-full max-w-[90%]" />

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[70%]" />

          <div className="flex flex-wrap gap-1.5 pt-2">
            <Skeleton className="h-5 w-16 rounded-md bg-neon-pink/10" />
            <Skeleton className="h-5 w-20 rounded-md bg-neon-cyan/10" />
            <Skeleton className="h-5 w-14 rounded-md bg-purple-900/30" />
          </div>

          <div className="md:flex-grow"></div>

          <div className="flex justify-between items-center pt-3 border-t border-zinc-800/30 mt-auto">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full bg-gradient-to-r from-neon-cyan/20 to-purple-900/20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
            </div>
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
