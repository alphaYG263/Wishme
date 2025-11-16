// src/pages/BirthdayView.tsx - UPDATED
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WishRenderer from "@/components/output/WishRenderer";
import CommentSection from "@/components/output/CommentSection";

interface WishData {
  id: string;
  recipient_name: string;
  birthday_date: string;
  custom_url: string;
  privacy: string;
  password_hash: string | null;
  gradient: string;
  note_message: string | null;
  note_author: string;
  music_type: "preset" | "custom";
  music_preset: string | null;
  music_url: string | null;
}

interface Slide {
  id: string;
  image_url: string;
  frame_shape: string;
  slide_name: string;
  transition: string;
  order_index: number;
}

const BirthdayView = () => {
  const { region, vipSlot, wishName } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState<WishData | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchWishData();
  }, [region, vipSlot, wishName]);

  const fetchWishData = async () => {
    try {
      const customUrl = vipSlot
        ? `${region}/${vipSlot}/${wishName}`
        : `${region}/${wishName}`;

      // Fetch wish data
      const { data: wishData, error: wishError } = await supabase
        .from("wishes")
        .select("*")
        .eq("custom_url", customUrl)
        .single();

      if (wishError) throw wishError;
      if (!wishData) {
        toast.error("Wish not found");
        navigate("/");
        return;
      }

      if (wishData.status === "expired") {
        navigate(`/wish/${wishData.id}/expired`);
        return;
      }

      // Check for password protection
      if (wishData.privacy === "private" && wishData.password_hash) {
        setWish(wishData);
        setShowPasswordForm(true);
        setLoading(false);
        return;
      }

      // Fetch slides
      const { data: slidesData, error: slidesError } = await supabase
        .from("wish_slides")
        .select("*")
        .eq("wish_id", wishData.id)
        .order("order_index", { ascending: true });

      if (slidesError) throw slidesError;

      setWish(wishData);
      setSlides(slidesData || []);

      // Update view count and status
      await supabase
        .from("wishes")
        .update({
          status: "active",
          views_count: (wishData.views_count || 0) + 1,
        })
        .eq("id", wishData.id);
    } catch (error: any) {
      console.error("Error fetching wish:", error);
      toast.error(error.message || "Failed to load birthday wish");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === wish?.password_hash) {
      setShowPasswordForm(false);
      fetchWishData();
    } else {
      toast.error("Incorrect password");
      setPassword("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-600" />
          <p className="text-gray-700">Loading birthday wish...</p>
        </div>
      </div>
    );
  }

  // Password prompt UI
  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-pink-200 animate-scale-in shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-full bg-pink-100 mb-4">
              <Lock className="w-8 h-8 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Password Protected
            </h2>
            <p className="text-gray-600">This birthday wish is private</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="rounded-2xl bg-white/50 border-pink-300 h-12"
              required
              autoFocus
            />
            <Button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white h-12 font-semibold hover:opacity-90"
            >
              Unlock Birthday Wish
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (!wish) return null;

  return (
    <div className="relative">
      {/* Wish Renderer */}
      <WishRenderer
        gradient={wish.gradient}
        slides={slides}
        noteMessage={wish.note_message || ""}
        noteAuthor={wish.note_author}
        musicType={wish.music_type}
        musicUrl={wish.music_url}
        musicPreset={wish.music_preset}
      />

      {/* Comment Section */}
      <CommentSection wishId={wish.id} />
    </div>
  );
};

export default BirthdayView;