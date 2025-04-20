import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";


export async function getBlogSummaryStats() {
    const [
        totalPosts,
        totalPublishedPosts,
        totalScheduledPosts,
        totalArchivedPosts,
        totalDrafts,
        totalViews,
        totalLikes,
        totalComments,
    ] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({
            where: { status: PostStatus.PUBLISHED },
        }),
        prisma.post.count({
            where: { status: PostStatus.SCHEDULED },
        }),
        prisma.post.count({
            where: { status: PostStatus.ARCHIVED },
        }),
        prisma.post.count({
            where: { status: PostStatus.DRAFT },
        }),
        prisma.postView.count(),
        prisma.postLike.count(),
        prisma.comment.count(),
    ]);

    return {
        totalPosts,
        totalPublishedPosts,
        totalScheduledPosts,
        totalArchivedPosts,
        totalDrafts,
        totalViews,
        totalLikes,
        totalComments,
    };
}


export async function getAuthorStats(authorId: string) {
    const [authorPosts, authorViews, authorLikes, authorComments] =
        await Promise.all([
            prisma.post.count({
                where: { authorId },
            }),
            prisma.postView.count({
                where: {
                    post: {
                        authorId,
                    },
                },
            }),
            prisma.postLike.count({
                where: {
                    post: {
                        authorId,
                    },
                },
            }),
            prisma.comment.count({
                where: {
                    post: {
                        authorId,
                    },
                },
            }),
        ]);

    return {
        authorPosts,
        authorViews,
        authorLikes,
        authorComments,
    };
}


export async function getMostViewedPosts(limit = 5) {
    return prisma.post.findMany({
        where: {
            status: PostStatus.PUBLISHED,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            _count: {
                select: {
                    views: true,
                },
            },
        },
        orderBy: {
            views: {
                _count: "desc",
            },
        },
        take: limit,
    });
}


export async function getMostLikedPosts(limit = 5) {
    return prisma.post.findMany({
        where: {
            status: PostStatus.PUBLISHED,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            _count: {
                select: {
                    likes: true,
                },
            },
        },
        orderBy: {
            likes: {
                _count: "desc",
            },
        },
        take: limit,
    });
}

export async function getMostCommentedPosts(limit = 5) {
    return prisma.post.findMany({
        where: {
            status: PostStatus.PUBLISHED,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            _count: {
                select: {
                    comments: true,
                },
            },
        },
        orderBy: {
            comments: {
                _count: "desc",
            },
        },
        take: limit,
    });
}


export async function getViewsOverTime(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const views = await prisma.postView.groupBy({
        by: ["createdAt"],
        _count: {
            id: true,
        },
        where: {
            createdAt: {
                gte: startDate,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return views.map(view => ({
        date: view.createdAt.toISOString().split('T')[0],
        views: view._count.id,
    }));
}


export async function getCategoryStats() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    posts: true,
                },
            },
        },
    });

    return categories.map(category => ({
        name: category.name,
        posts: category._count.posts,
    }));
}


export async function getTagStats(limit = 10) {
    const tags = await prisma.tag.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    posts: true,
                },
            },
        },
        orderBy: {
            posts: {
                _count: "desc",
            },
        },
        take: limit,
    });

    return tags.map(tag => ({
        name: tag.name,
        posts: tag._count.posts,
    }));
}


export async function getCommentStats() {
    const commentsByStatus = await prisma.comment.groupBy({
        by: ["status"],
        _count: {
            id: true,
        },
    });

    return commentsByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
    }));
}


export async function getReferralStats(limit = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - limit);

    const referrals = await prisma.postView.groupBy({
        by: ["referrer"],
        _count: {
            id: true,
        },
        where: {
            createdAt: {
                gte: startDate,
            },
            referrer: {
                not: null,
            },
        },
        orderBy: {
            _count: {
                id: 'desc',
            },
        },
        take: 10,
    });

    return referrals.map(ref => {
        const referrer = ref.referrer || "direct";
        let source = "Other";

        if (referrer.includes("google") || referrer.includes("bing") ||
            referrer.includes("yahoo") || referrer.includes("duckduckgo")) {
            source = "Search";
        } else if (referrer.includes("twitter") || referrer.includes("facebook") ||
            referrer.includes("instagram") || referrer.includes("linkedin") ||
            referrer.includes("reddit") || referrer.includes("t.co")) {
            source = "Social";
        } else if (!referrer || referrer === "direct") {
            source = "Direct";
        }

        return {
            source: source,
            count: ref._count.id,
        };
    });
}

/**
 * Gets growth statistics by comparing current period with previous period
 */
export async function getGrowthStats(days = 30) {
    const currentEndDate = new Date();
    const currentStartDate = new Date();
    currentStartDate.setDate(currentStartDate.getDate() - days);

    const previousStartDate = new Date(currentStartDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    // Get stats for current period
    const [currentViews, currentLikes, currentComments] = await Promise.all([
        prisma.postView.count({
            where: {
                createdAt: {
                    gte: currentStartDate,
                    lt: currentEndDate,
                },
            },
        }),
        prisma.postLike.count({
            where: {
                createdAt: {
                    gte: currentStartDate,
                    lt: currentEndDate,
                },
            },
        }),
        prisma.comment.count({
            where: {
                createdAt: {
                    gte: currentStartDate,
                    lt: currentEndDate,
                },
            },
        }),
    ]);

    // Get stats for previous period
    const [previousViews, previousLikes, previousComments] = await Promise.all([
        prisma.postView.count({
            where: {
                createdAt: {
                    gte: previousStartDate,
                    lt: currentStartDate,
                },
            },
        }),
        prisma.postLike.count({
            where: {
                createdAt: {
                    gte: previousStartDate,
                    lt: currentStartDate,
                },
            },
        }),
        prisma.comment.count({
            where: {
                createdAt: {
                    gte: previousStartDate,
                    lt: currentStartDate,
                },
            },
        }),
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    return {
        views: {
            current: currentViews,
            previous: previousViews,
            growth: calculateGrowth(currentViews, previousViews),
        },
        likes: {
            current: currentLikes,
            previous: previousLikes,
            growth: calculateGrowth(currentLikes, previousLikes),
        },
        comments: {
            current: currentComments,
            previous: previousComments,
            growth: calculateGrowth(currentComments, previousComments),
        },
    };
}
