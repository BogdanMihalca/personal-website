"use server";

import { auth } from "@/auth";
import { BlogPostActions } from "@/components/custom/blog-post-actions";
import { BlogPostComments } from "@/components/custom/blog-post-comments";
import { BlogPostSidebar } from "@/components/custom/blog-post-sidebar";
import { CyberBadge } from "@/components/custom/cyber-badge";
import { CyberpunkButton } from "@/components/custom/cyber-button";
import { DecoDivider } from "@/components/custom/deco-divider";
import { SharePostButton } from "@/components/custom/share-post-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ContentRenderer } from "@/lib/content-renderer";
import {
  checkUserLikedPost,
  createPostView,
  getPostBySlug,
} from "@/lib/db-actions/post-actions";
import { formatRelativeTime, getRealIp, getRealUserAgent } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostDetailPageProps {
  params: any; //eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Blog",
      description:
        "The requested blog post could not be found. Return to our blog to discover other interesting articles.",
      robots: "noindex, nofollow",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://bogdanmihalca.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const title = post.seo?.metaTitle || post.title;
  const description =
    post.seo?.metaDesc ||
    post.shortDesc ||
    `Read about ${post.title} on our blog`;
  const ogTitle = post.seo?.ogTitle || title;
  const ogDescription = post.seo?.ogDesc || description;
  const ogImage =
    post.seo?.ogImage ||
    post.mainImage ||
    `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;
  const keywords =
    post.seo?.keywords || post.tags.map(({ tag }) => tag.name).join(", ");
  const canonicalUrl = post.seo?.canonicalUrl || postUrl;
  const publishedDate = post.publishedAt || post.createdAt;
  const modifiedDate = post.updatedAt;
  const authorName = post.author.name || "Blog Author";

  return {
    title,
    description,
    keywords,
    authors: [{ name: authorName, url: `${baseUrl}/author/${post.author.id}` }],
    creator: authorName,
    publisher: "Your Website Name",
    robots: post.status === "PUBLISHED" ? "index, follow" : "noindex, nofollow",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: postUrl,
      siteName: "Your Website Name",
      locale: "en_US",
      type: "article",
      publishedTime: publishedDate.toISOString(),
      modifiedTime: modifiedDate.toISOString(),
      section: post.category?.name || "Blog",
      tags: post.tags.map(({ tag }) => tag.name),
      authors: [authorName],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      creator: "@MBC0714",
      site: "@MBC0714",
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    other: {
      // Article specific meta tags
      "article:author": authorName,
      "article:published_time": publishedDate.toISOString(),
      "article:modified_time": modifiedDate.toISOString(),
      "article:section": post.category?.name || "Blog",
      "article:tag": post.tags.map(({ tag }) => tag.name).join(","),

      // Additional SEO meta tags
      "theme-color": "#000000",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "format-detection": "telephone=no",

      // Pinterest
      "pinterest-rich-pin": "true",

      // LinkedIn
      "linkedin:owner": "your-linkedin-company-id", // Replace with your LinkedIn company ID

      // Schema.org structured data (JSON-LD will be added in the component)
      "schema:type": "BlogPosting",
    },
  };
}

export default async function PostDetail({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const headersList = await headers();
  const ipAddress = await getRealIp(headersList, false);
  const userAgent = getRealUserAgent(headersList);

  // register a view for the post
  await createPostView(post.id, {
    ip: ipAddress as string,
    userAgent,
  });

  const publishDate = post.publishedAt || post.createdAt;
  const formattedDate = formatRelativeTime(new Date(publishDate), new Date());

  const currentUser = await auth();
  const isPostLiked = await checkUserLikedPost(post?.id, currentUser?.user?.id);
  const hasEditPermission = ["AUTHOR", "EDITOR", "ADMIN"].includes(
    currentUser?.user.role || ""
  );

  // Structured data for rich snippets
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://bogdanmihalca.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const ogImage =
    post.seo?.ogImage ||
    post.mainImage ||
    `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description:
      post.seo?.metaDesc || post.shortDesc || `Read about ${post.title}`,
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Person",
      name: post.author.name || "Blog Author",
      image: post.author.image,
      url: `${baseUrl}/author/${post.author.id}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Bogdan Mihalca",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 60,
      },
    },
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    url: postUrl,
    articleSection: post.category?.name || "Blog",
    keywords: post.tags.map(({ tag }) => tag.name),
    wordCount: post.content
      ? JSON.stringify(post.content).length / 5
      : undefined, // Rough word count estimate
    timeRequired: post.readingTime ? `PT${post.readingTime}M` : undefined,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: post._count.views,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post._count.likes,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post._count.comments,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="min-h-screen bg-transparent pt-20">
        <div className="container relative mx-auto px-4">
          <div className="flex items-center space-x-3 mb-6 text-sm">
            <Breadcrumb>
              <BreadcrumbList className="text-zinc-400">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                {post.category && (
                  <>
                    <BreadcrumbSeparator>
                      <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/blog/category/${post.category.slug}`}
                      >
                        {post.category.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>{" "}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-6 mb-8">
            <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold text-white leading-tight md:max-w-[80%]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-75" />
                  <Avatar>
                    <AvatarImage
                      src={post.author.image || ""}
                      alt={post.author.name || "Author"}
                    />
                    <AvatarFallback className="bg-black text-neon-pink font-mono">
                      {post.author.name
                        ?.split(" ")
                        .map((n) => n.charAt(0).toUpperCase())
                        .join("") || "A"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="font-medium text-zinc-200">
                    {post.author.name}
                  </div>
                  <div className="text-xs text-zinc-400">{formattedDate}</div>
                </div>
              </div>

              <span className="hidden md:inline text-zinc-500">|</span>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-zinc-400">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{post._count.views} views</span>
                </div>

                <div className="flex items-center text-zinc-400">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{post._count.likes} likes</span>
                </div>

                <div className="flex items-center text-zinc-400">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{post._count.comments} comments</span>
                </div>

                {post.readingTime && (
                  <div className="flex items-center text-zinc-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readingTime} min read</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }, i) => (
                <CyberBadge
                  key={tag.id}
                  variant={
                    ["default", "neon", "glitch", "circuit"][i % 4] as
                      | "default"
                      | "neon"
                      | "glitch"
                      | "circuit"
                  }
                  className="text-xs"
                >
                  <Link href={`/blog?tags=${tag.slug}`}>{tag.name}</Link>
                </CyberBadge>
              ))}
            </div>
            {hasEditPermission && (
              <div className="hidden md:flex absolute top-20 right-4  gap-2">
                {post.status === "PUBLISHED" && (
                  <SharePostButton
                    title={post.title}
                    content={post.shortDesc || post.title}
                    url={`${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "http://localhost:3000"
                    }/blog/${post.slug}`}
                    imageUrl={post.mainImage || undefined}
                    tags={post.tags.map(({ tag }) => tag.name)}
                  />
                )}
                <Link
                  href={`/blog/dashboard/edit/${post.id}`}
                  className="text-sm text-zinc-400 hover:text-zinc-200"
                >
                  <CyberpunkButton
                    icon={<Pencil />}
                    variant="secondary"
                    className="text-sm"
                    size="sm"
                  >
                    Edit Post
                  </CyberpunkButton>
                </Link>
              </div>
            )}

            <DecoDivider />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="space-y-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50 pointer-events-none" />

                {post.mainImage && (
                  <div className="aspect-video w-full relative mb-8 rounded-lg overflow-hidden border border-zinc-800/50">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                    <Image
                      src={post.mainImage}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      className="z-0"
                      priority
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <ContentRenderer content={post.content?.toString()} />
              </div>

              <div className="mt-12 flex justify-between items-center border-t border-zinc-800/50 pt-6">
                <Link href="/blog" className="flex items-center gap-2">
                  <CyberpunkButton icon={<ChevronLeft />} variant="primary">
                    Back to Blog
                  </CyberpunkButton>
                </Link>
                <BlogPostActions
                  postId={post.id}
                  hasLiked={isPostLiked}
                  sharesCount={post.shareCount}
                  likesCount={post._count.likes}
                  commentsCount={post._count.comments}
                />
              </div>

              <BlogPostComments postId={post.id} comments={post.comments} />
            </div>

            <BlogPostSidebar author={post.author} tags={post.tags} />
          </div>
        </div>
      </div>
    </>
  );
}
