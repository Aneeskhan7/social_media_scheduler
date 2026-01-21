import cron from "node-cron";
import Post from "../models/Post.js";
import PublicationLog from "../models/PublicationLog.js";

let isRunning = false; // 🔒 Prevent overlapping runs

const startScheduler = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    if (isRunning) return; // Skip if previous run is still active
    isRunning = true;

    try {
      const now = new Date();
      console.log("⏱️ Cron job running at:", now.toISOString());

      // Find due scheduled posts
      const postsToPublish = await Post.find({
        status: "scheduled",
        scheduledTime: { $lte: now }
      }).sort({ createdAt: 1 });

      if (postsToPublish.length === 0) {
        console.log("ℹ️ No posts to publish");
        isRunning = false;
        return;
      }

      for (const post of postsToPublish) {
        // Extra safety: re-check status
        if (post.status !== "scheduled") continue;

        post.status = "published";
        await post.save();

        await PublicationLog.create({
          postId: post._id,
          publishedAt: now
        });

        console.log(`✅ Post published: ${post._id}`);
      }
    } catch (error) {
      console.error("❌ Cron job error:", error.message);
    } finally {
      isRunning = false; // Always release lock
    }
  });
};

export default startScheduler;
