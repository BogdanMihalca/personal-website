import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db-actions/category-actions';
import { isAuthorized } from '@/lib/utils';

export async function GET(request: NextRequest) {
    try {
        if (!await isAuthorized(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { categories } = await getAllCategories({ returnAll: true });

        return NextResponse.json({
            categories: categories.map(category => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                image: category.image,
                postCount: category._count.posts
            }))
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories', details: (error as Error).message },
            { status: 500 }
        );
    }
}
