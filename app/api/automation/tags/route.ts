import { NextRequest, NextResponse } from 'next/server';
import { getAllTags } from '@/lib/db-actions/tag-actions';
import { isAuthorized } from '@/lib/utils';

export async function GET(request: NextRequest) {
    try {
        if (!await isAuthorized(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { tags } = await getAllTags({ returnAll: true });

        return NextResponse.json({
            tags: tags.map(tag => ({
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
                postCount: tag._count.posts
            }))
        });

    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tags', details: (error as Error).message },
            { status: 500 }
        );
    }
}
