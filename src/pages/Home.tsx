// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, LogOut, Loader2, RefreshCw } from "lucide-react";
import WishCard from "@/components/WishCard";
import PremiumBanner from "@/components/PremiumBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Wish {
  id: string;
  recipient_name: string;
  template_id: string;
  status: "Draft" | "Scheduled" | "Active" | "Expired";
  birthday_date: string;
  created_at: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchWishes();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, region, is_premium')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        // Fallback to user metadata
        setUsername(user?.user_metadata?.username || user?.email?.split('@')[0] || "User");
        setRegion(user?.user_metadata?.region || "Unknown");
        return;
      }
      
      if (data) {
        setUsername(data.username);
        setRegion(data.region);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUsername(user?.user_metadata?.username || user?.email?.split('@')[0] || "User");
      setRegion(user?.user_metadata?.region || "Unknown");
    }
  };

  const fetchWishes = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      else setLoading(true);

      const { data, error } = await supabase
        .from('wishes')
        .select(`
          id,
          recipient_name,
          template_id,
          status,
          birthday_date,
          created_at
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database status to component expected format
      const mappedWishes = (data || []).map(wish => ({
        ...wish,
        status: capitalizeStatus(wish.status)
      }));

      setWishes(mappedWishes);
      
      if (showRefreshToast) {
        toast.success('Wishes refreshed');
      }
    } catch (error: any) {
      console.error('Error fetching wishes:', error);
      toast.error(error.message || 'Failed to load wishes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const capitalizeStatus = (status: string): "Draft" | "Scheduled" | "Active" | "Expired" => {
    const formatted = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return formatted as "Draft" | "Scheduled" | "Active" | "Expired";
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  const handleDeleteWish = async (wishId: string) => {
    try {
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', wishId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setWishes(wishes.filter(wish => wish.id !== wishId));
      toast.success('Wish deleted successfully');
    } catch (error: any) {
      console.error('Error deleting wish:', error);
      toast.error(error.message || 'Failed to delete wish');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your wishes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                BestWishes
              </h1>
              <Badge variant="secondary" className="rounded-xl px-3 py-1">
                {username}
              </Badge>
              <Badge variant="outline" className="rounded-xl px-3 py-1">
                {region}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => fetchWishes(true)}
                variant="ghost"
                size="icon"
                className="rounded-xl"
                disabled={refreshing}
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                onClick={() => navigate("/bestwishes/create")}
                className="rounded-2xl gradient-primary border-0 hover:opacity-90 gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Create Wish</span>
              </Button>

              <Button
                onClick={handleSignOut}
                variant="outline"
                className="rounded-2xl gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Your Birthday Wishes</h2>
          <p className="text-muted-foreground">
            Manage and track all your magical birthday surprises ({wishes.length} total)
          </p>
        </div>

        {/* Empty State */}
        {wishes.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-8xl mb-6 opacity-50">🎁</div>
            <h3 className="text-2xl font-semibold mb-3">No wishes yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first birthday wish to get started making someone's day extra special!
            </p>
            <Button
              onClick={() => navigate("/bestwishes/create")}
              size="lg"
              className="rounded-2xl gradient-primary border-0 hover:opacity-90 gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Wish
            </Button>
          </div>
        ) : (
          <>
            {/* Wishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {wishes.map((wish, index) => (
                <div
                  key={wish.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <WishCard
                    personName={wish.recipient_name}
                    template={wish.template_id || "Default Template"}
                    status={wish.status}
                    date={wish.birthday_date}
                    imageUrl=""
                    onDelete={() => handleDeleteWish(wish.id)}
                  />
                </div>
              ))}
            </div>

            {/* Premium Banner */}
            <PremiumBanner />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
