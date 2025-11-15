// src/components/wizard/StepSlides.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, Crown } from "lucide-react";
import { toast } from "sonner";
import { WishFormData, Slide } from "@/lib/types/wish.types";
import { FRAME_SHAPES } from "@/lib/constants/frameShapes";
import { TRANSITIONS } from "@/lib/constants/transitions";

interface StepSlidesProps {
  data: WishFormData;
  onUpdate: (data: Partial<WishFormData>) => void;
  isPremium: boolean;
}

const StepSlides = ({ data, onUpdate, isPremium }: StepSlidesProps) => {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  
  const maxSlides = isPremium ? 10 : 3;
  const currentSlide = data.slides[selectedSlideIndex];

  const handleAddSlide = () => {
    if (data.slides.length >= maxSlides) {
      toast.error(`Maximum ${maxSlides} slides allowed${!isPremium ? ' for free users' : ''}`);
      return;
    }

    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      frameShape: 'rectangle',
      imageUrl: '',
      slideName: `Slide ${data.slides.length + 1}`,
      transition: 'fade',
      order: data.slides.length
    };

    onUpdate({ slides: [...data.slides, newSlide] });
    setSelectedSlideIndex(data.slides.length);
  };

  const handleDeleteSlide = (index: number) => {
    if (data.slides.length <= 1) {
      toast.error("You must have at least one slide");
      return;
    }

    const updatedSlides = data.slides.filter((_, i) => i !== index);
    onUpdate({ slides: updatedSlides });
    setSelectedSlideIndex(Math.max(0, index - 1));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      const updatedSlides = [...data.slides];
      updatedSlides[selectedSlideIndex] = {
        ...currentSlide,
        imageUrl,
        imageFile: file
      };
      onUpdate({ slides: updatedSlides });
    };
    reader.readAsDataURL(file);
  };

  const updateSlideProperty = (property: keyof Slide, value: any) => {
    const updatedSlides = [...data.slides];
    updatedSlides[selectedSlideIndex] = {
      ...currentSlide,
      [property]: value
    };
    onUpdate({ slides: updatedSlides });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Create Your Slides</h2>
            <p className="text-muted-foreground">
              Design beautiful slides for {data.recipientName}
            </p>
          </div>
          <Badge variant="secondary" className="rounded-xl px-4 py-2">
            {data.slides.length} / {maxSlides} Slides
          </Badge>
        </div>

        {!isPremium && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <p className="text-sm">
                <strong>Upgrade to Premium</strong> to create up to 10 slides!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Slide Thumbnails */}
      <div className="bg-card p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {data.slides.map((slide, index) => (
            <Card
              key={slide.id}
              onClick={() => setSelectedSlideIndex(index)}
              className={`relative shrink-0 w-32 h-32 rounded-2xl cursor-pointer transition-all ${
                selectedSlideIndex === index
                  ? "ring-4 ring-primary scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.slideName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-2xl">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-2xl truncate">
                {slide.slideName}
              </div>

              {data.slides.length > 1 && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSlide(index);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}

              <Badge className="absolute top-2 left-2 text-xs">
                {index + 1}
              </Badge>
            </Card>
          ))}

          {data.slides.length < maxSlides && (
            <Button
              onClick={handleAddSlide}
              variant="outline"
              className="shrink-0 w-32 h-32 rounded-2xl border-2 border-dashed hover:border-primary transition-colors"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xs">Add Slide</span>
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Slide Editor */}
      <div className="bg-card p-8 rounded-3xl shadow-lg space-y-6">
        <h3 className="text-xl font-semibold">
          Editing: {currentSlide.slideName}
        </h3>

        {/* Frame Shape Selection */}
        <div className="space-y-3">
          <Label>Frame Shape</Label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {FRAME_SHAPES.map((shape) => (
              <Card
                key={shape.id}
                onClick={() => updateSlideProperty('frameShape', shape.id)}
                className={`relative p-4 cursor-pointer transition-all ${
                  currentSlide.frameShape === shape.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-auto"
                  style={{ aspectRatio: shape.aspectRatio }}
                >
                  <path
                    d={shape.svgPath}
                    fill="currentColor"
                    className="text-primary/30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <p className="text-xs text-center mt-2 font-medium">
                  {shape.name}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <Label>Upload Image</Label>
          <div
            onClick={() => document.getElementById(`image-upload-${selectedSlideIndex}`)?.click()}
            className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            {currentSlide.imageUrl ? (
              <div className="relative">
                <img
                  src={currentSlide.imageUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById(`image-upload-${selectedSlideIndex}`)?.click();
                  }}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">Click to upload image</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>
          <input
            id={`image-upload-${selectedSlideIndex}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Slide Name */}
        <div className="space-y-3">
          <Label>Slide Name</Label>
          <Input
            value={currentSlide.slideName}
            onChange={(e) => updateSlideProperty('slideName', e.target.value)}
            placeholder="Enter slide name"
            className="rounded-2xl"
            maxLength={50}
          />
        </div>

        {/* Transition Effect (only if not first slide) */}
        {selectedSlideIndex > 0 && (
          <div className="space-y-3">
            <Label>Transition Effect</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {TRANSITIONS.map((transition) => (
                <Card
                  key={transition.id}
                  onClick={() => updateSlideProperty('transition', transition.id)}
                  className={`p-4 cursor-pointer text-center transition-all ${
                    currentSlide.transition === transition.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-accent"
                  }`}
                >
                  <p className="text-sm font-medium">{transition.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {transition.duration}ms
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepSlides;