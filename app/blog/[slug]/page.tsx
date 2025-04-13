"use server";

import { auth } from "@/auth";
import { BlogPostActions } from "@/components/custom/blog-post-actions";
import { BlogPostComments } from "@/components/custom/blog-post-comments";
import { BlogPostSidebar } from "@/components/custom/blog-post-sidebar";
import { CyberBadge } from "@/components/custom/cyber-badge";
import { CyberpunkButton } from "@/components/custom/cyber-button";
import { DecoDivider } from "@/components/custom/deco-divider";
import { GlitchText } from "@/components/custom/glitch-text";
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
} from "@/lib/db-utils";
import { formatRelativeTime, getRealIp, getRealUserAgent } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found",
    };
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDesc || post.shortDesc,
    openGraph: {
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDesc || post.shortDesc || "",
      images: post.seo?.ogImage
        ? [post.seo.ogImage]
        : post.mainImage
        ? [post.mainImage]
        : [],
      type: "article",
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

  return (
    <div className="min-h-screen bg-transparent pt-20">
      <div className="container mx-auto px-4">
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
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
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
              <GlitchText className="text-xl">{post.title}</GlitchText>
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
  );
}
