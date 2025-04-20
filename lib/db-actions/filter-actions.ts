"use server";

import { prisma } from "../prisma";

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


export {
    getFilters,
};