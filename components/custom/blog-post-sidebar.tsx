import { Tag, User } from "@prisma/client";
import { CyberBadge } from "./cyber-badge";
import Link from "next/link";
import { getMorePostsByAuthor } from "@/lib/db-actions/post-actions";
import { formatRelativeTime } from "@/lib/utils";
import Image from "next/image";
import { Eye, Heart } from "lucide-react";

interface BlogPostSidebarProps {
  author: User;
  tags: {
    tag: Tag;
  }[];
}

const BlogPostSidebar = async ({ author, tags }: BlogPostSidebarProps) => {
  const morePostsByAuthor = await getMorePostsByAuthor({ authorId: author.id });

  return (
    <div className="w-full lg:w-1/3 space-y-8 hidden lg:block">
      <div className="border border-zinc-800/50 rounded-lg bg-black/30 backdrop-blur-sm p-4 space-y-4 sticky top-24">
        <h2 className="text-lg font-bold text-neon-cyan">
          More from {author.name}
        </h2>

        <div className="space-y-3">
          {morePostsByAuthor.map((post, i) => (
            <div
              key={i}
              className="flex gap-2 group hover:bg-zinc-800/50 p-2 rounded-md transition-colors border-b-2 border-zinc-800/50 last:border-b-0"
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-md overflow-hidden flex-shrink-0">
                {post.mainImage && (
                  <Image
                    src={post.mainImage}
                    alt={post.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-300 group-hover:text-neon-cyan transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs text-zinc-500">
                  {formatRelativeTime(
                    new Date(post.publishedAt || ""),
                    new Date()
                  )}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-400">
                    {post.views} <Eye className="inline h-4 w-4 mr-1" />
                  </span>
                  <span className="text-xs text-zinc-400">|</span>
                  <span className="text-xs text-zinc-400">
                    {post.likes} <Heart className="inline h-4 w-4 mr-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-neon-pink mb-3">
            Related tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag }, i) => (
              <CyberBadge
                key={tag.id}
                variant={i % 2 === 0 ? "glitch" : "circuit"}
              >
                <Link href={`/blog?tags=${tag.slug}`}>{tag.name}</Link>
              </CyberBadge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { BlogPostSidebar };
