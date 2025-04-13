import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Comment } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { CommentFormSkeleton, CommentSkeleton } from "./comment-skeleton";
import { GlitchText } from "./glitch-text";

interface BlogPostCommentsProps {
  postId: number;
  comments: any[]; // eslint-disable-line
  path?: string;
}

export async function BlogPostComments({
  postId,
  comments,
  path,
}: BlogPostCommentsProps) {
  console.log("BlogPostComments", { postId, comments, path });

  const session = await auth();

  // Extract all comment IDs including replies
  const commentIds = [
    ...comments.map((c) => c.id),
    ...comments.flatMap((c) => c.replies?.map((r: Comment) => r.id) || []),
  ];

  // Pre-compute liked status for each comment
  let likedCommentIds: number[] = [];

  if (session?.user?.id) {
    const likes = await prisma.commentLike.findMany({
      where: {
        userId: session.user.id,
        commentId: {
          in: commentIds,
        },
      },
      select: {
        commentId: true,
      },
    });

    likedCommentIds = likes.map((like) => like.commentId);
  }

  if (path) {
    revalidatePath(path);
  }

  return (
    <div className="mt-12 space-y-6 mb-8">
      <GlitchText className="text-xl">Comments ({comments.length})</GlitchText>

      {session?.user?.id ? (
        <div className="mb-8">
          <h3 className="text-zinc-300 mb-3">Leave a comment</h3>
          <Suspense fallback={<CommentFormSkeleton />}>
            <CommentForm postId={postId} userId={session.user.id} />
          </Suspense>
        </div>
      ) : (
        <div className="bg-black/30 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4 mb-8">
          <p className="text-zinc-400 text-center">
            Please sign in to leave a comment.
          </p>
        </div>
      )}

      {comments.length > 0 ? (
        <div className="space-y-4">
          <Suspense
            fallback={
              <>
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <CommentSkeleton key={i} />
                  ))}
              </>
            }
          >
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                session={session}
                postId={postId}
                likedCommentIds={likedCommentIds}
              />
            ))}
          </Suspense>
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed border-zinc-800/50 rounded-lg bg-black/30 backdrop-blur-sm">
          <p className="text-zinc-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}
