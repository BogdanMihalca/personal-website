'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const tagSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(30),
    slug: z.string().min(2).max(30).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug must contain only lowercase letters, numbers, and hyphens"
    })
})

import { TagFormState } from "@/lib/types/form-types"

export async function createTag(prevState: TagFormState, formData: FormData) {
    const validatedFields = tagSchema.safeParse({
        name: formData.get('name'),
        slug: formData.get('slug'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create tag.',
            success: false
        }
    }

    const { name, slug } = validatedFields.data

    try {
        await prisma.tag.create({
            data: {
                name,
                slug,
            },
        })

        revalidatePath('/blog/dashboard')
        return {
            success: true,
            message: 'Tag created successfully.'
        }
    } catch {
        return {
            success: false,
            message: 'Database Error: Failed to create tag.',
            errors: {
                _form: ['Database error. Please try again.']
            }
        }
    }
}

export async function updateTag(id: number, prevState: TagFormState, formData: FormData) {
    const validatedFields = tagSchema.safeParse({
        name: formData.get('name'),
        slug: formData.get('slug'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to update tag.',
            success: false
        }
    }

    const { name, slug } = validatedFields.data

    try {
        await prisma.tag.update({
            where: { id },
            data: {
                name,
                slug,
            },
        })

        revalidatePath('/blog/dashboard')
        return {
            success: true,
            message: 'Tag updated successfully.'
        }
    } catch {
        return {
            success: false,
            message: 'Database Error: Failed to update tag.',
            errors: {
                _form: ['Database error. Please try again.']
            }
        }
    }
}

export async function deleteTag(id: number) {
    try {
        const tag = await prisma.tag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        })

        if (tag?._count.posts && tag._count.posts > 0) {
            return {
                success: false,
                message: 'Cannot delete a tag that is used by posts'
            }
        }

        await prisma.tag.delete({
            where: { id },
        })

        revalidatePath('/blog/dashboard')
        return {
            success: true,
            message: 'Tag deleted successfully'
        }
    } catch {
        return {
            success: false,
            message: 'Failed to delete tag'
        }
    }
}

export async function getAllTags({
    skip = 0,
    take = 10,
    searchQuery = "",
    returnAll = false,
}: {
    skip?: number;
    take?: number;
    searchQuery?: string;
    returnAll?: boolean;
} = {}) {
    try {
        // Build the where clause based on filters
        const where: Record<string, unknown> = {
            ...(searchQuery
                ? {
                    OR: [
                        { name: { contains: searchQuery, mode: "insensitive" } },
                        { slug: { contains: searchQuery, mode: "insensitive" } },
                    ],
                }
                : {}),
        };

        // Get total count for pagination
        const totalTags = await prisma.tag.count({ where });

        // If returnAll is true, return all tags without pagination
        if (returnAll) {
            const allTags = await prisma.tag.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            posts: true,
                        },
                    },
                },
                orderBy: {
                    name: 'asc',
                },
            })

            return { tags: allTags, totalTags }
        }

        // Get paginated tags
        const tags = await prisma.tag.findMany({
            where,
            skip,
            take,
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return { tags, totalTags }
    } catch (error) {
        console.error('Error fetching tags:', error)
        throw error
    }
}
