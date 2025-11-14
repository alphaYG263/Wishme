import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, Eye } from "lucide-react";
import WishCard from "@/components/WishCard";
import PremiumBanner from "@/components/PremiumBanner";

const mockWishes = [
  {
    id: "1",
    personName: "Sarah Johnson",
    template: "Sunset Dreams",
    status: "Active" as const,
    date: "2025-12-15",
    imageUrl: "",
  },
  {
    id: "2",
    personName: "Mike Chen",
    template: "Starry Night",
    status: "Scheduled" as const,
    date: "2025-11-20",
    imageUrl: "",
  },
  {
    id: "3",
    personName: "Emma Davis",
    template: "Garden Party",
    status: "Draft" as const,
    date: "2025-12-01",
    imageUrl: "",
  },
  {
    id: "4",
    personName: "Alex Rivera",
    template: "Ocean Breeze",
    status: "Expired" as const,
    date: "2025-11-10",
    imageUrl: "",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [username] = useState("JohnDoe");
  const [region] = useState("NA");

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

            <Button
              onClick={() => navigate("/bestwishes/create")}
              className="rounded-2xl gradient-primary border-0 hover:opacity-90 gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Wish
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Your Birthday Wishes</h2>
          <p className="text-muted-foreground">
            Manage and track all your magical birthday surprises
          </p>
        </div>

        {/* Wishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockWishes.map((wish, index) => (
            <div
              key={wish.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <WishCard {...wish} />
            </div>
          ))}
        </div>

        {/* Premium Banner */}
        <PremiumBanner />
      </main>
    </div>
  );
};

export default Home;
