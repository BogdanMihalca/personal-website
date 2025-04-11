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
        viewCount: post.viewCount,
        mainImage: post.mainImage || "/default-post-image.jpg",
        createdAt: post.published ? (post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()) : new Date(post.createdAt).toISOString(),
        featured: post.featured,
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
            viewCount: post.viewCount,
            mainImage: post.mainImage || "/default-post-image.jpg",
            createdAt: post.published ? (post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()) : new Date(post.createdAt).toISOString(),
            featured: post.featured,
        })),
        totalPosts: await prisma.post.count({ where }),
        totalPages: Math.ceil(await prisma.post.count({ where }) / POSTS_PER_PAGE),

    };

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
        viewCount: post.viewCount,
        mainImage: post.mainImage || "/default-post-image.jpg",
        createdAt: post.published ? (post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()) : new Date(post.createdAt).toISOString(),
        featured: post.featured,
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

export { getFilters, getFeaturedPosts, getPosts, getPostsByCategory, getCategoryBySlug };