import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500
    },

    platforms: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "At least one platform is required"
      },
      enum: ["Twitter", "Facebook", "Instagram"]
    },

    scheduledTime: {
      type: Date,
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "draft",
      index: true
    },

    imageUrl: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Compound index for faster scheduler queries
 * (user + status + scheduledTime)
 */
postSchema.index({ userId: 1, status: 1, scheduledTime: 1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
