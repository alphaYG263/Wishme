import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check } from "lucide-react";
import { StepProps } from "@/pages/CreateWish";

const templates = [
  { id: "sunset", name: "Sunset Dreams", images: 5, premium: false },
  { id: "starry", name: "Starry Night", images: 7, premium: false },
  { id: "garden", name: "Garden Party", images: 6, premium: false },
  { id: "ocean", name: "Ocean Breeze", images: 8, premium: true },
  { id: "cosmic", name: "Cosmic Voyage", images: 10, premium: true },
  { id: "vintage", name: "Vintage Memories", images: 6, premium: false },
];

const StepTemplate = ({ data, onUpdate }: StepProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose a Template</h2>
        <p className="text-muted-foreground">
          Select the perfect design for your birthday wish
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`rounded-3xl overflow-hidden cursor-pointer transition-all card-lifted ${
              data.template === template.id ? "ring-4 ring-primary" : ""
            }`}
            onClick={() => onUpdate({ template: template.id })}
          >
            <div className="h-40 gradient-hero flex items-center justify-center relative">
              {data.template === template.id && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-2">
                  <Check className="w-5 h-5" />
                </div>
              )}
              {template.premium && (
                <Badge className="absolute top-4 left-4 rounded-xl bg-accent">
                  Premium
                </Badge>
              )}
              <div className="text-6xl font-bold text-white/20">
                {template.name.charAt(0)}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {template.images} images max
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate(template.id);
                }}
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StepTemplate;

