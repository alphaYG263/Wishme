// src/pages/Login.tsx - Add this at the top of the component

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Add this import

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Clear any stale sessions on component mount
  useEffect(() => {
    const clearStaleSession = async () => {
      // Only clear if we're not authenticated
      if (!user && !authLoading) {
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      }
    };
    clearStaleSession();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User logged in, redirecting...', user.id);
      navigate("/bestwishes/home");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isSignUp && (!username || !region)) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // ✅ Clear any existing sessions before signup
        await supabase.auth.signOut();
        
        await signUp(email, password, username, region);
        toast.success("Account created successfully! Logging you in...");
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate("/bestwishes/home");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-soft">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-soft p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Hero Section */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-primary rounded-3xl text-white">
          <div className="text-8xl mb-6 animate-float">🎁</div>
          <h2 className="text-4xl font-bold mb-4">Create Magical Moments</h2>
          <p className="text-white/80 text-center text-lg">
            Design beautiful birthday wishes with countdowns, photos, and music
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl card-lifted">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl gradient-primary">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              BestWishes
            </h1>
          </div>

          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            {isSignUp ? "Create an account" : "Welcome back!"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignUp
              ? "Sign up to create magical birthday wishes"
              : "Sign in to access your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isSignUp}
                  className="rounded-2xl"
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password * (min 6 characters)</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-2xl"
                disabled={loading}
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Select 
                  value={region} 
                  onValueChange={setRegion} 
                  required={isSignUp}
                  disabled={loading}
                >
                  <SelectTrigger id="region" className="rounded-2xl">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AS">Asia (AS)</SelectItem>
                    <SelectItem value="EU">Europe (EU)</SelectItem>
                    <SelectItem value="NA">North America (NA)</SelectItem>
                    <SelectItem value="SA">South America (SA)</SelectItem>
                    <SelectItem value="AF">Africa (AF)</SelectItem>
                    <SelectItem value="OC">Oceania (OC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-2xl h-12 text-base font-medium gradient-primary border-0 hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                isSignUp ? "Sign Up" : "Sign In"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setUsername("");
                      setRegion("");
                    }}
                    className="text-primary font-medium hover:underline"
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-primary font-medium hover:underline"
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

