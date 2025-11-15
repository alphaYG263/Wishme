// src/components/wizard/StepSong.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Check } from "lucide-react";
import { StepProps } from "@/pages/CreateWish";

const songs = [
  { id: "happy", name: "Happy Birthday Classic", duration: "2:30", genre: "Traditional" },
  { id: "jazz", name: "Birthday Jazz", duration: "3:15", genre: "Jazz" },
  { id: "upbeat", name: "Celebration Time", duration: "2:45", genre: "Pop" },
  { id: "soft", name: "Gentle Wishes", duration: "3:00", genre: "Ambient" },
  { id: "party", name: "Party Vibes", duration: "2:50", genre: "Dance" },
  { id: "acoustic", name: "Acoustic Dreams", duration: "3:20", genre: "Acoustic" },
];

const StepSong = ({ data, onUpdate }: StepProps) => {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold mb-2">Choose Background Music</h2>
      <p className="text-muted-foreground mb-6">
        Select a song to play during the reveal
      </p>

      <div className="space-y-4">
        {songs.map((song) => (
          <Card
            key={song.id}
            onClick={() => onUpdate({ song: song.id })}
            className={`p-4 cursor-pointer card-lifted rounded-2xl transition-all ${
              data.song === song.id ? "ring-2 ring-primary bg-primary/10" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaying(playing === song.id ? null : song.id);
                }}
              >
                {playing === song.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <div className="flex-1">
                <h3 className="font-semibold">{song.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {song.genre} • {song.duration}
                </p>
              </div>

              {data.song === song.id && (
                <div className="p-2 rounded-full bg-primary text-white shrink-0">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StepSong;
