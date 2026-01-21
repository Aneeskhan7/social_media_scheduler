import Post from "../models/Post.js";
import mongoose from "mongoose";

// =======================
// DASHBOARD STATS
// =======================
export const getStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    // Run counts in parallel (performance)
    const [
      totalPosts,
      scheduledCount,
      publishedCount,
      postsByPlatform
    ] = await Promise.all([
      Post.countDocuments({ userId }),
      Post.countDocuments({ userId, status: "scheduled" }),
      Post.countDocuments({ userId, status: "published" }),
      Post.aggregate([
        { $match: { userId } },
        { $unwind: "$platforms" },
        {
          $group: {
            _id: "$platforms",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    return res.status(200).json({
      totalPosts,
      scheduledCount,
      publishedCount,
      postsByPlatform
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// UPCOMING SCHEDULED POSTS
// =======================
export const getUpcomingPosts = async (req, res) => {
  try {
    const userId = req.user;

    const upcomingPosts = await Post.find({
      userId,
      status: "scheduled",
      scheduledTime: { $gt: new Date() }
    })
      .sort({ scheduledTime: 1 })
      .limit(5)
      .lean();

    return res.status(200).json(upcomingPosts);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
