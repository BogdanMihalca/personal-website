import { UserRole } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTable } from "@/components/custom/posts-table";
import { CategoriesTable } from "@/components/custom/categories-table";
import { TagsTable } from "@/components/custom/tags-table";
import { CommentsTable } from "@/components/custom/comments-table";
import { BlogStatisticsServer } from "@/components/custom/blog-statistics-server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardContentProps {
  userRole: string;
  userId: string;
}

export function DashboardContent({ userRole, userId }: DashboardContentProps) {
  // only ADMIN and EDITOR can manage categories and tags
  const canManageTaxonomy =
    userRole === UserRole.ADMIN || userRole === UserRole.EDITOR;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="statistics" className="w-full">
        <TabsList className="grid grid-cols-5 mb-2 bg-space-black/80 border border-neon-cyan/30 p-1">
          <TabsTrigger
            value="statistics"
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200"
          >
            Statistics
          </TabsTrigger>{" "}
          <TabsTrigger
            value="posts"
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200"
          >
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            disabled={!canManageTaxonomy}
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="tags"
            disabled={!canManageTaxonomy}
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <CardHeader className="border-b border-neon-cyan/30">
              <CardTitle className="text-neon-cyan font-mono flex items-center">
                <span className="text-neon-pink mr-2">[</span>
                POSTS_MANAGEMENT
                <span className="text-neon-pink ml-2">]</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your blog posts, update their status, or create new
                content.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <PostsTable
                userId={userId}
                isAdmin={userRole === UserRole.ADMIN}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <CardHeader className="border-b border-neon-cyan/30">
              <CardTitle className="text-neon-cyan font-mono flex items-center">
                <span className="text-neon-pink mr-2">[</span>
                COMMENTS_MANAGEMENT
                <span className="text-neon-pink ml-2">]</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Review, approve, reject or mark comments as spam.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CommentsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <CardHeader className="border-b border-neon-cyan/30">
              <CardTitle className="text-neon-cyan font-mono flex items-center">
                <span className="text-neon-pink mr-2">[</span>
                BLOG_ANALYTICS
                <span className="text-neon-pink ml-2">]</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visualized statistics and insights about your blog content and
                engagement.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <BlogStatisticsServer userId={userId} userRole={userRole} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <CardHeader className="border-b border-neon-cyan/30">
              <CardTitle className="text-neon-cyan font-mono flex items-center">
                <span className="text-neon-pink mr-2">[</span>
                CATEGORIES_MANAGEMENT
                <span className="text-neon-pink ml-2">]</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Create, edit, or delete blog categories.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CategoriesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <CardHeader className="border-b border-neon-cyan/30">
              <CardTitle className="text-neon-cyan font-mono flex items-center">
                <span className="text-neon-pink mr-2">[</span>
                TAGS_MANAGEMENT
                <span className="text-neon-pink ml-2">]</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Create, edit, or delete blog tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <TagsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
