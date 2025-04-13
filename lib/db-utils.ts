'use server'

import { prisma } from "@/lib/prisma";

async function getFilters({
    category
}: {
    category?: string;
}) {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            _count: {
                select: {
                    posts: {
                        where: {
                            published: true,
                        },
                    },
                },
            },
        },
        where: {
            posts: {
                some: {
                    published: true,
                },
            },
        },
    });

    const tags = await prisma.tag.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            _count: {
                select: {
                    posts: {
                        where: {
                            post: {
                                published: true,
                                ...(category ? {
                                    category: {
                                        slug: category
                                    }
                                } : {})
                            },
                        },
                    },
                },
            },
        },
        where: {
            posts: {
                some: {
                    post: {
                        published: true,
                        ...(category ? {
                            category: {
                                slug: category
                            }
                        } : {})
                    },
                },
            },
        },
    });

    return {
        categories: categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            postCount: cat._count.posts,
        })),
        tags: tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            postCount: tag._count.posts,
        })),
    };
}

async function getFeaturedPosts() {
    const posts = await prisma.post.findMany({
        where: {
            published: true,
            featured: true,
        },
        take: 3,
        orderBy: {
            publishedAt: "desc",
        },
        include: {
            author: true,
            category: true,
            tags: {
                include: {
                    tag: true,

                },
            },
            _count: {
                select: {
                    views: true,

                },
            },
        },
    });
    if (!posts) return [];
    return posts.map((post) => ({
        id: post.id,
        title: post.title,
        shortDesc: post.shortDesc || "",
        slug: post.slug,
        publishedAt: post.publishedAt,
        authorName: post.author.name || "Unknown Author",
        authorImage: post.author.image || "/default-author.jpg",
        category: post.category?.name || "Uncategorized",
        tags: post.tags.map((t) => t.tag.name),
        mainImage: post.mainImage || "/default-post-image.jpg",
        createdAt: post.published ? (post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()) : new Date(post.createdAt).toISOString(),
        featured: post.featured,
        _count: {
            views: post._count.views || 0,
        }
    }));
}

async function getPosts({
    skip = 0,
    categoryFilter = [],
    tagFilter = [],
    POSTS_PER_PAGE = 10,
    searchQuery = "",
}: {

    searchQuery?: string;
    page?: number;
    take?: number;
    orderBy?: string;
    order?: string;
    search?: string;
    searchParams?: URLSearchParams;
    skip?: number;
    categoryFilter?: string[];
    tagFilter?: string[];
    searchFilter?: string;
    baseUrl?: string;
    POSTS_PER_PAGE?: number;
}) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
        published: true,
        ...(searchQuery
            ? {
                OR: [
                    { title: { contains: searchQuery, mode: "insensitive" } },
                    { shortDesc: { contains: searchQuery, mode: "insensitive" } },
                ],
            }
            : {}),
        ...(categoryFilter.length > 0
            ? {
                category: {
                    slug: { in: categoryFilter },
                },
            }
            : {}),
        ...(tagFilter.length > 0
            ? {
                tags: {
                    some: {
                        tag: {
                            slug: { in: tagFilter },
                        },
                    },
                },
            }
            : {}),
    };

    const posts = await prisma.post.findMany({
        where,
        skip,
        take: POSTS_PER_PAGE,
        orderBy: {
            publishedAt: "desc",
        },
        include: {
            author: true,
            category: true,
            tags: {
                include: {
                    tag: true,
                },
            },
            _count: {
                select: {
                    views: true,
                }
            },
        },
    })

    if (!posts) return {
        posts: [],
        totalPosts: 0,
        totalPages: 0,
    }
    return {

        posts: posts.map((post) => ({
            id: post.id,
            title: post.title,
            shortDesc: post.shortDesc || "",
            slug: post.slug,
            publishedAt: post.publishedAt,
            authorName: post.author.name || "Unknown Author",
            authorImage: post.author.image || "/default-author.jpg",
            category: post.category?.name || "Uncategorized",
            tags: post.tags.map((t) => t.tag.name),
            mainImage: post.mainImage || "/default-post-image.jpg",
            createdAt: post.published ? (post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()) : new Date(post.createdAt).toISOString(),
            featured: post.featured,
            _count: {
                views: post._count.views || 0,
            }
        })),
        totalPosts: await prisma.post.count({ where }),
        totalPages: Math.ceil(await prisma.post.count({ where }) / POSTS_PER_PAGE),

    };

}

async function getMorePostsByAuthor({ authorId, skip = 0, take = 3 }: { authorId: string, skip?: number, take?: number }) {
    const posts = await prisma.post.findMany({
        where: {
            authorId,
            published: true,
        },
        include: {
            _count: {
                select: {
                    likes: true,
                    views: true,

                },
            },
        },
        skip,
        take,
        orderBy: {
            publishedAt: "desc",
        },
    });
    if (!posts) return [];

    return posts.map((post) => ({
        id: post.id,
        title: post.title,
        shortDesc: post.shortDesc || "",
        slug: post.slug,
        publishedAt: post.publishedAt || post.createdAt,
        mainImage: post.mainImage || "/default-post-image.jpg",
        likes: post._count.likes || 0,
        views: post._count.views || 0,
    }));
}

