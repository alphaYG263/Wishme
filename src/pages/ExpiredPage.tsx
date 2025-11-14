// src/pages/ExpiredPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Calendar, Home, Loader2 } from "lucide-react";

interface WishData {
  id: string;
  recipient_name: string;
  birthday_date: string;
}

const ExpiredPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState<WishData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWish();
  }, [id]);

  const fetchWish = async () => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('id, recipient_name, birthday_date')
        .eq('id', id)
        .single();

      if (error) throw error;
      setWish(data);
    } catch (error: any) {
      console.error('Error fetching wish:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const birthdayDate = wish ? new Date(wish.birthday_date) : new Date();

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        {/* Icon */}
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-muted rounded-full blur-3xl opacity-50" />
          <div className="relative text-8xl opacity-30 grayscale">🎂</div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            This Birthday Wish Has Ended
          </h1>
          {wish && (
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              The celebration for {wish.recipient_name} has passed, but the memories will last forever.
            </p>
          )}
        </div>

        {/* Info Card */}
        {wish && (
          <div className="bg-card p-8 rounded-3xl shadow-lg border border-border max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-muted-foreground" />
              <p className="text-muted-foreground">
                This wish expired on
              </p>
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {birthdayDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="rounded-2xl gradient-primary border-0 hover:opacity-90 gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/bestwishes/create")}
            className="rounded-2xl gap-2"
          >
            Create New Wish
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Want to preserve this wish? Upgrade to Premium for unlimited access to past wishes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpiredPage;