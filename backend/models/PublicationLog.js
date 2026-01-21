import mongoose from "mongoose";

const publicationLogSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true
    },

    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const PublicationLog = mongoose.model(
  "PublicationLog",
  publicationLogSchema
);

export default PublicationLog;
