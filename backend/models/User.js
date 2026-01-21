import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false // 🔐 Prevent password from being returned in queries
    }
  },
  {
    timestamps: true
  }
);

// Ensure unique index (important for production)
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
