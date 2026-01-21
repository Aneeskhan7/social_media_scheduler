import { useEffect, useState } from "react";
import API from "../api/axios";

export default function PostList({ refreshTrigger , onPostChanged }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Snackbar
  const [snackbar, setSnackbar] = useState("");

  // Edit modal
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Delete confirm
  const [deletePostId, setDeletePostId] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const showSnackbar = (message) => {
    setSnackbar(message);
    setTimeout(() => setSnackbar(""), 2500);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/posts/${deletePostId}`);
      setPosts((prev) => prev.filter((p) => p._id !== deletePostId));
      onPostChanged();
      showSnackbar("Post deleted successfully");
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to delete post");
    } finally {
      setDeletePostId(null);
    }
  };

  const updatePost = async () => {
    if (!editContent.trim()) {
      showSnackbar("Post content cannot be empty");
      return;
    }

    try {
      const res = await API.put(`/posts/${editingPost._id}`, {
        content: editContent.trim(),
      });

      setPosts((prev) =>
        prev.map((p) => (p._id === res.data._id ? res.data : p)),
      );

      setEditingPost(null);
      showSnackbar("Post updated successfully");
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="text-slate-500">Loading posts...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No posts yet</div>
        ) : (
          posts.map((p) => (
            <div
              key={p._id}
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition"
            >
              <p className="text-slate-800 mb-3">{p.content}</p>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    p.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {p.status}
                </span>

                <span className="text-xs text-slate-400">
                  {new Date(p.scheduledTime).toLocaleString()}
                </span>
              </div>

              {p.status !== "published" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingPost(p);
                      setEditContent(p.content);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeletePostId(p._id)}
                    className="px-4 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Edit Post</h3>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-3 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded-lg bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={updatePost}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM SNACKBAR */}
      {deletePostId && (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-snackbar">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Delete Post?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletePostId(null)}
                className="px-4 py-2 rounded-lg bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS / ERROR SNACKBAR */}
      {/* SUCCESS / ERROR SNACKBAR */}
      {snackbar && (
        <div className="fixed top-4 right-160 z-[999] animate-snackbar">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            <p className="text-sm font-medium">{snackbar}</p>
          </div>
        </div>
      )}
    </>
  );
}
