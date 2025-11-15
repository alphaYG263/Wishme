// src/components/wizard/StepImages.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { StepProps } from "@/pages/CreateWish";
import { toast } from "sonner";

const StepImages = ({ data, onUpdate }: StepProps) => {
  const maxImages = 5;
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const totalFiles = data.images.length + newFiles.length;
    
    if (totalFiles > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Update data
    onUpdate({ images: [...data.images, ...validFiles].slice(0, maxImages) });
  };

  const removeImage = (index: number) => {
    const updated = data.images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    onUpdate({ images: updated });
    setPreviews(updatedPreviews);
  };

  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold mb-2">Upload Photos</h2>
      <p className="text-muted-foreground mb-4">
        Add up to {maxImages} images ({data.images.length} uploaded)
      </p>

      <div
        className="border-2 border-dashed rounded-3xl p-12 text-center hover:border-primary transition-colors cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById("imageUpload")?.click()}
      >
        <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">Drop images here or click to browse</p>
        <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 5MB</p>

        <input
          type="file"
          className="hidden"
          id="imageUpload"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {data.images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.images.map((file, index) => (
            <Card key={index} className="relative rounded-2xl overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                {previews[index] ? (
                  <img 
                    src={previews[index]} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm px-2 text-center truncate">{file.name}</p>
                </div>
              </div>

              <Button
                size="icon"
                className="absolute top-2 right-2 rounded-full shadow-lg"
                variant="destructive"
                onClick={() => removeImage(index)}
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
