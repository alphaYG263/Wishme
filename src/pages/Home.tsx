// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, LogOut, Loader2, RefreshCw, ExternalLink, Copy, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import PremiumBanner from "@/components/PremiumBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Wish {
  id: string;
  recipient_name: string;
  template_id: string;
  status: "draft" | "scheduled" | "active" | "expired";
  birthday_date: string;
  created_at: string;
  custom_url: string;
  views_count: number;
}

const Home = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchWishes();
    }
  }, [user]);

// src/pages/Home.tsx - REPLACE fetchUserProfile function

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, region, is_premium')
        .eq('id', user?.id)
        .maybeSingle(); // ✅ Changed from .single() to .maybeSingle()

      if (error) {
        console.error('Profile fetch error:', error);
        // ✅ Use fallback data from user metadata
        setUsername(user?.user_metadata?.username || user?.email?.split('@')[0] || "User");
        setRegion(user?.user_metadata?.region || "Unknown");
        setIsPremium(false);
        
        // ✅ Try to create profile if it doesn't exist
        if (user?.id) {
          console.log('Profile not found, creating one...');
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
              region: user.user_metadata?.region || 'AS',
              is_premium: false,
              google_auth_enabled: false
            });
          
          if (createError) {
            console.error('Failed to create profile:', createError);
            toast.warning('Using temporary profile. Some features may be limited.');
          } else {
            toast.success('Profile created!');
            // Refresh to get new profile
            fetchUserProfile();
          }
        }
        return;
      }
      
      if (data) {
        setUsername(data.username);
        setRegion(data.region);
        setIsPremium(data.is_premium);
      } else {
        // ✅ No profile exists - use fallback
        setUsername(user?.user_metadata?.username || user?.email?.split('@')[0] || "User");
        setRegion(user?.user_metadata?.region || "Unknown");
        setIsPremium(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // ✅ Always provide fallback
      setUsername(user?.user_metadata?.username || user?.email?.split('@')[0] || "User");
      setRegion(user?.user_metadata?.region || "Unknown");
      setIsPremium(false);
    }
  };

  const fetchWishes = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      else setLoading(true);

      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishes(data || []);
      
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
    if (!confirm('Are you sure you want to delete this wish?')) return;

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

  const copyWishUrl = (customUrl: string) => {
    const fullUrl = `${window.location.origin}/${customUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('URL copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'active': return 'bg-green-500 text-white';
      case 'expired': return 'bg-red-500 text-white';
      default: return 'bg-muted text-muted-foreground';
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
              {isPremium && (
                <Badge className="rounded-xl px-3 py-1 gradient-primary text-white">
                  ⭐ Premium
                </Badge>
              )}
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
                <Card
                  key={wish.id}
                  className="rounded-3xl overflow-hidden border-0 bg-card card-lifted animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header with Gradient */}
                  <div className="h-32 gradient-hero flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-primary/30 animate-float" />
                      <div className="absolute bottom-2 right-2 w-16 h-16 rounded-full bg-secondary/30 animate-float" style={{ animationDelay: "1s" }} />
                    </div>
                    <p className="text-5xl font-bold text-white/90 z-10">
                      {wish.recipient_name.charAt(0)}
                    </p>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{wish.recipient_name}</h3>
                      <p className="text-sm text-muted-foreground">{wish.template_id}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`rounded-xl ${getStatusColor(wish.status)}`}>
                        {wish.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(wish.birthday_date).toLocaleDateString()}
                      </span>
                      {wish.views_count > 0 && (
                        <Badge variant="outline" className="rounded-xl">
                          <Eye className="w-3 h-3 mr-1" />
                          {wish.views_count}
                        </Badge>
                      )}
                    </div>

                    {/* URL Display */}
                    <div className="p-3 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-muted-foreground flex-1 font-mono truncate">
                          bestwishes.app/{wish.custom_url}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => copyWishUrl(wish.custom_url)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl gap-2"
                        onClick={() => window.open(`/${wish.custom_url}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => handleDeleteWish(wish.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Premium Banner */}
            {!isPremium && <PremiumBanner />}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
