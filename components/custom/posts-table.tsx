/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Archive,
  Search,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  getDashboardPosts,
  updatePostStatus,
  deletePost,
} from "@/lib/db-actions/post-actions";
import { PostStatus } from "@prisma/client";
import { CyberpunkButton } from "./cyber-button";
import { DeleteDialog } from "@/components/custom/table-utils";
import { CyberPagination } from "./cyber-pagination";

interface PostsTableProps {
  userId: string;
  isAdmin: boolean;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
  category?: {
    name: string;
  };
  _count: {
    views: number;
    likes: number;
    comments: number;
  };
}

export function PostsTable({ userId, isAdmin }: PostsTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | undefined>(
    undefined
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const POSTS_PER_PAGE = 10;

  // Load posts with filtering and pagination
  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { posts: fetchedPosts, totalPosts: total } =
        await getDashboardPosts({
          authorId: !isAdmin ? userId : undefined,
          skip: (page - 1) * POSTS_PER_PAGE,
          take: POSTS_PER_PAGE,
          status: selectedStatus,
          searchQuery,
        });

      setPosts(fetchedPosts as Post[]);
      setTotalPosts(total);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, selectedStatus, userId, isAdmin]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handleStatusChange(postId: number, status: PostStatus) {
    try {
      await updatePostStatus(postId, status);
      loadPosts();
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  }

  async function handleDeletePost() {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setDeleteDialogOpen(false);
        loadPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  }

  function confirmDelete(postId: number) {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  }

  function getStatusBadge(status: PostStatus) {
    switch (status) {
      case "PUBLISHED":
        return (
          <Badge className="bg-space-black border border-green-500/50 text-green-400 shadow-[0_0_8px_rgba(0,255,0,0.3)]">
            Published
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge className="bg-space-black border border-yellow-500/50 text-yellow-400 shadow-[0_0_8px_rgba(255,255,0,0.2)]">
            Draft
          </Badge>
        );
      case "ARCHIVED":
        return (
          <Badge className="bg-space-black border border-gray-500/50 text-gray-400 shadow-[0_0_8px_rgba(200,200,200,0.15)]">
            Archived
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge className="bg-space-black border border-blue-500/50 text-blue-400 shadow-[0_0_8px_rgba(0,0,255,0.3)]">
            Scheduled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-space-black border border-neon-cyan/50 text-neon-cyan">
            {status}
          </Badge>
        );
    }
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Render post actions dropdown
  function renderPostActions(post: Post) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-pink/10"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-space-black/90 backdrop-blur-md border-neon-cyan/40"
        >
          <DropdownMenuLabel className="text-neon-cyan font-mono text-xs">
            ACTIONS
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/blog/${post.slug}`)}
            className="text-neon-cyan hover:text-white hover:bg-neon-cyan/10 focus:bg-neon-cyan/20 cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/blog/dashboard/edit/${post.id}`)}
            className="text-neon-cyan hover:text-white hover:bg-neon-cyan/10 focus:bg-neon-cyan/20 cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neon-cyan/20" />
          {post.status !== PostStatus.PUBLISHED && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(post.id, PostStatus.PUBLISHED)}
              className="text-green-400 hover:text-white hover:bg-green-800/20 focus:bg-green-800/30 cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" /> Publish
            </DropdownMenuItem>
          )}
          {post.status !== PostStatus.DRAFT && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(post.id, PostStatus.DRAFT)}
              className="text-yellow-400 hover:text-white hover:bg-yellow-800/20 focus:bg-yellow-800/30 cursor-pointer"
            >
              <EyeOff className="mr-2 h-4 w-4" /> Set as Draft
            </DropdownMenuItem>
          )}
          {post.status !== PostStatus.ARCHIVED && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(post.id, PostStatus.ARCHIVED)}
              className="text-gray-400 hover:text-white hover:bg-gray-800/20 focus:bg-gray-800/30 cursor-pointer"
            >
              <Archive className="mr-2 h-4 w-4" /> Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-neon-cyan/20" />
          <DropdownMenuItem
            onClick={() => confirmDelete(post.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:bg-red-900/30 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neon-cyan" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 bg-space-black/80 border-neon-cyan/30 text-neon-cyan focus:border-neon-cyan/80 placeholder:text-neon-cyan/50"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => loadPosts()}
            title="Refresh"
            className="border border-neon-cyan/30 bg-space-black/80 text-neon-cyan hover:bg-neon-cyan/20 hover:text-neon-cyan hover:border-neon-cyan/60"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-space-black/80 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/70 hover:text-neon-cyan/70"
              >
                {selectedStatus ? selectedStatus : "All Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-space-black/90 backdrop-blur-md border-neon-cyan/40">
              <DropdownMenuItem
                onClick={() => setSelectedStatus(undefined)}
                className="text-neon-cyan hover:text-white hover:bg-neon-cyan/10 focus:bg-neon-cyan/20 cursor-pointer"
              >
                All Status
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neon-cyan/20" />
              <DropdownMenuItem
                onClick={() => setSelectedStatus(PostStatus.PUBLISHED)}
                className="text-green-400 hover:text-white hover:bg-green-800/20 focus:bg-green-800/30 cursor-pointer"
              >
                Published
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus(PostStatus.DRAFT)}
                className="text-yellow-400 hover:text-white hover:bg-yellow-800/20 focus:bg-yellow-800/30 cursor-pointer"
              >
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus(PostStatus.ARCHIVED)}
                className="text-gray-400 hover:text-white hover:bg-gray-800/20 focus:bg-gray-800/30 cursor-pointer"
              >
                Archived
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus(PostStatus.SCHEDULED)}
                className="text-blue-400 hover:text-white hover:bg-blue-800/20 focus:bg-blue-800/30 cursor-pointer"
              >
                Scheduled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CyberpunkButton
            onClick={() => router.push("/blog/dashboard/create")}
            icon={<Plus className="h-4 w-4" />}
            size="sm"
            variant="secondary"
          >
            New Post
          </CyberpunkButton>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <Card className="w-full h-full flex justify-center items-center bg-space-black/80 border-neon-cyan/30 backdrop-blur-md">
            <RefreshCw className="h-8 w-8 animate-spin text-neon-cyan" />
          </Card>
        </div>
      ) : posts.length > 0 ? (
        <div className="border border-neon-cyan/30 rounded-md bg-space-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <Table variant="cyberpunk">
            <TableHeader variant="cyberpunk">
              <TableRow variant="cyberpunk">
                <TableHead variant="cyberpunk">Title</TableHead>
                <TableHead variant="cyberpunk">Author</TableHead>
                <TableHead variant="cyberpunk">Category</TableHead>
                <TableHead variant="cyberpunk">Status</TableHead>
                <TableHead variant="cyberpunk" className="text-center">
                  Stats
                </TableHead>
                <TableHead variant="cyberpunk">Date</TableHead>
                <TableHead variant="cyberpunk" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody variant="cyberpunk">
              {posts.map((post) => (
                <TableRow variant="cyberpunk" key={post.id}>
                  <TableCell
                    variant="cyberpunk"
                    highlight
                    className="max-w-[450px] overflow-hidden text-ellipsis cursor-pointer"
                    onClick={() => router.push(`/blog/${post.slug}`)}
                    title={post.title}
                    role="button"
                  >
                    {post.title}
                  </TableCell>
                  <TableCell variant="cyberpunk">
                    <div className="flex items-center gap-2">
                      {post.author?.image && (
                        <img
                          src={post.author.image}
                          alt={post.author.name || "Author"}
                          className="w-6 h-6 rounded-full border border-neon-cyan/30"
                        />
                      )}
                      <span className="text-neon-cyan">
                        {post.author?.name || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell variant="cyberpunk">
                    <Badge
                      variant="outline"
                      className="bg-space-black/50 border-neon-pink/50 text-neon-pink"
                    >
                      {post.category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell variant="cyberpunk">
                    {getStatusBadge(post.status)}
                  </TableCell>
                  <TableCell variant="cyberpunk">
                    <div className="flex justify-center gap-4 text-xs font-mono">
                      <div className="flex flex-col items-center">
                        <div className="text-neon-cyan font-bold">
                          {post._count.views}
                        </div>
                        <div className="text-neon-cyan/60">Views</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-neon-pink font-bold">
                          {post._count.likes}
                        </div>
                        <div className="text-neon-pink/60">Likes</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-neon-yellow font-bold">
                          {post._count.comments}
                        </div>
                        <div className="text-neon-yellow/60">Comments</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell variant="cyberpunk">
                    <div className="text-xs flex flex-col">
                      <div>
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-neon-cyan/70">
                        Updated: {new Date(post.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell variant="cyberpunk" className="text-right">
                    {renderPostActions(post)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="w-full p-10 text-center bg-space-black/80 border-neon-cyan/30 text-neon-cyan backdrop-blur-md">
          No posts found. Create your first post to get started.
        </Card>
      )}

      {totalPages > 1 && (
        <CyberPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeletePost}
        itemType="post"
      />
    </div>
  );
}
