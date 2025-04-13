import { Skeleton } from "../ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div className="border border-zinc-800/50 rounded-lg p-4 bg-black/30 backdrop-blur-sm animate-pulse">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentFormSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      <Skeleton className="h-20 w-full" />
      <div className="flex justify-end">
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
};

export { CommentSkeleton, CommentFormSkeleton };
