import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WishData {
  id: string;
  recipient_name: string;
  birthday_date: string;
  birthday_time?: string | null;
  privacy: string;
  password_hash?: string | null;
  status: string;
  views_count?: number;
}

const WaitingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState<WishData | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    fetchWish();
  }, [id]);

  useEffect(() => {
    if (wish) {
      const timer = setInterval(() => {
        calculateTimeLeft();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [wish]);

  const fetchWish = async () => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error("Wish not found");
        navigate("/");
        return;
      }

      // Check if wish is expired
      if (data.status === 'expired') {
        navigate(`/wish/${id}/expired`);
        return;
      }

      // Check if birthday has arrived
      const now = new Date();
      const timePart = data.birthday_time ?? '00:00:00';
      const birthdayDateTime = new Date(`${data.birthday_date}T${timePart}`);
      
      if (now >= birthdayDateTime) {
        // Check privacy before redirecting
        if (data.privacy === 'private' && data.password_hash) {
          setShowPasswordForm(true);
        } else {
          // Update view count
          await supabase
            .from('wishes')
            .update({ views_count: (data.views_count ?? 0) + 1 })
            .eq('id', id);
          
          navigate(`/wish/${id}/view`);
          return;
        }
      }

      setWish(data);
      calculateTimeLeft();
    } catch (error: any) {
      console.error('Error fetching wish:', error);
      toast.error(error.message || 'Failed to load wish');
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    if (!wish) return;

    const now = new Date().getTime();
    const timePart = wish.birthday_time ?? '00:00:00';
    const birthday = new Date(`${wish.birthday_date}T${timePart}`).getTime();
    const difference = birthday - now;

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    } else {
      // Birthday has arrived!
      if (wish.privacy === 'private' && wish.password_hash) {
        setShowPasswordForm(true);
      } else {
        navigate(`/wish/${id}/view`);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check (in production, use proper hashing)
    if (wish?.password_hash === password) {
      // Update view count
      await supabase
        .from('wishes')
        .update({ views_count: (wish.views_count ?? 0) + 1 })
        .eq('id', id);
      
      navigate(`/wish/${id}/view`);
    } else {
      toast.error("Incorrect password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Loading your surprise...</p>
        </div>
      </div>
    );
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-full bg-white/20 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Password Protected
            </h2>
            <p className="text-white/80">
              This wish requires a password to view
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Enter Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Enter the password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-2xl bg-white text-primary hover:bg-white/90"
            >
              Unlock Wish
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (!wish) return null;

  const birthdayDate = new Date(wish.birthday_date);

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/10 animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white/10 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-28 h-28 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Main Content */}
      <div className="max-w-2xl w-full text-center relative z-10 animate-fade-in">
        {/* Gift Box Animation */}
        <div className="mb-12 inline-block animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse-soft" />
            <div className="relative text-9xl">🎁</div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-12 text-white space-y-4">
          <p className="text-2xl md:text-3xl font-light animate-fade-in" style={{ animationDelay: "200ms" }}>
            A magical surprise for
          </p>
          <h1 className="text-4xl md:text-6xl font-bold animate-fade-in" style={{ animationDelay: "400ms" }}>
            {wish.recipient_name}
          </h1>
          <p className="text-lg md:text-xl text-white/80 animate-fade-in" style={{ animationDelay: "600ms" }}>
            arrives on {birthdayDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {wish.birthday_time && (
            <p className="text-md text-white/70">
              at {wish.birthday_time}
            </p>
          )}
        </div>

        {/* Countdown Timer */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 animate-scale-in" style={{ animationDelay: "800ms" }}>
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((unit, index) => (
              <div key={unit.label} className="animate-fade-in" style={{ animationDelay: `${1000 + index * 100}ms` }}>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-3">
                  <span className="text-4xl md:text-6xl font-bold text-white tabular-nums">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm md:text-base text-white/80 font-medium uppercase tracking-wide">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <p className="mt-12 text-white/70 text-sm md:text-base animate-fade-in" style={{ animationDelay: "1400ms" }}>
          ✨ Something special is waiting for you ✨
        </p>
      </div>
    </div>
  );
};

export default WaitingPage;