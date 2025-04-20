"use server";

import { prisma } from "../prisma";
import { SEOData } from "@/components/custom/seo-form";


export async function getSEODataByPostId(postId: number) {
    try {
        const seoData = await prisma.postSEO.findUnique({
            where: { postId },
        });

        return {
            metaTitle: seoData?.metaTitle || "",
            metaDesc: seoData?.metaDesc || "",
            ogTitle: seoData?.ogTitle || "",
            ogDesc: seoData?.ogDesc || "",
            ogImage: seoData?.ogImage || "",
            keywords: seoData?.keywords || "",
            canonicalUrl: seoData?.canonicalUrl || "",
        };
    } catch (error) {
        console.error("Database error when fetching SEO data:", error);
        throw new Error("Failed to fetch SEO data");
    }
}

export async function upsertSEOData(postId: number, seoData: SEOData) {
    try {
        const result = await prisma.postSEO.upsert({
            where: { postId },
            update: {
                metaTitle: seoData.metaTitle || null,
                metaDesc: seoData.metaDesc || null,
                ogTitle: seoData.ogTitle || null,
                ogDesc: seoData.ogDesc || null,
                ogImage: seoData.ogImage || null,
                keywords: seoData.keywords || null,
                canonicalUrl: seoData.canonicalUrl || null,
            },
            create: {
                postId,
                metaTitle: seoData.metaTitle || null,
                metaDesc: seoData.metaDesc || null,
                ogTitle: seoData.ogTitle || null,
                ogDesc: seoData.ogDesc || null,
                ogImage: seoData.ogImage || null,
                keywords: seoData.keywords || null,
                canonicalUrl: seoData.canonicalUrl || null,
            },
        });

        return result;
    } catch (error) {
        console.error("Database error when saving SEO data:", error);
        throw new Error("Failed to save SEO data");
    }
}
