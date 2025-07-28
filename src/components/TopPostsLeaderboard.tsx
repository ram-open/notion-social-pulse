import { Heart, MessageCircle, Share2 } from "lucide-react";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";

const topPosts = [
  {
    id: 1,
    image: post1,
    caption: "Coffee break vibes ☕ Perfect afternoon at our favorite local spot!",
    likes: 3245,
    comments: 127,
    shares: 89,
    platform: "Instagram",
  },
  {
    id: 2,
    image: post2,
    caption: "Introducing our latest tech lineup - innovation meets elegance",
    likes: 2891,
    comments: 94,
    shares: 156,
    platform: "LinkedIn",
  },
  {
    id: 3,
    image: post3,
    caption: "Remote work setup inspiration 💻 Creating the perfect workspace",
    likes: 2567,
    comments: 82,
    shares: 73,
    platform: "Facebook",
  },
];

const platformColors = {
  Instagram: "bg-pink-500",
  LinkedIn: "bg-blue-600",
  Facebook: "bg-blue-500",
};

export function TopPostsLeaderboard() {
  return (
    <div className="space-y-4">
      {topPosts.map((post, index) => (
        <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg bg-notion-gray-50 hover:bg-notion-gray-100 transition-colors">
          {/* Rank */}
          <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
            {index + 1}
          </div>

          {/* Post Image */}
          <div className="flex-shrink-0">
            <img 
              src={post.image} 
              alt="Post thumbnail" 
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>

          {/* Post Details */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-1 text-xs text-white rounded-md ${platformColors[post.platform as keyof typeof platformColors]}`}>
                {post.platform}
              </span>
            </div>
            <p className="text-sm text-notion-gray-900 font-medium line-clamp-2 mb-2">
              {post.caption}
            </p>
            <div className="flex items-center gap-4 text-xs text-notion-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{post.likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                <span>{post.shares}</span>
              </div>
            </div>
          </div>

          {/* Total Engagement Score */}
          <div className="flex-shrink-0 text-right">
            <div className="text-lg font-semibold text-notion-gray-900">
              {(post.likes + post.comments * 10 + post.shares * 5).toLocaleString()}
            </div>
            <div className="text-xs text-notion-gray-500">
              Engagement Score
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}