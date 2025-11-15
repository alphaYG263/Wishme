// src/components/wizard/StepGradient.tsx
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { GRADIENTS } from "@/lib/constants/gradients";
import { WishFormData } from "@/lib/types/wish.types";

interface StepGradientProps {
  data: WishFormData;
  onUpdate: (data: Partial<WishFormData>) => void;
}

const StepGradient = ({ data, onUpdate }: StepGradientProps) => {
  return (
    <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Gradient</h2>
        <p className="text-muted-foreground">
          Select a beautiful background gradient for {data.recipientName}'s wish
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GRADIENTS.map((gradient, index) => (
          <Card
            key={gradient.id}
            onClick={() => onUpdate({ gradient: gradient.id })}
            className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all card-lifted ${
              data.gradient === gradient.id ? "ring-4 ring-primary" : ""
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Gradient Preview */}
            <div
              className={`h-40 bg-gradient-to-br ${gradient.cssClass} flex items-center justify-center relative`}
            >
              {data.gradient === gradient.id && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}
              
              {/* Decorative sparkles */}
              <div className="absolute top-4 left-4 text-3xl opacity-50 animate-pulse">
                ✨
              </div>
              <div className="absolute bottom-4 right-4 text-2xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>
                ⭐
              </div>
            </div>

            {/* Gradient Name */}
            <div className="p-4 bg-card">
              <h3 className="font-semibold text-center text-lg">{gradient.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StepGradient;