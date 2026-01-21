import Post from "../models/Post.js";
import mongoose from "mongoose";

// =======================
// CREATE POST
// =======================
export const createPost = async (req, res) => {
  try {
    const { content, platforms, scheduledTime } = req.body;

    // Validate input types
    if (
      typeof content !== "string" ||
      !Array.isArray(platforms) ||
      typeof scheduledTime !== "string"
    ) {
      return res.status(400).json({ message: "Invalid input type" });
    }

    // Trim and validate content
    if (!content.trim() || content.length > 500) {
      return res.status(400).json({
        message: "Content is required and must be under 500 characters"
      });
    }

    // Validate platforms
    if (platforms.length === 0) {
      return res.status(400).json({ message: "Select at least one platform" });
    }

    // Validate scheduled time
    const scheduleDate = new Date(scheduledTime);
    if (isNaN(scheduleDate.getTime())) {
      return res.status(400).json({ message: "Invalid scheduled time" });
    }

    if (scheduleDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Scheduled time must be in the future" });
    }

    // Create post
    const post = await Post.create({
      userId: req.user,
      content: content.trim(),
      platforms,
      scheduledTime: scheduleDate,
      status: "scheduled"
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET ALL POSTS
// =======================
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// UPDATE POST
// =======================
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check
    if (post.userId.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Cannot edit published posts
    if (post.status === "published") {
      return res
        .status(400)
        .json({ message: "Published post cannot be edited" });
    }

    const { content, platforms, scheduledTime } = req.body;

    // Update content
    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim() || content.length > 500) {
        return res
          .status(400)
          .json({ message: "Invalid content" });
      }
      post.content = content.trim();
    }

    // Update platforms
    if (platforms !== undefined) {
      if (!Array.isArray(platforms) || platforms.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid platforms" });
      }
      post.platforms = platforms;
    }

    // Update scheduled time
    if (scheduledTime !== undefined) {
      const newDate = new Date(scheduledTime);
      if (isNaN(newDate.getTime()) || newDate <= new Date()) {
        return res
          .status(400)
          .json({ message: "Invalid scheduled time" });
      }
      post.scheduledTime = newDate;
    }

    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// DELETE POST
// =======================
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check
    if (post.userId.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Cannot delete published posts
    if (post.status === "published") {
      return res
        .status(400)
        .json({ message: "Published post cannot be deleted" });
    }

    await post.deleteOne();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
