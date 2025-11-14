import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface StepImagesProps {
  data: { template: string; images: string[] };
  onUpdate: (data: { images: string[] }) => void;
}

const StepImages = ({ data, onUpdate }: StepImagesProps) => {
  const maxImages = 5; // This would vary based on template
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Upload Photos</h2>
        <p className="text-muted-foreground">
          Add up to {maxImages} special moments to include in the birthday wish
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all"
              style={{ width: `${(data.images.length / maxImages) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {data.images.length} / {maxImages}
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrag}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-6 rounded-full gradient-primary/10">
            <Upload className="w-12 h-12 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium mb-2">
              Drag and drop your photos here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse your files
            </p>
            <Button className="rounded-2xl gradient-primary border-0 hover:opacity-90">
              Choose Files
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPG, PNG, GIF (max 10MB each)
          </p>
        </div>
      </div>

      {/* Image Grid */}
      {data.images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.images.map((image, index) => (
            <Card key={index} className="rounded-2xl overflow-hidden relative group">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  const newImages = data.images.filter((_, i) => i !== index);
                  onUpdate({ images: newImages });
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
