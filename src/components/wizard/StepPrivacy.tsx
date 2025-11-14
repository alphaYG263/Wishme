import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Lock, Check } from "lucide-react";

interface StepPrivacyProps {
  data: { privacy: string; password: string };
  onUpdate: (data: Partial<{ privacy: string; password: string }>) => void;
}

const StepPrivacy = ({ data, onUpdate }: StepPrivacyProps) => {
  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Privacy Settings</h2>
        <p className="text-muted-foreground">
          Control who can access this birthday wish
        </p>
      </div>

      <RadioGroup
        value={data.privacy}
        onValueChange={(value) => onUpdate({ privacy: value })}
        className="space-y-4"
      >
        {/* Public Option */}
        <Card
          className={`rounded-2xl p-6 cursor-pointer transition-all card-lifted ${
            data.privacy === "public" ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onUpdate({ privacy: "public" })}
        >
          <div className="flex items-start gap-4">
            <RadioGroupItem value="public" id="public" className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor="public"
                className="text-lg font-semibold cursor-pointer flex items-center gap-3 mb-2"
              >
                <div className="p-2 rounded-xl bg-primary/10">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                Public
              </Label>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view this birthday wish. Perfect for
                sharing on social media or with large groups.
              </p>
              {data.privacy === "public" && (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
                  <Check className="w-4 h-4" />
                  Selected
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Private Option */}
        <Card
          className={`rounded-2xl p-6 cursor-pointer transition-all card-lifted ${
            data.privacy === "private" ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onUpdate({ privacy: "private" })}
        >
          <div className="flex items-start gap-4">
            <RadioGroupItem value="private" id="private" className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor="private"
                className="text-lg font-semibold cursor-pointer flex items-center gap-3 mb-2"
              >
                <div className="p-2 rounded-xl bg-secondary/20">
                  <Lock className="w-5 h-5 text-secondary" />
                </div>
                Private (Password Protected)
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Only people with the password can view this wish. Great for
                keeping surprises extra secure.
              </p>

              {data.privacy === "private" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm">
                      Set Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter a secure password"
                      value={data.password}
                      onChange={(e) => onUpdate({ password: e.target.value })}
                      className="rounded-xl"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <p className="text-xs text-muted-foreground">
                      Share this password only with intended recipients
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
                    <Check className="w-4 h-4" />
                    Selected
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </RadioGroup>

      {/* Info Box */}
      <div className="mt-8 p-6 rounded-2xl bg-muted/50">
        <h4 className="font-medium mb-2">💡 Privacy Tip</h4>
        <p className="text-sm text-muted-foreground">
          You can always change these settings later from your dashboard. Public
          wishes are great for celebrations, while private wishes are perfect for
          intimate surprises.
        </p>
      </div>
    </div>
  );
};

export default StepPrivacy;
