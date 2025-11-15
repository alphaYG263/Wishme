// src/components/wizard/StepMusic.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Upload, Crown, Music } from "lucide-react";
import { toast } from "sonner";
import { WishFormData } from "@/lib/types/wish.types";
import { MUSIC_PRESETS, MAX_CUSTOM_MUSIC_SIZE, ALLOWED_MUSIC_FORMATS } from "@/lib/constants/music";

interface StepMusicProps {
  data: WishFormData;
  onUpdate: (data: Partial<WishFormData>) => void;
  isPremium: boolean;
}

const StepMusic = ({ data, onUpdate, isPremium }: StepMusicProps) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_MUSIC_FORMATS.includes(file.type)) {
      toast.error('Please upload an MP3, WAV, or OGG file');
      return;
    }

    // Validate file size
    if (file.size > MAX_CUSTOM_MUSIC_SIZE) {
      toast.error('Music file must be less than 10MB');
      return;
    }

    setUploadedFileName(file.name);
    onUpdate({
      musicType: 'custom',
      musicFile: file,
      musicPreset: undefined
    });
    toast.success('Music uploaded successfully!');
  };

  const selectPreset = (presetId: string) => {
    onUpdate({
      musicType: 'preset',
      musicPreset: presetId,
      musicFile: undefined
    });
    setUploadedFileName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Choose Background Music</h2>
            <p className="text-muted-foreground">
              Select a song to play during the wish
            </p>
          </div>
        </div>

        {!isPremium && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <p className="text-sm">
                <strong>Upgrade to Premium</strong> to upload your own music!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Upload (Premium Only) */}
      {isPremium && (
        <div className="bg-card p-8 rounded-3xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Upload Custom Music
          </h3>

          <div
            onClick={() => document.getElementById('music-upload')?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              data.musicType === 'custom'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary'
            }`}
          >
            {uploadedFileName ? (
              <div>
                <Music className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="font-medium">{uploadedFileName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click to change music
                </p>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">Click to upload your music</p>
                <p className="text-sm text-muted-foreground mt-1">
                  MP3, WAV, OGG up to 10MB
                </p>
              </div>
            )}
          </div>

          <input
            id="music-upload"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleMusicUpload}
          />
        </div>
      )}

      {/* Music Presets */}
      <div className="bg-card p-8 rounded-3xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">
          {isPremium ? 'Or Choose a Preset' : 'Choose from Our Collection'}
        </h3>

        <div className="space-y-3">
          {MUSIC_PRESETS.map((preset) => (
            <Card
              key={preset.id}
              onClick={() => selectPreset(preset.id)}
              className={`p-4 cursor-pointer transition-all ${
                data.musicType === 'preset' && data.musicPreset === preset.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaying(playing === preset.id ? null : preset.id);
                  }}
                >
                  {playing === preset.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <div className="flex-1">
                  <h4 className="font-semibold">{preset.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {preset.genre} • {preset.duration}
                  </p>
                </div>

                {data.musicType === 'preset' && data.musicPreset === preset.id && (
                  <Badge className="bg-primary">Selected</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-muted/50 p-6 rounded-2xl border border-border">
        <p className="text-sm text-muted-foreground text-center">
          🎵 Music will play automatically when the wish is viewed
        </p>
      </div>
    </div>
  );
};

export default StepMusic;