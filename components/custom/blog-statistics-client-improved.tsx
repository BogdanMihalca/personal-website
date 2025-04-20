/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlitchText } from "@/components/custom/glitch-text";
import { UserRole } from "@prisma/client";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  growth?: number;
  animate?: boolean;
}

function StatCard({
  title,
  value,
  description,
  icon,
  className,
  growth,
  animate = false,
}: StatCardProps) {
  return (
    <Card
      className={`bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)] ${className} ${
        animate ? "hover:scale-[1.02] transition-all" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-neon-cyan font-mono text-sm flex items-center justify-between">
          {title}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <div
            className={`text-2xl font-bold text-white tracking-tight ${
              animate ? "animate-pulse" : ""
            }`}
          >
            {value.toLocaleString()}
          </div>

          {growth !== undefined && (
            <div
              className={`text-xs font-mono flex items-center ${
                growth > 0
                  ? "text-green-400"
                  : growth < 0
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {growth > 0 ? (
                <>
                  <span className="mr-1">↑</span>
                  {growth}%
                </>
              ) : growth < 0 ? (
                <>
                  <span className="mr-1">↓</span>
                  {Math.abs(growth)}%
                </>
              ) : (
                "0%"
              )}
            </div>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface BlogStatisticsClientProps {
  userRole: string;
  userId: string;
  summaryStats: {
    totalPosts: number;
    totalPublishedPosts: number;
    totalDrafts: number;
    totalScheduledPosts: number;
    totalArchivedPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
  authorStats: {
    authorPosts: number;
    authorViews: number;
    authorLikes: number;
    authorComments: number;
  };
  viewsData: {
    date: string;
    views: number;
  }[];
  topPosts: any[];
  categoryStats: {
    name: string;
    posts: number;
  }[];
  tagStats: {
    name: string;
    posts: number;
  }[];
  commentStats: {
    status: string;
    count: number;
  }[];
  referralStats: {
    source: string;
    count: number;
  }[];
  growthStats: {
    views: {
      current: number;
      previous: number;
      growth: number;
    };
    likes: {
      current: number;
      previous: number;
      growth: number;
    };
    comments: {
      current: number;
      previous: number;
      growth: number;
    };
  };
}

export function BlogStatisticsClient({
  userRole,
  summaryStats,
  authorStats,
  viewsData,
  topPosts,
  categoryStats,
  tagStats,
  commentStats,
  referralStats,
  growthStats,
}: BlogStatisticsClientProps) {
  const isAdmin = userRole === UserRole.ADMIN;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-md border border-neon-cyan/50 rounded p-2 shadow-[0_0_10px_rgba(0,255,255,0.3)]">
          <p className="text-neon-cyan font-mono text-xs mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className="text-xs"
              style={{ color: entry.color }}
            >
              <span className="font-medium">{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CyberLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap gap-4 justify-center mt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1">
            <div
              className="w-3 h-3 border border-white/30"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-300">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
  };

  const postStatusData = [
    {
      name: "Published",
      posts: summaryStats?.totalPublishedPosts || 0,
      color: "#00FFFF", // Bright neon cyan
    },
    {
      name: "Draft",
      posts: summaryStats?.totalDrafts || 0,
      color: "#FF00FF", // Vibrant neon pink
    },
    {
      name: "Scheduled",
      posts: summaryStats?.totalScheduledPosts || 0,
      color: "#FFFF00", // Bright neon yellow
    },
    {
      name: "Archived",
      posts: summaryStats?.totalArchivedPosts || 0,
      color: "#32CD32", // Lime green instead of gray
    },
  ];

  const pieChartData = commentStats.map((stat) => {
    const statusLabels: Record<string, string> = {
      APPROVED: "Approved",
      PENDING: "Pending",
      REJECTED: "Rejected",
      SPAM: "Spam",
    };

    const colorMap: Record<string, string> = {
      APPROVED: "#00FF00",
      PENDING: "#FFFF00",
      REJECTED: "#FF0000",
      SPAM: "#999999",
    };

    return {
      name: statusLabels[stat.status] || stat.status,
      value: stat.count,
      color: colorMap[stat.status] || "#999999",
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <GlitchText color="cyan" className="text-xl mb-4">
          Blog Statistics Overview
        </GlitchText>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Views"
            value={summaryStats?.totalViews || 0}
            growth={growthStats?.views.growth}
            className="border-neon-cyan/70"
            animate={growthStats?.views.growth > 10}
            description={`Last ${growthStats?.views.current} vs Previous ${growthStats?.views.previous}`}
          />
          <StatCard
            title="Published Posts"
            value={summaryStats?.totalPublishedPosts || 0}
            className="border-neon-pink/70"
          />
          <StatCard
            title="Total Comments"
            value={summaryStats?.totalComments || 0}
            growth={growthStats?.comments.growth}
            className="border-neon-yellow/70"
            animate={growthStats?.comments.growth > 10}
            description={`Last ${growthStats?.comments.current} new comments`}
          />
          <StatCard
            title="Total Likes"
            value={summaryStats?.totalLikes || 0}
            growth={growthStats?.likes.growth}
            className="border-neon-purple/70"
            animate={growthStats?.likes.growth > 10}
            description={`Last ${growthStats?.likes.current} new likes`}
          />
        </div>
      </div>

      <Tabs defaultValue="views" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 bg-space-black/80 border border-neon-cyan/30 p-1">
          <TabsTrigger
            value="views"
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200"
          >
            Views
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="cursor-pointer data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan data-[state=active]:border-neon-cyan/50 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border border-transparent transition-all text-gray-400 hover:text-gray-200"
          >
            Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="views">
          <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <CardHeader className="border-b border-neon-cyan/30">
              <CardTitle className="text-neon-cyan font-mono flex items-center">
                <span className="text-neon-pink mr-2">[</span>
                VIEWS_ANALYSIS
                <span className="text-neon-pink ml-2">]</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visualization of post views over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={viewsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="viewsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#00FFFF"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00FFFF"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#333"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="#666"
                      tick={{ fill: "#999", fontSize: 11 }}
                      tickLine={{ stroke: "#666" }}
                      axisLine={{ stroke: "#666" }}
                    />
                    <YAxis
                      stroke="#666"
                      tick={{ fill: "#999", fontSize: 11 }}
                      tickLine={{ stroke: "#666" }}
                      axisLine={{ stroke: "#666" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CyberLegend />} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Views"
                      stroke="#00FFFF"
                      strokeWidth={2}
                      fill="url(#viewsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <CardHeader className="border-b border-neon-cyan/30">
                <CardTitle className="text-neon-cyan font-mono flex items-center text-sm">
                  <span className="text-neon-pink mr-2">[</span>
                  MOST_VIEWED_POSTS
                  <span className="text-neon-pink ml-2">]</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {topPosts
                    .filter((post) => post.type === "viewed")
                    .map((post, idx) => (
                      <li
                        key={post.id}
                        className="text-sm flex justify-between items-center"
                      >
                        <span className="text-gray-300 truncate flex-1">
                          <span className="text-neon-pink mr-2">
                            {idx + 1}.
                          </span>
                          {post.title}
                        </span>
                        <span className="text-neon-cyan font-mono ml-2">
                          {post._count.views}
                        </span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            {isAdmin && (
              <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <CardHeader className="border-b border-neon-cyan/30">
                  <CardTitle className="text-neon-cyan font-mono flex items-center text-sm">
                    <span className="text-neon-pink mr-2">[</span>
                    REFERRAL_SOURCES
                    <span className="text-neon-pink ml-2">]</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {referralStats && referralStats.length > 0 && (
                          <>
                            <Pie
                              data={Object.entries(
                                referralStats.reduce(
                                  (acc: Record<string, number>, curr) => {
                                    acc[curr.source] =
                                      (acc[curr.source] || 0) + curr.count;
                                    return acc;
                                  },
                                  {}
                                )
                              ).map(([source, count]) => {
                                const colorMap: Record<string, string> = {
                                  Search: "#00FFFF",
                                  Social: "#FF00FF",
                                  Direct: "#FFFF00",
                                  Other: "#00FF00",
                                };
                                return {
                                  name: source,
                                  value: count,
                                  color: colorMap[source] || "#999999",
                                };
                              })}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="name"
                              label={(entry) =>
                                `${entry.name}: ${Math.round(
                                  entry.percent * 100
                                )}%`
                              }
                              labelLine={false}
                            >
                              {Object.entries(
                                referralStats.reduce(
                                  (acc: Record<string, number>, curr) => {
                                    acc[curr.source] =
                                      (acc[curr.source] || 0) + curr.count;
                                    return acc;
                                  },
                                  {}
                                )
                              ).map(([source]) => {
                                const colorMap: Record<string, string> = {
                                  Search: "#00FFFF",
                                  Social: "#FF00FF",
                                  Direct: "#FFFF00",
                                  Other: "#00FF00",
                                };
                                return (
                                  <Cell
                                    key={`cell-${source}`}
                                    fill={colorMap[source] || "#999999"}
                                  />
                                );
                              })}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CyberLegend />} />
                          </>
                        )}
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <CardHeader className="border-b border-neon-cyan/30">
                <CardTitle className="text-neon-cyan font-mono flex items-center text-sm">
                  <span className="text-neon-pink mr-2">[</span>
                  MOST_LIKED_POSTS
                  <span className="text-neon-pink ml-2">]</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {topPosts
                    .filter((post) => post.type === "liked")
                    .map((post, idx) => (
                      <li
                        key={post.id}
                        className="text-sm flex justify-between items-center"
                      >
                        <span className="text-gray-300 truncate flex-1">
                          <span className="text-neon-pink mr-2">
                            {idx + 1}.
                          </span>
                          {post.title}
                        </span>
                        <span className="text-neon-cyan font-mono ml-2">
                          {post._count.likes}
                        </span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <CardHeader className="border-b border-neon-cyan/30">
                <CardTitle className="text-neon-cyan font-mono flex items-center text-sm">
                  <span className="text-neon-pink mr-2">[</span>
                  MOST_COMMENTED_POSTS
                  <span className="text-neon-pink ml-2">]</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {topPosts
                    .filter((post) => post.type === "commented")
                    .map((post, idx) => (
                      <li
                        key={post.id}
                        className="text-sm flex justify-between items-center"
                      >
                        <span className="text-gray-300 truncate flex-1">
                          <span className="text-neon-pink mr-2">
                            {idx + 1}.
                          </span>
                          {post.title}
                        </span>
                        <span className="text-neon-cyan font-mono ml-2">
                          {post._count.comments}
                        </span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <CardHeader className="border-b border-neon-cyan/30">
              <CardTitle className="text-neon-cyan font-mono flex items-center">
                <span className="text-neon-pink mr-2">[</span>
                POST_STATUS_DISTRIBUTION
                <span className="text-neon-pink ml-2">]</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Distribution of posts by status
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={postStatusData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#333"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#666"
                      tick={{ fill: "#999", fontSize: 12 }}
                      tickLine={{ stroke: "#666" }}
                    />
                    <YAxis
                      stroke="#666"
                      tick={{ fill: "#999", fontSize: 12 }}
                      tickLine={{ stroke: "#666" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CyberLegend />} />
                    <Bar dataKey="posts" name="Posts" radius={[4, 4, 0, 0]}>
                      {postStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <CardHeader className="border-b border-neon-cyan/30">
                <CardTitle className="text-neon-cyan font-mono flex items-center">
                  <span className="text-neon-pink mr-2">[</span>
                  POSTS_BY_CATEGORY
                  <span className="text-neon-pink ml-2">]</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={categoryStats.map((cat) => ({
                        name: cat.name,
                        posts: cat.posts,
                      }))}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#333"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        stroke="#666"
                        tick={{ fill: "#999", fontSize: 12 }}
                        tickLine={{ stroke: "#666" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        stroke="#666"
                        tick={{ fill: "#999", fontSize: 12 }}
                        tickLine={{ stroke: "#666" }}
                        tickFormatter={(value) =>
                          value.length > 15
                            ? `${value.substring(0, 12)}...`
                            : value
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend content={<CyberLegend />} />
                      <Bar
                        dataKey="posts"
                        name="Posts"
                        fill="#00FFFF"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <CardHeader className="border-b border-neon-cyan/30">
                <CardTitle className="text-neon-cyan font-mono flex items-center">
                  <span className="text-neon-pink mr-2">[</span>
                  TOP_TAGS
                  <span className="text-neon-pink ml-2">]</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={tagStats.map((tag) => ({
                        name: tag.name,
                        posts: tag.posts,
                      }))}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#333"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        stroke="#666"
                        tick={{ fill: "#999", fontSize: 12 }}
                        tickLine={{ stroke: "#666" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        stroke="#666"
                        tick={{ fill: "#999", fontSize: 12 }}
                        tickLine={{ stroke: "#666" }}
                        tickFormatter={(value) =>
                          value.length > 15
                            ? `${value.substring(0, 12)}...`
                            : value
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend content={<CyberLegend />} />
                      <Bar
                        dataKey="posts"
                        name="Posts"
                        fill="#FF00FF"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <CardHeader className="border-b border-neon-cyan/30">
                <CardTitle className="text-neon-cyan font-mono flex items-center">
                  <span className="text-neon-pink mr-2">[</span>
                  COMMENTS_BY_STATUS
                  <span className="text-neon-pink ml-2">]</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={(entry) => entry.name}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend content={<CyberLegend />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-black/90 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <CardHeader className="border-b border-neon-cyan/30">
                <CardTitle className="text-neon-cyan font-mono flex items-center">
                  <span className="text-neon-pink mr-2">[</span>
                  YOUR_STATS
                  <span className="text-neon-pink ml-2">]</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your personal blog statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    title="Your Posts"
                    value={authorStats?.authorPosts || 0}
                    className="border-neon-cyan/50"
                  />
                  <StatCard
                    title="Your Views"
                    value={authorStats?.authorViews || 0}
                    className="border-neon-pink/50"
                  />
                  <StatCard
                    title="Your Likes"
                    value={authorStats?.authorLikes || 0}
                    className="border-neon-yellow/50"
                  />
                  <StatCard
                    title="Your Comments"
                    value={authorStats?.authorComments || 0}
                    className="border-neon-purple/50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
