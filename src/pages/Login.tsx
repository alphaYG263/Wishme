import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift } from "lucide-react";
import heroImage from "@/assets/birthday-hero.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to home after login
    navigate("/bestwishes/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-soft p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Hero Image */}
        <div className="hidden md:block">
          <img 
            src={heroImage} 
            alt="Birthday celebration" 
            className="w-full h-auto rounded-3xl shadow-2xl animate-float"
          />
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

          <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome back!</h2>
          <p className="text-muted-foreground mb-8">Sign in to create magical birthday wishes</p>

          <form onSubmit={handleLogin} className="space-y-6">
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

            <Button 
              type="submit" 
              className="w-full rounded-2xl h-12 text-base font-medium gradient-primary border-0 hover:opacity-90 transition-opacity"
            >
              Sign In
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full rounded-2xl h-12 text-base"
            >
              Setup Google Authenticator
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
