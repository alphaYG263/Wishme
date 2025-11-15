// src/components/wizard/StepName.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WishFormData } from "@/lib/types/wish.types";
import { Gift } from "lucide-react";

interface StepNameProps {
  data: WishFormData;
  onUpdate: (data: Partial<WishFormData>) => void;
}

const StepName = ({ data, onUpdate }: StepNameProps) => {
  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10">
          <Gift className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Who's the Birthday Star?</h2>
          <p className="text-muted-foreground">
            Enter the name of the person you're creating this wish for
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="recipientName" className="text-base">
            Recipient's Full Name *
          </Label>
          <Input
            id="recipientName"
            type="text"
            placeholder="e.g., Sarah Johnson"
            value={data.recipientName}
            onChange={(e) => onUpdate({ recipientName: e.target.value })}
            className="rounded-2xl h-14 text-lg"
            autoFocus
            maxLength={100}
          />
          <p className="text-sm text-muted-foreground">
            This name will appear throughout the birthday wish
          </p>
        </div>

        {/* Preview */}
        {data.recipientName && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <p className="text-2xl font-bold text-center">
              Happy Birthday, {data.recipientName}! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepName;

