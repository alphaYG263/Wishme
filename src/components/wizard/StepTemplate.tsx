// src/components/wizard/StepTemplate.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check } from "lucide-react";
import { StepProps } from "@/pages/CreateWish";

const templates = [
  { 
    id: "sunset", 
    name: "Sunset Dreams", 
    images: 5, 
    premium: false,
    gradient: "from-orange-400 via-pink-500 to-purple-600",
    description: "Warm sunset colors with floating hearts"
  },
  { 
    id: "starry", 
    name: "Starry Night", 
    images: 7, 
    premium: false,
    gradient: "from-indigo-900 via-purple-900 to-black",
    description: "Twinkling stars on dark sky"
  },
  { 
    id: "garden", 
    name: "Garden Party", 
    images: 6, 
    premium: false,
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    description: "Fresh garden vibes with flowers"
  },
  { 
    id: "ocean", 
    name: "Ocean Breeze", 
    images: 8, 
    premium: true,
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    description: "Calm ocean waves"
  },
  { 
    id: "cosmic", 
    name: "Cosmic Voyage", 
    images: 10, 
    premium: true,
    gradient: "from-purple-900 via-pink-800 to-red-900",
    description: "Space-themed with floating particles"
  },
  { 
    id: "vintage", 
    name: "Vintage Memories", 
    images: 6, 
    premium: false,
    gradient: "from-amber-400 via-orange-500 to-red-500",
    description: "Classic vintage style"
  },
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
            <div className={`h-40 bg-gradient-to-br ${template.gradient} flex items-center justify-center relative`}>
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
                  {template.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Up to {template.images} images
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

      {/* Preview Modal could go here */}
      {previewTemplate && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div className="bg-card rounded-3xl p-6 max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4">
              {templates.find(t => t.id === previewTemplate)?.name} Preview
            </h3>
            <div className={`h-64 rounded-2xl bg-gradient-to-br ${
              templates.find(t => t.id === previewTemplate)?.gradient
            } flex items-center justify-center`}>
              <p className="text-white text-4xl">🎉</p>
            </div>
            <Button 
              className="w-full mt-4 rounded-2xl" 
              onClick={() => setPreviewTemplate(null)}
            >
              Close Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepTemplate;