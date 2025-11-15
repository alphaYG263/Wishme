// src/components/wizard/StepNote.tsx
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Sparkles, Mail } from "lucide-react";
import { WishFormData } from "@/lib/types/wish.types";

interface StepNoteProps {
  data: WishFormData;
  onUpdate: (data: Partial<WishFormData>) => void;
  username: string;
}

const StepNote = ({ data, onUpdate, username }: StepNoteProps) => {
  const maxChars = 500;
  const currentLength = data.noteMessage?.length || 0;

  const sampleMessages = [
    "May your birthday be filled with endless joy, laughter, and unforgettable moments! 🎉",
    "Wishing you a year ahead filled with love, success, and all your heart desires! 💖",
    "Happy Birthday! You deserve all the happiness in the world today and always! 🎂",
    "Here's to another year of wonderful memories and amazing adventures! Enjoy your special day! ✨"
  ];

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Add Your Personal Note</h2>
            <p className="text-muted-foreground">
              Write a heartfelt message for {data.recipientName}
            </p>
          </div>
        </div>

        {/* Sample Messages */}
        <div className="mb-6 p-4 rounded-2xl bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Need inspiration? Click to use:
            </p>
          </div>
          <div className="grid gap-2">
            {sampleMessages.map((sample, index) => (
              <button
                key={index}
                onClick={() => onUpdate({ noteMessage: sample })}
                className="text-left p-3 rounded-xl bg-card hover:bg-accent transition-colors text-sm border border-transparent hover:border-primary/20"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="noteMessage" className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4" />
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
            This message will appear on a beautiful card after all slides are shown
          </p>
        </div>

        {/* Author Settings */}
        <div className="mt-6 space-y-4">
          <Label className="text-base">Message Author</Label>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30">
            <Checkbox
              id="useCustomAuthor"
              checked={data.useCustomAuthor}
              onCheckedChange={(checked) => {
                onUpdate({ 
                  useCustomAuthor: checked as boolean,
                  noteAuthor: checked ? "" : username
                });
              }}
            />
            <Label htmlFor="useCustomAuthor" className="cursor-pointer">
              Use a different name as author
            </Label>
          </div>

          {data.useCustomAuthor ? (
            <div className="space-y-2">
              <Label htmlFor="noteAuthor">Author Name</Label>
              <Input
                id="noteAuthor"
                value={data.noteAuthor || ""}
                onChange={(e) => onUpdate({ noteAuthor: e.target.value })}
                placeholder="Enter author name"
                className="rounded-2xl"
                maxLength={50}
              />
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-sm">
                Signed as: <strong>{username}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Card */}
      {data.noteMessage && (
        <div className="bg-card p-8 rounded-3xl shadow-lg">
          <p className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Preview
          </p>
          
          {/* Note Card Preview */}
          <div className="relative">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-2 border-pink-200 dark:border-pink-800 shadow-xl">
              <div className="mb-6">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-pulse" />
              </div>
              
              <p className="text-lg leading-relaxed whitespace-pre-wrap text-center mb-8">
                {data.noteMessage}
              </p>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground italic">
                  - {data.useCustomAuthor && data.noteAuthor ? data.noteAuthor : username}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-3">
              This card will elegantly appear after all slides are shown
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepNote;