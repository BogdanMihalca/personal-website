"use server"

import { CommentStatus } from "@prisma/client";
import { prisma } from "../prisma";

async function getAllComments() {
    try {
        const comments = await prisma.comment.findMany({
            select: {
                id: true,
                content: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                authorId: true,
                postId: true,
                parentId: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        replies: {
                            where: {
                                parentId: {
                                    not: null,
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return comments;
    } catch (error) {
        console.error("Error getting all comments:", error);
        throw error;
    }
}

export async function updateCommentStatus(commentId: number, status: CommentStatus) {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            throw new Error("Comment not found");
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                status,
            },
        });

        return updatedComment;
    } catch (error) {
        console.error(`Error updating comment status to ${status}:`, error);
        throw error;
    }
}

async function deleteComment(commentId: number) {
    try {
        const deletedComment = await prisma.comment.delete({
            where: { id: commentId },
        });

        // delete all likes and replies associated with the comment
        await prisma.commentLike.deleteMany({
            where: { commentId },
        });
        await prisma.comment.deleteMany({
            where: { parentId: commentId },
        });


        return deletedComment;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

async function toggleCommentLike(commentId: number, userId: string) {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            throw new Error("Comment not found");
        }

        const existingLike = await prisma.commentLike.findUnique({
            where: {
                commentId_userId: {
                    commentId,
                    userId,
                }
            },
        });

        if (existingLike) {
            await prisma.commentLike.delete({
                where: {
                    commentId_userId: {
                        commentId,
                        userId,
                    }
                },
            });

            return { action: "unliked" };

        } else {
            await prisma.commentLike.create({
                data: {
                    commentId,
                    userId,
                },
            });

            return { action: "liked" };
        }
    } catch (error) {
        console.error("Error toggling comment like:", error);
        throw error;
    }
}

async function createComment(formData: FormData) {
    const content = formData.get("content") as string;
    const postId = Number(formData.get("postId"));
    const parentIdValue = formData.get("parentId");
    const userId = formData.get("userId") as string;

    // Only parse parentId if it exists and is a valid number
    const parentId = parentIdValue ? Number(parentIdValue) : null;

    if (!content || !postId || !userId) {
        throw new Error("Missing required fields");
    }
    if (content.length < 1 || content.length > 500) {
        throw new Error("Comment content must be between 1 and 500 characters");
    }
    if (parentId && isNaN(parentId)) {
        throw new Error("Invalid parent comment ID");
    }
    if (isNaN(postId)) {
        throw new Error("Invalid post ID");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
            });

            if (!parentComment) {
                throw new Error("Parent comment not found");
            }
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: userId,
                parentId: parentId, // This will be null if no parentId was provided
                status: "APPROVED", // Auto-approve for now, in production you might want "PENDING"
            },
            include: {
                author: true,
                _count: {
                    select: {
                        likes: true,
                    },
                },
            },
        });

        return newComment;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

async function editComment(formData: FormData) {
    const content = formData.get("content") as string;
    const commentId = Number(formData.get("commentId"));
    const userId = formData.get("userId") as string;
    if (!content || !commentId || !userId) {
        throw new Error("Missing required fields");
    }
    if (content.length < 1 || content.length > 500) {
        throw new Error("Comment content must be between 1 and 500 characters");
    }
    if (isNaN(commentId)) {
        throw new Error("Invalid comment ID");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    if (content.length < 1 || content.length > 500) {
        throw new Error("Comment content must be between 1 and 500 characters");
    }
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (comment.authorId !== userId) {
            throw new Error("You are not authorized to edit this comment");
        }
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                content,
            },
        });
        return updatedComment;
    } catch (error) {
        console.error("Error editing comment:", error);
        throw error;
    }
}


async function deleteCommentByAuthor(commentId: number, authorId: string) {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (comment.authorId !== authorId) {
            throw new Error("You are not authorized to delete this comment");
        }
        // if comment has likes delete them
        await prisma.commentLike.deleteMany({
            where: {
                commentId,
            },
        });
        // if comment has replies delete them
        await prisma.comment.deleteMany({
            where: {
                parentId: commentId,
            },
        });
        // delete the comment
        await prisma.comment.delete({
            where: { id: commentId },
        });
        return { success: true };

    } catch (error) {
        console.error("Error deleting comment by author:", error);
        throw error;
    }
}



export {
    getAllComments,
    deleteComment,
    toggleCommentLike,
    createComment,
    editComment,
    deleteCommentByAuthor,
};