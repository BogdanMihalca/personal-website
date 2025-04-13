/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { formatRelativeTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CommentForm } from "./comment-form";
import { CommentActions } from "./comment-actions";
import { motion } from "framer-motion";

interface CommentItemProps {
  comment: any;
  session: any | null;
  postId: number;
  likedCommentIds?: number[];
}

export function CommentItem({
  comment,
  session,
  likedCommentIds = [],
  postId,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState<boolean | number>(false);
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="border border-zinc-500/50 rounded-lg p-4 bg-black/30 backdrop-blur-sm">
      <div className="flex items-start space-x-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="border-2 border-cyan-700 rounded-full p-0.5 shadow-[0_0_10px_rgba(6,182,212,0.5)] cursor-pointer"
        >
          <Avatar>
            <AvatarImage
              src={comment.author.image || ""}
              alt={comment.author.name || "Commenter"}
            />
            <AvatarFallback className="bg-black text-neon-cyan font-mono">
              {comment.author.name
                ?.split(" ")
                .map((n: string) => n.charAt(0).toUpperCase())
                .join("") || "A"}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="space-y-1 flex-1">
          <div className="flex justify-between">
            <span className="font-medium text-zinc-200">
              {comment.author.name}
            </span>
            <span className="text-xs text-zinc-500">
              {formatRelativeTime(new Date(comment.createdAt), new Date())}
            </span>
          </div>

          {isEditing === comment.id ? (
            <CommentForm
              postId={postId}
              userId={session.user.id}
              initialContent={comment.content}
              commentId={comment.id}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-zinc-300 text-sm">{comment.content}</p>
          )}

          {!isEditing && (
            <CommentActions
              comment={comment}
              session={session}
              onEditClick={() => setIsEditing(comment.id)}
              onReplyClick={() => setIsReplying(true)}
              initialLikeState={likedCommentIds.includes(comment.id)}
              initialLikeCount={comment._count.likes}
            />
          )}

          {isReplying && session && (
            <div className="mt-4 ml-4 border-l-2 border-zinc-700 pl-4">
              <p className="text-xs text-zinc-400 mb-2">
                Replying to {comment.author.name}
              </p>
              <CommentForm
                postId={postId}
                userId={session.user.id}
                parentId={comment.id}
                onCancel={() => setIsReplying(false)}
                onSuccess={() => setIsReplying(false)}
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l border-zinc-800 space-y-4">
              {comment.replies.map((reply: any) => {
                const isLikedByUser = likedCommentIds.includes(reply.id);

                return (
                  <div key={reply.id} className="flex items-start space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="border-2 border-cyan-700 rounded-full p-0.5 shadow-[0_0_10px_rgba(6,182,212,0.5)] cursor-pointer"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={reply.author.image || ""}
                          alt={reply.author.name || "Replier"}
                        />
                        <AvatarFallback className="bg-black text-neon-pink font-mono text-xs">
                          {reply.author.name
                            ?.split(" ")
                            .map((n: string) => n.charAt(0).toUpperCase())
                            .join("") || "A"}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-zinc-300 text-sm">
                          {reply.author.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {formatRelativeTime(
                            new Date(reply.createdAt),
                            new Date()
                          )}
                        </span>
                      </div>
                      {isEditing === reply.id ? (
                        <CommentForm
                          postId={postId}
                          userId={session.user.id}
                          initialContent={reply.content}
                          commentId={reply.id}
                          onCancel={() => setIsEditing(false)}
                          onSuccess={() => setIsEditing(false)}
                        />
                      ) : (
                        <>
                          <p className="text-zinc-400 text-sm">
                            {reply.content}
                          </p>

                          <CommentActions
                            comment={reply}
                            session={session}
                            onEditClick={() =>
                              session?.user?.id === reply.authorId
                                ? setIsEditing(reply.id)
                                : null
                            }
                            initialLikeState={isLikedByUser}
                            initialLikeCount={reply._count?.likes || 0}
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
