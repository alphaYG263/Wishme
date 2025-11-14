import { Button } from "@/components/ui/button";
import { Calendar, Home } from "lucide-react";

const ExpiredPage = () => {
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
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            The celebration has passed, but the memories will last forever.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-card p-8 rounded-3xl shadow-lg border border-border max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-muted-foreground" />
            <p className="text-muted-foreground">
              This wish expired on
            </p>
          </div>
          <p className="text-2xl font-semibold text-foreground">
            November 10, 2025
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button
            size="lg"
            className="rounded-2xl gradient-primary border-0 hover:opacity-90 gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Button>
          <Button
            size="lg"
            variant="outline"
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
