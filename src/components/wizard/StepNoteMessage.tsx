// src/components/wizard/StepNoteMessage.tsx
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles } from "lucide-react";
import { StepProps } from "@/pages/CreateWish";

const StepNoteMessage = ({ data, onUpdate }: StepProps) => {
  const maxChars = 500;
  const currentLength = data.noteMessage?.length || 0;

  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Add a Personal Message</h2>
        </div>
        <p className="text-muted-foreground">
          Write a heartfelt birthday message for {data.name || "your loved one"}
        </p>
      </div>

      {/* Sample Messages for Inspiration */}
      <div className="mb-6 p-4 rounded-2xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Need inspiration? Try these:
          </p>
        </div>
        <div className="grid gap-2">
          {[
            "May your birthday be filled with endless joy, laughter, and unforgettable moments! 🎉",
            "Wishing you a year ahead filled with love, success, and all your heart desires! 💖",
            "Happy Birthday! You deserve all the happiness in the world today and always! 🎂"
          ].map((sample, index) => (
            <button
              key={index}
              onClick={() => onUpdate({ noteMessage: sample })}
              className="text-left p-3 rounded-xl bg-card hover:bg-accent transition-colors text-sm"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="noteMessage" className="text-base">
            Your Birthday Message
          </Label>
          <Badge 
            variant={currentLength > maxChars ? "destructive" : "secondary"}
            className="rounded-xl"
          >
            {currentLength}/{maxChars}
          </Badge>
        </div>
        
        <Textarea
          id="noteMessage"
          placeholder="Write your heartfelt message here..."
          value={data.noteMessage || ""}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              onUpdate({ noteMessage: e.target.value });
            }
          }}
          className="min-h-[200px] rounded-2xl text-base resize-none"
          maxLength={maxChars}
        />
        
        <p className="text-sm text-muted-foreground">
          This message will be displayed beautifully on the birthday wish page
        </p>
      </div>

      {/* Preview */}
      {data.noteMessage && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border border-pink-200 dark:border-pink-800">
          <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Preview
          </p>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {data.noteMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepNoteMessage;