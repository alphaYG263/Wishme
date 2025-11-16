// src/components/wizard/StepName.tsx
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WishFormData } from "@/lib/types/wish.types";
import { Gift, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
            Enter their name and birthday date
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Recipient Name */}
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
            className="rounded-2xl h-14 text-lg select-none"
            autoFocus
            maxLength={100}
          />
          <p className="text-sm text-muted-foreground">
            This name will appear throughout the birthday wish
          </p>
        </div>

        {/* Birthday Date Picker */}
        <div className="space-y-2">
          <Label className="text-base flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Birthday Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full rounded-2xl h-14 text-lg justify-start text-left font-normal",
                  !data.birthdayDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {data.birthdayDate ? (
                  format(new Date(data.birthdayDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.birthdayDate ? new Date(data.birthdayDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    onUpdate({ birthdayDate: date.toISOString() });
                  }
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground">
            The wish will be revealed on this date
          </p>
        </div>

        {/* Preview */}
        {data.recipientName && data.birthdayDate && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <p className="text-2xl font-bold text-center">
              Happy Birthday, {data.recipientName}! 🎉
            </p>
            <p className="text-center text-muted-foreground mt-2">
              on {format(new Date(data.birthdayDate), "MMMM dd, yyyy")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepName;

