// src/components/output/CommentSection.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  wish_id: string;
  user_id: string | null;
  username: string;
  message: string;
  created_at: string;
}

interface CommentSectionProps {
  wishId: string;
}

const CommentSection = ({ wishId }: CommentSectionProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [needsGuestName, setNeedsGuestName] = useState(false);

  const maxChars = 500;

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [wishId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wish_comments")
        .select("*")
        .eq("wish_id", wishId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToComments = () => {
    const subscription = supabase
      .channel(`comments-${wishId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wish_comments",
          filter: `wish_id=eq.${wishId}`,
        },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // Check if guest needs to provide name
    if (!user && !guestName.trim()) {
      setNeedsGuestName(true);
      toast.error("Please enter your name");
      return;
    }

    if (newComment.length > maxChars) {
      toast.error(`Comment must be under ${maxChars} characters`);
      return;
    }

    setSubmitting(true);

    try {
      const username = user?.user_metadata?.username || guestName.trim();

      const { error } = await supabase.from("wish_comments").insert({
        wish_id: wishId,
        user_id: user?.id || null,
        username,
        message: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      setNeedsGuestName(false);
      toast.success("Comment posted!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-30 w-full max-w-md transition-all duration-300"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isHovered ? 1 : 0.3, x: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ maxWidth: "400px" }}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-200 dark:border-pink-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-pink-200 dark:border-pink-800 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-500/20">
              <MessageCircle className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Comments
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
              </p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No comments yet</p>
              <p className="text-xs mt-1">Be the first to leave a message!</p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {comment.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                          {comment.username}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {formatDate(comment.created_at)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Comment Form */}
        <div className="p-4 border-t border-pink-200 dark:border-pink-800">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Guest Name Input */}
            {!user && needsGuestName && (
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-sm">
                  Your Name
                </Label>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  className="rounded-xl"
                  maxLength={50}
                  required
                />
              </div>
            )}

            {/* Comment Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="newComment" className="text-sm">
                  {user ? "Leave a comment" : "Leave a comment (as guest)"}
                </Label>
                <Badge
                  variant={newComment.length > maxChars ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {newComment.length}/{maxChars}
                </Badge>
              </div>
              <Textarea
                id="newComment"
                value={newComment}
                onChange={(e) => {
                  if (e.target.value.length <= maxChars) {
                    setNewComment(e.target.value);
                  }
                }}
                placeholder="Write something nice..."
                className="rounded-xl resize-none text-sm"
                rows={3}
                maxLength={maxChars}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </Button>

            {!user && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Comments are posted as guest
              </p>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentSection;