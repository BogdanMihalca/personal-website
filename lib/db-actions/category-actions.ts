'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug must contain only lowercase letters, numbers, and hyphens"
    }),
    description: z.string().max(200).optional().nullable(),
    image: z.string().url().optional().nullable().or(z.string().length(0))
})


async function createCategory(formData: FormData) {
    const validatedFields = categorySchema.safeParse({
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description') || null,
        image: formData.get('image') || null,
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create category.',
            success: false
        }
    }

    const { name, slug, description, image } = validatedFields.data

    try {
        await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
            },
        })

        revalidatePath('/blog/dashboard')
        return {
            success: true,
            message: 'Category created successfully.'
        }
    } catch {
        return {
            success: false,
            message: 'Database Error: Failed to create category.',
            errors: {
                _form: ['Database error. Please try again.']
            }
        }
    }
}

async function updateCategory(id: number, formData: FormData) {
    const validatedFields = categorySchema.safeParse({
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description') || null,
        image: formData.get('image') || null,
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to update category.',
            success: false
        }
    }

    const { name, slug, description, image } = validatedFields.data

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                image,
            },
        })

        revalidatePath('/blog/dashboard')
        return {
            success: true,
            message: 'Category updated successfully.'
        }
    } catch {
        return {
            success: false,
            message: 'Database Error: Failed to update category.',
            errors: {
                _form: ['Database error. Please try again.']
            }
        }
    }
}

async function deleteCategory(id: number) {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        })

        if (category?._count.posts && category._count.posts > 0) {
            return {
                success: false,
                message: 'Cannot delete a category that has posts assigned to it'
            }
        }

        await prisma.category.delete({
            where: { id },
        })

        revalidatePath('/blog/dashboard')
        return {
            success: true,
            message: 'Category deleted successfully'
        }
    } catch {
        return {
            success: false,
            message: 'Failed to delete category'
        }
    }
}

async function getAllCategories({
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
                        { description: { contains: searchQuery, mode: "insensitive" } },
                    ],
                }
                : {}),
        };

        // Get total count for pagination
        const totalCategories = await prisma.category.count({ where });

        // If returnAll is true, fetch all categories without pagination
        if (returnAll) {
            const categories = await prisma.category.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    image: true,
                    _count: {
                        select: {
                            posts: true,
                        },
                    },
                },
                orderBy: {
                    name: 'asc',
                },
            });

            return { categories, totalCategories };
        }

        // Get paginated categories
        const categories = await prisma.category.findMany({
            where,
            skip,
            take,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return { categories, totalCategories };
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
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

export {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryBySlug
}