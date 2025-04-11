import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Clock, Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CyberBadge } from "./cyber-badge";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  shortDesc: string;
  mainImage: string;
  category: string;
  tags: string[];
  viewCount: number;
  featured: boolean;
  createdAt: string;
  authorName: string;
  authorImage: string;
}

export function BlogPostCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <Card className="group relative overflow-hidden border-[1px] border-zinc-800/50 bg-black/30 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/3 md:min-h-[220px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/90 via-black/50 to-transparent z-10" />
          <Image
            src={post.mainImage}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            height={192}
            width={384}
          />
          {post.featured && (
            <Badge className="absolute top-2 right-2 bg-purple-500/80 backdrop-blur-sm z-20 border-none shadow-lg shadow-purple-500/20">
              <Star className="h-3 w-3 mr-1" /> Featured
            </Badge>
          )}
        </div>

        <div className="relative p-4 space-y-3 md:w-2/3 md:flex md:flex-col">
          <div className="flex justify-between items-center">
            <Badge
              variant="outline"
              className="bg-zinc-900/50 border-zinc-700/50 text-zinc-400 hover:bg-purple-900/20"
            >
              {post.category}
            </Badge>
            <div className="flex items-center text-zinc-500 text-xs">
              <Eye className="h-3 w-3 mr-1" /> {post.viewCount.toLocaleString()}
            </div>
          </div>

          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-lg md:text-xl font-bold text-zinc-100 group-hover:text-purple-400 transition-colors relative">
              {post.title}
              <span className="absolute -inset-0.5 bg-purple-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </h3>
          </Link>

          <p className="text-zinc-400 text-sm md:text-base line-clamp-2 md:line-clamp-3">
            {post.shortDesc}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {post.tags.slice(0, featured ? 4 : 2).map((tag, i) => (
              <CyberBadge
                key={tag}
                delay={i}
                variant={
                  ["default", "neon", "holo", "circuit" as const][i % 4] as any //eslint-disable-line @typescript-eslint/no-explicit-any
                }
              >
                {tag}
              </CyberBadge>
            ))}
            {post.tags.length > (featured ? 4 : 2) && (
              <CyberBadge
                variant="default"
                className="bg-zinc-800/50 hover:bg-purple-900/30 border border-zinc-700/50 hover:border-purple-500/50 text-zinc-400"
              >
                +{post.tags.length - (featured ? 4 : 2)}
              </CyberBadge>
            )}
          </div>

          <div className="md:flex-grow"></div>

          <div className="flex justify-between items-center pt-3 border-t border-zinc-800/30 mt-auto">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-75" />
                <Avatar>
                  <AvatarImage src={post.authorImage} alt={post.authorName} />
                  <AvatarFallback className="bg-black text-neon-pink font-mono">
                    {post.authorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-zinc-400">{post.authorName}</span>
            </div>
            <div className="flex items-center text-xs text-zinc-500">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </div>
      </div>
    </Card>
  );
}

export function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group relative overflow-hidden border-l-2 border-l-purple-500 border border-zinc-800/50 bg-black/30 backdrop-blur-md hover:border-purple-500/50 transition-all duration-300">
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="bg-zinc-900/50 border-zinc-700/50 text-zinc-400 hover:bg-purple-900/20"
          >
            {post.category}
          </Badge>
          <Badge className="bg-purple-500/80 backdrop-blur-sm border-none shadow-lg shadow-purple-500/20">
            <Star className="h-3 w-3 mr-1" /> Featured
          </Badge>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="text-zinc-400 text-xs line-clamp-2">{post.shortDesc}</p>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/30">
          <span className="text-zinc-400">{post.authorName}</span>
          <div className="flex items-center text-zinc-500">
            <Eye className="h-3 w-3 mr-1" /> {post.viewCount.toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function CategoryCard({
  name,
  count,
  slug,
}: {
  name: string;
  count: number;
  slug: string;
}) {
  return (
    <div className="flex justify-between items-center p-2 border border-zinc-800/50 rounded-md bg-black/30 hover:border-purple-500/30 hover:bg-purple-900/10 transition-all duration-300 group">
      <Link href={`/categories/${slug}`}>
        <span className="text-zinc-300 group-hover:text-purple-400 transition-colors">
          {name}
        </span>
      </Link>
      <Badge className="bg-purple-900/50 text-purple-300">{count}</Badge>
    </div>
  );
}

export function TagChip({
  name,
  count,
  slug,
}: {
  name: string;
  count: number;
  slug: string;
}) {
  return (
    <Badge className="bg-zinc-800/70 hover:bg-purple-900/30 border border-zinc-700/50 hover:border-purple-500/50 text-zinc-400 hover:text-purple-300 transition-all duration-300 cursor-pointer py-1 px-2">
      <Link href={`/tags/${slug}`}>
        {name} <span className="ml-1 text-xs opacity-70">{count}</span>
      </Link>
    </Badge>
  );
}
