import { Button } from "@/components/ui/button";
import { Sparkles, Star } from "lucide-react";

const PremiumBanner = () => {
  return (
    <div className="rounded-3xl gradient-primary p-8 md:p-12 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Star className="w-24 h-24 animate-pulse-soft" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-20">
        <Sparkles className="w-20 h-20 animate-float" />
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6" />
          <span className="text-sm font-semibold uppercase tracking-wide">Premium</span>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Unlock Unlimited Wishes
        </h3>
        
        <p className="text-white/90 mb-6 text-lg">
          Get access to exclusive templates, unlimited wishes, priority URLs, 
          and advanced customization options. Make every birthday unforgettable!
        </p>

        <div className="flex flex-wrap gap-4">
          <Button 
            size="lg" 
            className="rounded-2xl bg-white text-primary hover:bg-white/90 font-semibold"
          >
            Upgrade to Premium
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-2xl border-2 border-white text-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span>50+ Premium Templates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span>Custom URLs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span>Priority Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
