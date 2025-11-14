import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Music, Check } from "lucide-react";

const songs = [
  { id: "happy", name: "Happy Birthday Classic", duration: "2:30", genre: "Traditional" },
  { id: "jazz", name: "Birthday Jazz", duration: "3:15", genre: "Jazz" },
  { id: "upbeat", name: "Celebration Time", duration: "2:45", genre: "Pop" },
  { id: "soft", name: "Gentle Wishes", duration: "3:00", genre: "Ambient" },
  { id: "party", name: "Party Vibes", duration: "2:50", genre: "Dance" },
  { id: "acoustic", name: "Acoustic Dreams", duration: "3:20", genre: "Acoustic" },
];

interface StepSongProps {
  data: { song: string };
  onUpdate: (data: { song: string }) => void;
}

const StepSong = ({ data, onUpdate }: StepSongProps) => {
  const [playing, setPlaying] = useState<string | null>(null);

  const togglePlay = (songId: string) => {
    if (playing === songId) {
      setPlaying(null);
    } else {
      setPlaying(songId);
    }
  };

  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Background Music</h2>
        <p className="text-muted-foreground">
          Select a song to play during the birthday wish reveal
        </p>
      </div>

      <div className="space-y-4">
        {songs.map((song) => (
          <Card
            key={song.id}
            className={`rounded-2xl p-4 cursor-pointer transition-all card-lifted ${
              data.song === song.id ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
            onClick={() => onUpdate({ song: song.id })}
          >
            <div className="flex items-center gap-4">
              {/* Play Button */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay(song.id);
                }}
              >
                {playing === song.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </Button>

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{song.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{song.genre}</span>
                  <span>•</span>
                  <span>{song.duration}</span>
                </div>
              </div>

              {/* Selection Indicator */}
              {data.song === song.id && (
                <div className="p-2 rounded-full bg-primary text-primary-foreground">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-muted/50 flex items-start gap-4">
        <Music className="w-6 h-6 text-primary shrink-0 mt-1" />
        <div>
          <h4 className="font-medium mb-1">Custom Music</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Want to use your own song? Upload a custom track with Premium.
          </p>
          <Button variant="outline" size="sm" className="rounded-xl">
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepSong;
