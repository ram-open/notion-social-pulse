import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowerGrowthChart } from "./charts/FollowerGrowthChart";
import { LikesChart } from "./charts/LikesChart";
import { CommentsChart } from "./charts/CommentsChart";
import { EngagementChart } from "./charts/EngagementChart";
import { TopPostsLeaderboard } from "./TopPostsLeaderboard";
import { Users, Heart, MessageCircle, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Followers",
    value: "245,321",
    change: "+12.3%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Total Likes",
    value: "89,142",
    change: "+8.7%",
    icon: Heart,
    color: "text-red-500",
  },
  {
    title: "Total Comments",
    value: "12,847",
    change: "+15.2%",
    icon: MessageCircle,
    color: "text-green-600",
  },
  {
    title: "Engagement Rate",
    value: "4.2%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-purple-600",
  },
];

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-notion-gray-900">Social Media Analytics</h1>
          <p className="text-notion-gray-500">Track your social media performance across all platforms</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-notion-gray-500 font-medium">{stat.title}</p>
                    <p className="text-2xl font-semibold text-notion-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Follower Growth */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-notion-gray-900">Follower Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <FollowerGrowthChart />
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-notion-gray-900">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <EngagementChart />
            </CardContent>
          </Card>

          {/* Average Likes */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-notion-gray-900">Average Likes per Post</CardTitle>
            </CardHeader>
            <CardContent>
              <LikesChart />
            </CardContent>
          </Card>

          {/* Average Comments */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-notion-gray-900">Average Comments per Post</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentsChart />
            </CardContent>
          </Card>
        </div>

        {/* Top Posts Leaderboard */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-notion-gray-900">Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <TopPostsLeaderboard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}