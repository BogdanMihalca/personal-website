import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PostStatus } from '@prisma/client';
import { createPost } from '@/lib/db-actions/post-actions';
import { getCategoryBySlug } from '@/lib/db-actions/category-actions';
import { isAuthorized } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        if (!await isAuthorized(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        if (!body.title || !body.content || !body.slug) {
            return NextResponse.json(
                { error: 'Missing required fields: title, content, and slug are required' },
                { status: 400 }
            );
        }

        const existingPost = await prisma.post.findUnique({
            where: { slug: body.slug }
        });

        if (existingPost) {
            return NextResponse.json(
                { error: 'Slug already exists' },
                { status: 409 }
            );
        }

        const authorId = process.env.AUTOMATED_AUTHOR_ID || body.authorId;

        if (!authorId) {
            return NextResponse.json(
                { error: 'No author ID provided and no default configured' },
                { status: 400 }
            );
        }

        let categoryId = undefined;
        if (body.categorySlug) {
            const category = await getCategoryBySlug(body.categorySlug);
            if (category) {
                categoryId = category.id;
            }
        }

        let tagIds = [];
        if (body.tags && body.tags.length > 0) {
            if (typeof body.tags[0] === 'string') {
                for (const tagName of body.tags) {
                    const tag = await prisma.tag.upsert({
                        where: { name: tagName },
                        update: {},
                        create: {
                            name: tagName,
                            slug: tagName.toLowerCase().replace(/\s+/g, '-')
                        }
                    });
                    tagIds.push(tag.id);
                }
            } else {
                tagIds = body.tags;
            }
        }

        const post = await createPost({
            title: body.title,
            slug: body.slug,
            content: body.content,
            shortDesc: body.shortDesc,
            mainImage: body.mainImage,
            featured: body.featured || false,
            status: body.status || PostStatus.PUBLISHED,
            authorId,
            categoryId,
            tags: tagIds.length > 0 ? tagIds : undefined,
            seo: body.seo,
        });

        return NextResponse.json({
            success: true,
            message: 'Post created successfully',
            post: {
                id: post.id,
                title: post.title,
                slug: post.slug,
                published: post.published,
                publishedAt: post.publishedAt
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post', details: (error as Error).message },
            { status: 500 }
        );
    }
}
