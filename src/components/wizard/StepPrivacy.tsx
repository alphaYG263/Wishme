import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Lock, Check } from "lucide-react";
import { StepProps } from "@/pages/CreateWish";

const StepPrivacy = ({ data, onUpdate }: StepProps) => {
  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">

      <h2 className="text-3xl font-bold mb-2">Privacy Settings</h2>
      <p className="text-muted-foreground mb-6">
        Control who can access your birthday wish
      </p>

      <RadioGroup
        value={data.privacy}
        onValueChange={(v) => onUpdate({ privacy: v })}
        className="space-y-4"
      >

        {/* Public */}
        <Card
          className={`p-6 rounded-2xl cursor-pointer ${
            data.privacy === "public" ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onUpdate({ privacy: "public" })}
        >
          <div className="flex items-start gap-4">
            <RadioGroupItem value="public" />
            <div>
              <Label className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Public
              </Label>

              {data.privacy === "public" && (
                <p className="text-primary flex items-center gap-2 mt-1">
                  <Check className="w-4 h-4" /> Selected
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Private */}
        <Card
          className={`p-6 rounded-2xl cursor-pointer ${
            data.privacy === "private" ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onUpdate({ privacy: "private" })}
        >
          <div className="flex items-start gap-4">
            <RadioGroupItem value="private" />
            <div>
              <Label className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-secondary" /> Private
              </Label>

              {data.privacy === "private" && (
                <>
                  <Input
                    placeholder="Set a password"
                    type="password"
                    value={data.password}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdate({ password: e.target.value })}
                    className="mt-3 rounded-xl"
                  />

                  <p className="text-primary mt-2 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Selected
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>
      </RadioGroup>
    </div>
  );
};

export default StepPrivacy;
