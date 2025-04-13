"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Autoplay from "embla-carousel-autoplay";
import { FolderOpen, Search, Tag, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FeaturedPostCard } from "./blog-post-card";
import { CyberBadge } from "./cyber-badge";

interface FilterCategory {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

interface FilterTag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

interface BlogSidebarProps {
  categories: FilterCategory[];
  tags: FilterTag[];
  toggleMenu?: () => void;
  featuredPosts?: any[]; //eslint-disable-line
}

const BlogSidebar = ({
  categories,
  tags,
  featuredPosts,
  toggleMenu,
}: BlogSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const cats =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const tgs = searchParams.get("tags")?.split(",").filter(Boolean) || [];

    setSearchQuery(query);
    setSelectedCategories(cats);
    setSelectedTags(tgs);
  }, [searchParams]);

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategories.length)
      params.set("categories", selectedCategories.join(","));
    if (selectedTags.length) params.set("tags", selectedTags.join(","));

    router.push(`${pathname}?${params.toString()}`);
  }, [searchQuery, selectedCategories, selectedTags, pathname, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    toggleMenu && toggleMenu();
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleTag = (slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  };

  useEffect(() => {
    if (selectedCategories.length > 0 || selectedTags.length > 0) {
      updateFilters();
    } else {
      //keep other existing filters
      const params = new URLSearchParams(searchParams.toString());
      params.delete("categories");
      params.delete("tags");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [
    pathname,
    router,
    searchParams,
    selectedCategories,
    selectedTags,
    updateFilters,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
    router.push(pathname);
  };

  return (
    <div className="h-full py-4 px-6 flex flex-col space-y-6 bg-space-black/80 text-gray-200 backdrop-blur-sm">
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <div className="relative">
          <Input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="bg-black/50 text-gray-300 border-neon-cyan/30 focus:border-neon-cyan/50 pr-10"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full text-neon-cyan/50 hover:text-neon-cyan"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {(selectedCategories.length > 0 || selectedTags.length > 0) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider text-gray-400">
              Active Filters
            </Label>
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-neon-cyan/50 hover:text-neon-cyan"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cat) => {
              const category = categories.find((c) => c.slug === cat);
              return category ? (
                <Badge
                  key={`active-cat-${category.slug}`}
                  variant="outline"
                  className="bg-black/50 text-neon-cyan border-neon-cyan/30 hover:border-neon-cyan group"
                >
                  {category.name}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                    onClick={() => toggleCategory(category.slug)}
                  />
                </Badge>
              ) : null;
            })}
            {selectedTags.map((tg) => {
              const tag = tags.find((t) => t.slug === tg);
              return tag ? (
                <Badge
                  key={`active-tag-${tag.slug}`}
                  variant="outline"
                  className="bg-black/50 text-neon-pink border-neon-pink/30 hover:border-neon-pink group"
                >
                  {tag.name}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer opacity-70 group-hover:opacity-100"
                    onClick={() => toggleTag(tag.slug)}
                  />
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4 text-neon-cyan" />
            <Label className="text-sm uppercase tracking-wider text-gray-300">
              Categories
            </Label>
          </div>
          <div className="pl-2 border-l border-neon-cyan/20 space-y-1">
            {categories.map((category) => (
              <button
                key={`cat-${category.slug}`}
                onClick={() => toggleCategory(category.slug)}
                className={`flex items-center justify-between w-full px-2 py-1 text-sm rounded-sm transition-colors ${
                  selectedCategories.includes(category.slug)
                    ? "bg-neon-cyan/20 text-neon-cyan"
                    : "text-gray-300 hover:bg-black/50"
                }`}
              >
                <span>{category.name}</span>
                <CyberBadge variant="default" className="px-1.5 py-0.5 text-xs">
                  {category.postCount}
                </CyberBadge>
              </button>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-neon-pink" />
            <Label className="text-sm uppercase tracking-wider text-gray-300">
              Tags
            </Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={`tag-${tag.slug}`}
                variant="outline"
                onClick={() => toggleTag(tag.slug)}
                className={`py-1 cursor-pointer transition-all duration-200 ${
                  selectedTags.includes(tag.slug)
                    ? "bg-neon-pink/20 text-neon-pink border-neon-pink/50"
                    : "bg-black/50 hover:bg-black/70 border-gray-700 text-gray-300"
                }`}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-70">
                  ({tag.postCount})
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {featuredPosts && featuredPosts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Label className="text-sm uppercase tracking-wider text-gray-300">
              Featured Posts
            </Label>
          </div>
          <Carousel
            className="w-full"
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent>
              {featuredPosts.map((post, index) => (
                <CarouselItem key={index}>
                  <FeaturedPostCard key={index} post={post} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-neon-cyan/20">
        <div className="bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/20 to-neon-pink/0 h-[1px] mb-2"></div>
        <div className="text-xs text-gray-500 tracking-wide text-center">
          <div className="uppercase">NET FILTERING SYSTEM</div>
          <div className="text-[10px] font-mono mt-1">
            {new Date().toISOString().split("T")[0]}
          </div>
        </div>
      </div>
    </div>
  );
};

export { BlogSidebar };
