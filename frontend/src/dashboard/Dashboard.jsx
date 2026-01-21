import { useEffect, useState } from "react";
import API from "../api/axios";
import CreatePost from "../posts/CreatePost";
import PostList from "../posts/PostList";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postsUpdated, setPostsUpdated] = useState(false);

  // Trigger refresh for posts + stats
  const refreshPosts = () => {
    setPostsUpdated((prev) => !prev);
  };

  //  Fetch stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  // fetch stats on load AND when posts update
  useEffect(() => {
    fetchStats();
  }, [postsUpdated]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-slate-100 px-6 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-1.5 h-16 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 rounded-full"></div>
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-2 text-lg font-medium flex items-center gap-2">
              Overview of your scheduled content
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <p className="text-slate-500 text-lg animate-pulse">
          Loading statistics...
        </p>
      ) : (
        stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {/* Total Posts */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl hover:scale-105 transition">
              <p className="text-sm font-semibold text-slate-500 uppercase">
                Total Posts
              </p>
              <h2 className="text-5xl font-extrabold text-slate-900 mt-3">
                {stats.totalPosts}
              </h2>
            </div>

            {/* Scheduled */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition">
              <p className="text-sm font-semibold text-blue-100 uppercase">
                Scheduled
              </p>
              <h2 className="text-5xl font-extrabold text-white mt-3">
                {stats.scheduledCount}
              </h2>
            </div>

            {/* Published */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition">
              <p className="text-sm font-semibold text-green-100 uppercase">
                Published
              </p>
              <h2 className="text-5xl font-extrabold text-white mt-3">
                {stats.publishedCount}
              </h2>
            </div>
          </div>
        )
      )}

      {/* Create Post */}
      <div className="bg-white rounded-2xl border shadow-sm mb-12">
        <div className="px-8 py-6">
          <h3 className="text-xl font-semibold">Create New Post</h3>
          <p className="text-sm text-slate-500">
            Write content and schedule it for automatic publishing
          </p>
        </div>
        <div className="px-8 py-6">
          <CreatePost onPostCreated={refreshPosts} />
        </div>
      </div>

      {/* Post List */}
      <div className="bg-white rounded-2xl shadow-xl border p-8">
        <h3 className="text-2xl font-bold mb-6 border-b pb-4">Your Posts</h3>
        <PostList refreshTrigger={postsUpdated} onPostChanged={refreshPosts} />
      </div>
    </div>
  );
}
