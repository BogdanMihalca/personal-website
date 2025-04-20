'use server'

import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";


async function getDashboardPosts({
    authorId,
    skip = 0,
    take = 10,
    status,
    searchQuery = ""
}: {
    authorId?: string;
    skip?: number;
    take?: number;
    status?: PostStatus;
    searchQuery?: string;
}) {
    const where: Record<string, unknown> = {
        ...(authorId ? { authorId } : {}),
        ...(status ? { status } : {}),
        ...(searchQuery
            ? {
                OR: [
                    { title: { contains: searchQuery, mode: "insensitive" } },
                    { slug: { contains: searchQuery, mode: "insensitive" } },
                ],
            }
            : {}),
    };

    const posts = await prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            author: true,
            category: true,
            _count: {
                select: {
                    views: true,
                    likes: true,
                    comments: true,
                },
            },
        },
    });

    const totalPosts = await prisma.post.count({ where });

    return {
        posts,
        totalPosts,
    };
}

async function updatePostStatus(postId: number, status: PostStatus) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                status,
                published: status === "PUBLISHED",
                publishedAt: status === "PUBLISHED" ? new Date() : post.publishedAt,
            },
        });

        return updatedPost;
    } catch (error) {
        console.error("Error updating post status:", error);
        throw error;
    }
}

async function deletePost(postId: number) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        await prisma.$transaction([
            prisma.postSEO.deleteMany({ where: { postId } }),
            prisma.postView.deleteMany({ where: { postId } }),
            prisma.postLike.deleteMany({ where: { postId } }),
            prisma.comment.deleteMany({ where: { postId } }),
            prisma.tagsOnPosts.deleteMany({ where: { postId } }),
            prisma.post.delete({ where: { id: postId } }),
        ]);

        return { success: true };
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
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


async function createPost({
    title,
    slug,
    content,
    shortDesc,
    mainImage,
    featured,
    status,
    authorId,
    categoryId,
    tags,
    seo,
}: {
    title: string;
    slug: string;
    content: any; //eslint-disable-line @typescript-eslint/no-explicit-any
    shortDesc?: string;
    mainImage?: string;
    featured?: boolean;
    status?: PostStatus;
    authorId: string;
    categoryId?: number;
    tags?: number[];
    seo?: {
        metaTitle?: string;
        metaDesc?: string;
        ogTitle?: string;
        ogDesc?: string;
        ogImage?: string;
        keywords?: string;
        canonicalUrl?: string;
    };
}) {
    try {
        const existingPost = await prisma.post.findUnique({
            where: { slug },
        });

        if (existingPost) {
            throw new Error("Slug is already in use");
        }

        let readingTime = 0;
        if (content) {
            const contentString = JSON.stringify(content);
            const wordCount = contentString.split(/\s+/).length;
            readingTime = Math.ceil(wordCount / 200);
        }

        const isPublished = status === PostStatus.PUBLISHED;

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                shortDesc,
                mainImage,
                featured: featured || false,
                status: status || PostStatus.DRAFT,
                published: isPublished,
                publishedAt: isPublished ? new Date() : null,
                readingTime,
                authorId,
                categoryId,
            },
        });

        // Add tags if provided
        if (tags && tags.length > 0) {
            await Promise.all(
                tags.map((tagId) =>
                    prisma.tagsOnPosts.create({
                        data: {
                            postId: post.id,
                            tagId,
                        },
                    })
                )
            );
        }

        if (seo) {
            await prisma.postSEO.create({
                data: {
                    postId: post.id,
                    metaTitle: seo.metaTitle,
                    metaDesc: seo.metaDesc,
                    ogTitle: seo.ogTitle,
                    ogDesc: seo.ogDesc,
                    ogImage: seo.ogImage,
                    keywords: seo.keywords,
                    canonicalUrl: seo.canonicalUrl,
                },
            });
        }

        return post;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

async function getPostById(postId: number) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                author: true,
                category: true,
                tags: {
                    select: {
                        tagId: true,
                        tag: true
                    }
                },
                seo: true
            }
        });

        return post;
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        throw error;
    }
}

async function updatePost({
    id,
    title,
    slug,
    content,
    shortDesc,
    mainImage,
    featured,
    status,
    categoryId,
    tags
}: {
    id: number;
    title: string;
    slug: string;
    content: string;
    shortDesc?: string;
    mainImage?: string;
    featured: boolean;
    status: PostStatus;
    authorId: string;
    categoryId?: number;
    tags?: number[];
}) {
    try {
        // Check if slug is already in use by another post
        const existingPost = await prisma.post.findFirst({
            where: {
                slug,
                id: { not: id }
            }
        });

        if (existingPost) {
            throw new Error("Slug is already in use");
        }

        // Calculate reading time
        let readingTime = 0;
        if (content) {
            const contentString = content;
            const wordCount = contentString.split(/\s+/).length;
            readingTime = Math.ceil(wordCount / 200);
        }

        // Get the current post to check publish status
        const currentPost = await prisma.post.findUnique({
            where: { id }
        });

        // Update the post
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content: content ? JSON.parse(content) : undefined,
                shortDesc,
                mainImage,
                featured,
                status,
                readingTime,
                published: status === PostStatus.PUBLISHED,
                publishedAt: status === PostStatus.PUBLISHED && !currentPost?.publishedAt ? new Date() : currentPost?.publishedAt,
                categoryId,
                tags: tags ? {
                    deleteMany: {},
                    create: tags.map(tagId => ({
                        tag: {
                            connect: { id: tagId }
                        }
                    }))
                } : undefined
            },
        });

        return updatedPost;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

export {
    getDashboardPosts,
    updatePostStatus,
    deletePost,
    getFeaturedPosts,
    getPosts,
    getMorePostsByAuthor,
    getPostsByCategory,
    getPostBySlug,
    createPostView,
    togglePostLike,
    checkUserLikedPost,
    incrementShareCount,
    createPost,
    getPostById,
    updatePost
}