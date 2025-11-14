import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { StepProps } from "@/pages/CreateWish";

const StepImages = ({ data, onUpdate }: StepProps) => {
  const maxImages = 5;
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    onUpdate({ images: [...data.images, ...arr].slice(0, maxImages) });
  };

  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">

      <h2 className="text-3xl font-bold mb-2">Upload Photos</h2>
      <p className="text-muted-foreground mb-4">
        Add up to {maxImages} images
      </p>

      <div
        className="border-2 border-dashed rounded-3xl p-12 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="w-12 h-12 text-primary mx-auto" />

        <input
          type="file"
          className="hidden"
          id="imageUpload"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Button
          className="rounded-2xl mt-4"
          onClick={() => document.getElementById("imageUpload")?.click()}
        >
          Choose Images
        </Button>
      </div>

      {data.images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.images.map((file, index) => (
            <Card key={index} className="relative rounded-2xl overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>

              <Button
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                variant="destructive"
                onClick={() => {
                  const updated = data.images.filter((_, i) => i !== index);
                  onUpdate({ images: updated });
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepImages;