async function getPostsByCategory({
    category,
    POSTS_PER_PAGE = 4,
    skip = 0,
    tagFilter = [],
    searchQuery = "",
}: {
    category: string;
    POSTS_PER_PAGE?: number;
    skip?: number;
    tagFilter?: string[];
    searchQuery?: string;
}) {
    const categoryData = await prisma.category.findUnique({
        where: {
            slug: category,
        },
        include: {
            posts: {
                where: {
                    published: true,
                    ...(searchQuery
                        ? {
                            OR: [
                                { title: { contains: searchQuery, mode: "insensitive" } },
                                { shortDesc: { contains: searchQuery, mode: "insensitive" } },
                            ],
                        }
                        : {}),
                    ...(tagFilter.length > 0
                        ? {
                            tags: {
                                some: {
                                    tag: {
                                        slug: { in: tagFilter },
                                    },
                                },
                            },
                        }
                        : {}),
                },
                skip,
                take: POSTS_PER_PAGE,
                orderBy: {
                    publishedAt: "desc",
                },
                include: {
                    author: true,
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: {
                            views: true,
                            likes: true,
                        }
                    }
                },
            },
            _count: {
                select: {
                    posts: {
                        where: { published: true },
                    },
                },

            },
        },
    });
    if (!categoryData) return {
        posts: [],
        totalPosts: 0,
        totalPages: 0,
    }


    const posts = categoryData.posts.map((post) => ({
        id: post.id,
        title: post.title,
        shortDesc: post.shortDesc || "",
        slug: post.slug,
        publishedAt: post.publishedAt,
        authorName: post.author.name || "Unknown Author",
        authorImage: post.author.image || "/default-author.jpg",
        category: categoryData.name,
        tags: post.tags.map((t) => t.tag.name),
        mainImage: post.mainImage || "/default-post-image.jpg",
        createdAt: post.published ? (post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()) : new Date(post.createdAt).toISOString(),
        featured: post.featured,
        _count: {
            views: post._count.views || 0,
            likes: post._count.likes || 0,
        }
    }));
    return {
        posts,
        totalPosts: categoryData._count.posts,
        totalPages: Math.ceil(categoryData._count.posts / POSTS_PER_PAGE),
    };

}


async function getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
        where: {
            slug,
        },
    });
    if (!category) return null;
    return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || "",
    };
}

async function getPostBySlug(slug: string) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                slug,
                published: true
            },
            include: {
                author: true,
                category: true,
                tags: {
                    include: {
                        tag: true
                    }
                },
                seo: true,
                comments: {
                    where: {
                        status: "APPROVED",
                        parentId: null
                    },
                    include: {
                        author: true,
                        replies: {
                            where: {
                                status: "APPROVED"
                            },
                            include: {
                                author: true,
                                _count: {
                                    select: {
                                        likes: true,
                                    }
                                }

                            }
                        },
                        _count: {
                            select: {
                                likes: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                _count: {
                    select: {
                        views: true,
                        likes: true,
                        comments: true
                    }
                }
            }
        });

        return post;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

async function createPostView(postId: number, { ip, userAgent }: { ip: string, userAgent: string }) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new Error("Post not found");
        }
        const existingView = await prisma.postView.findFirst({
            where: {
                postId,
                ipAddress: ip,
                userAgent,
            },
        });
        if (existingView) {
            return null;
        }
        const newView = await prisma.postView.create({
            data: {
                postId,
                ipAddress: ip,
                userAgent,
            },
        });

        return newView;
    } catch (error) {
        console.error("Error creating post view:", error);
        return null;
    }
}

async function togglePostLike(postId: number, userId: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const existingLike = await prisma.postLike.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                }
            },
        });

        if (existingLike) {
            await prisma.postLike.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId,
                    }
                },
            });


        } else {
            await prisma.postLike.create({
                data: {
                    postId,
                    userId,
                },
            });


        }
    } catch (error) {
        console.error("Error toggling post like:", error);
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

async function deleteComment(commentId: number, userId: string) {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (comment.authorId !== userId) {
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
        console.error("Error deleting comment:", error);
        throw error;
    }
}


async function incrementShareCount(postId: number) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        await prisma.post.update({
            where: { id: postId },
            data: {
                shareCount: {
                    increment: 1,
                },
            },
        });

        return { success: true, count: post.shareCount + 1 };
    } catch (error) {
        console.error("Error incrementing share count:", error);
        throw error;
    }
}

async function checkUserLikedPost(postId?: number, userId?: string) {
    try {
        if (!userId || !postId) {
            return false;
        }
        const like = await prisma.postLike.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                }
            },
        });

        return like !== null;
    } catch (error) {
        console.error("Error checking if user liked post:", error);
        return false;
    }
}


export {
    getMorePostsByAuthor,
    getFilters,
    getFeaturedPosts,
    getPosts,
    getPostsByCategory,
    getCategoryBySlug,
    getPostBySlug,
    createPostView,
    togglePostLike,
    toggleCommentLike,
    incrementShareCount,
    checkUserLikedPost,
    deleteComment,
    editComment,
    createComment
};