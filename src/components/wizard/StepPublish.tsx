import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Sparkles, Gift } from "lucide-react";

interface StepPublishProps {
  data: any;
  onUpdate: (data: any) => void;
}

const StepPublish = ({ data }: StepPublishProps) => {
  const [copied, setCopied] = useState(false);
  const generatedUrl = `bestwishes.app/wish/${data.name?.toLowerCase().replace(/\s+/g, "-") || "example"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Success Card */}
      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg text-center">
        <div className="inline-flex p-6 rounded-full gradient-primary mb-6 animate-pulse-soft">
          <Gift className="w-16 h-16 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold mb-3">
          Your Birthday Wish is Ready! 🎉
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Share this special moment with {data.name || "your loved one"}
        </p>

        {/* URL Display */}
        <div className="max-w-2xl mx-auto">
          <Label className="text-left block mb-3 text-base">
            Shareable Link
          </Label>
          <div className="flex gap-2">
            <Input
              value={generatedUrl}
              readOnly
              className="rounded-2xl h-14 text-base font-mono"
            />
            <Button
              onClick={handleCopy}
              className="rounded-2xl px-6 gradient-primary border-0"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-left">
            This link will show a countdown until the birthday date
          </p>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-card p-8 rounded-3xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Waiting Page Preview</h3>
        
        <div className="rounded-2xl gradient-hero p-8 text-center space-y-6 border-2 border-border">
          <div className="text-6xl animate-float">🎁</div>
          
          <div>
            <p className="text-lg text-foreground/80 mb-2">
              A special surprise awaits
            </p>
            <h4 className="text-3xl font-bold text-foreground">
              {data.name || "Someone Special"}
            </h4>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 inline-block">
            <p className="text-sm text-muted-foreground mb-3">
              Opens on {data.date ? new Date(data.date).toLocaleDateString() : "Birthday"}
            </p>
            <div className="flex justify-center gap-2 text-3xl font-mono font-bold">
              <div className="bg-background px-4 py-3 rounded-lg">12</div>
              <div>:</div>
              <div className="bg-background px-4 py-3 rounded-lg">34</div>
              <div>:</div>
              <div className="bg-background px-4 py-3 rounded-lg">56</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="rounded-xl px-4 py-2">
              {data.privacy === "private" ? "🔒 Password Protected" : "🌍 Public"}
            </Badge>
            <Badge variant="outline" className="rounded-xl px-4 py-2">
              Template: {data.template || "Not selected"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Upgrade Suggestion */}
      <div className="bg-card p-6 rounded-3xl shadow-lg gradient-primary text-white">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-2">
              Duplicate URL? Upgrade to Premium!
            </h4>
            <p className="text-white/90 text-sm mb-4">
              Get priority access to custom URLs, exclusive templates, and unlimited wishes.
            </p>
            <Button
              variant="secondary"
              className="rounded-xl bg-white text-primary hover:bg-white/90"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Button
          size="lg"
          className="rounded-2xl gradient-primary border-0 hover:opacity-90 gap-2"
        >
          <Check className="w-5 h-5" />
          Publish Wish
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-2xl gap-2"
        >
          <ExternalLink className="w-5 h-5" />
          Preview Full Page
        </Button>
      </div>
    </div>
  );
};

export default StepPublish;
