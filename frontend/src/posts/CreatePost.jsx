import { useState } from "react";
import API from "../api/axios";

const PLATFORMS = ["Twitter", "Facebook", "Instagram"];

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [platforms, setPlatforms] = useState(["Twitter"]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const MAX_LENGTH = 500;

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🧼 Frontend validation (mirror backend)
    if (!content.trim()) {
      setError("Post content is required");
      return;
    }

    if (content.length > MAX_LENGTH) {
      setError("Post content cannot exceed 500 characters");
      return;
    }

    if (platforms.length === 0) {
      setError("Select at least one platform");
      return;
    }

    if (!scheduledTime) {
      setError("Scheduled date and time is required");
      return;
    }

    const selectedDate = new Date(scheduledTime);
    if (isNaN(selectedDate.getTime()) || selectedDate <= new Date()) {
      setError("Scheduled time must be in the future");
      return;
    }

    setLoading(true);

    try {
      await API.post("/posts", {
        content: content.trim(),
        platforms,
        scheduledTime
      });
      onPostCreated();

      setSuccess("Post scheduled successfully");

      // Reset form
      setContent("");
      setScheduledTime("");
      setPlatforms(["Twitter"]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule post");
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 text-red-600 px-4 py-2 text-sm border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 text-green-600 px-4 py-2 text-sm border border-green-100">
          {success}
        </div>
      )}

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Post Content
        </label>
        <textarea
          placeholder="What's on your mind? Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition resize-none text-slate-900 placeholder:text-slate-400"
        />
        <p className="text-xs text-slate-500 mt-1">
          {content.length}/{MAX_LENGTH} characters
        </p>
      </div>

      {/* Platforms */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Platforms
        </label>
        <div className="flex gap-4">
          {PLATFORMS.map((platform) => (
            <label
              key={platform}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={platforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
                className="accent-blue-600"
              />
              {platform}
            </label>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Schedule Date & Time
        </label>
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-slate-900"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50"
        >
          {loading ? "Scheduling..." : "Schedule Post"}
        </button>
      </div>
    </form>
  );
}
