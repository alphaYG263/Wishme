// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, username, region);
        toast.success("Account created! Please check your email to verify.");
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate("/bestwishes/home");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="rounded-2xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-2xl"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={region} onValueChange={setRegion} required>
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
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-primary font-medium hover:underline"
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
