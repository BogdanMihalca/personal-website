import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface BlogCategoriesProps {
  className?: string;
  mobile?: boolean;
  setMenuOpen?: (open: boolean) => void;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

export function BlogCategories({
  className = "",
  mobile = false,
  setMenuOpen = () => {},
}: BlogCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const currentCategory = pathname?.includes("/category/")
    ? pathname.split("/category/")[1]
    : null;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/blogposts/categories");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setCategories(data);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }

      setCategories([
        {
          id: 1,
          name: "Uncategorized",
          slug: "uncategorized",
          _count: {
            posts: 0,
          },
        },
        {
          id: 2,
          name: "General",
          slug: "general",
          _count: {
            posts: 0,
          },
        },
      ]);
    }

    fetchCategories();
  }, []);

  if (mobile) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center mb-2 cursor-pointer ">
          <span className="text-sm uppercase tracking-wider text-cyan-400 font-medium cursor-pointer">
            Categories
          </span>
          <ChevronDown size={16} className="ml-1 text-cyan-400" />
        </div>

        <div className="space-y-1 pl-2 border-l border-cyan-500/30">
          <Link
            href="/blog"
            className="block py-1.5 text-sm text-gray-300 hover:text-cyan-400 transition-colors"
          >
            All Posts
          </Link>

          {categories
            .filter((c) => c._count.posts > 0)
            .map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className={`py-1.5 text-sm flex justify-between items-center group transition-colors ${
                  currentCategory === category.slug
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-cyan-400"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <span>{category.name}</span>
                <Badge className="bg-zinc-800/70 text-xs">
                  {category._count.posts}
                </Badge>
              </Link>
            ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center focus:outline-none ${className} cursor-pointer`}
      >
        <span className="text-sm tracking-wider hover:text-cyan-400 transition-colors duration-300">
          CATEGORIES
        </span>
        <ChevronDown
          size={16}
          className="ml-1 text-gray-400 group-hover:text-cyan-400 transition-transform duration-300"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="bg-black/95 border border-zinc-800 backdrop-blur-md rounded-md shadow-xl shadow-purple-500/10 z-50 min-w-48 py-1"
      >
        <DropdownMenuItem asChild>
          <Link
            href="/blog"
            className="px-4 py-2 text-sm text-gray-300 hover:text-cyan-400 hover:bg-zinc-900/50 focus:bg-zinc-900/50 focus:text-cyan-400 cursor-pointer"
          >
            All Posts
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-800/50 my-1" />

        {categories
          .filter((c) => c._count.posts > 0)
          .map((category) => (
            <DropdownMenuItem key={category.id} asChild>
              <Link
                href={`/blog/category/${category.slug}`}
                className={`px-4 py-2 text-sm flex justify-between items-center hover:bg-zinc-900/50 focus:bg-zinc-900/50 cursor-pointer ${
                  currentCategory === category.slug
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-cyan-400 focus:text-cyan-400"
                }`}
              >
                <span>{category.name}</span>
                <Badge className="ml-2 bg-zinc-800/70 text-xs">
                  {category._count.posts}
                </Badge>
              </Link>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
