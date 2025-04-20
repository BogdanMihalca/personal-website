/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import {
  getBlogSummaryStats,
  getAuthorStats,
  getMostViewedPosts,
  getMostLikedPosts,
  getMostCommentedPosts,
  getViewsOverTime,
  getCategoryStats,
  getTagStats,
  getCommentStats,
  getReferralStats,
  getGrowthStats,
} from "@/lib/db-actions/blog-statistics-actions";
import { BlogStatisticsClient } from "./blog-statistics-client-improved";

interface BlogStatisticsServerProps {
  userRole: string;
  userId: string;
}

function StatisticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-64 bg-neon-cyan/10 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
            >
              <div className="h-3 w-20 bg-neon-cyan/10 rounded mb-4"></div>
              <div className="h-6 w-16 bg-neon-cyan/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 rounded-lg p-4 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
        <div className="h-[300px] bg-neon-cyan/10 rounded"></div>
      </div>
    </div>
  );
}

async function BlogStatisticsData({
  userRole,
  userId,
}: BlogStatisticsServerProps) {
  const [
    summaryStats,
    authorStats,
    viewsData,
    mostViewedPosts,
    mostLikedPosts,
    mostCommentedPosts,
    categoryStats,
    tagStats,
    commentStats,
    referralStats,
    growthStats,
  ] = await Promise.all([
    getBlogSummaryStats(),
    getAuthorStats(userId),
    getViewsOverTime(30),
    getMostViewedPosts(5),
    getMostLikedPosts(5),
    getMostCommentedPosts(5),
    getCategoryStats(),
    getTagStats(10),
    getCommentStats(),
    getReferralStats(30),
    getGrowthStats(30),
  ]);

  const topPosts = [
    ...mostViewedPosts.map((post: any) => ({ ...post, type: "viewed" })),
    ...mostLikedPosts.map((post: any) => ({ ...post, type: "liked" })),
    ...mostCommentedPosts.map((post: any) => ({ ...post, type: "commented" })),
  ];

  return (
    <BlogStatisticsClient
      userId={userId}
      userRole={userRole}
      summaryStats={summaryStats}
      authorStats={authorStats}
      viewsData={viewsData}
      topPosts={topPosts}
      categoryStats={categoryStats}
      tagStats={tagStats}
      commentStats={commentStats}
      referralStats={referralStats}
      growthStats={growthStats}
    />
  );
}

export function BlogStatisticsServer({
  userRole,
  userId,
}: BlogStatisticsServerProps) {
  return (
    <Suspense fallback={<StatisticsSkeleton />}>
      <BlogStatisticsData userRole={userRole} userId={userId} />
    </Suspense>
  );
}
