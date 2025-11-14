// src/pages/CreateWish.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepName from "@/components/wizard/StepName";
import StepTemplate from "@/components/wizard/StepTemplate";
import StepImages from "@/components/wizard/StepImages";
import StepSong from "@/components/wizard/StepSong";
import StepDate from "@/components/wizard/StepDate";
import StepPrivacy from "@/components/wizard/StepPrivacy";
import StepPublish from "@/components/wizard/StepPublish";

export interface WishData {
  name: string;
  template: string;
  images: File[];   // Correct type
  song: string;
  date: string;
  time: string;
  privacy: string;
  password: string;
}

// 🔥 All steps will use one universal prop shape
export interface StepProps {
  data: WishData;
  onUpdate: (data: Partial<WishData>) => void;
}

const steps = [
  { id: 1, title: "Name", component: StepName },
  { id: 2, title: "Template", component: StepTemplate },
  { id: 3, title: "Images", component: StepImages },
  { id: 4, title: "Song", component: StepSong },
  { id: 5, title: "Date & Time", component: StepDate },
  { id: 6, title: "Privacy", component: StepPrivacy },
  { id: 7, title: "Publish", component: StepPublish },
];

const CreateWish = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [wishData, setWishData] = useState<WishData>({
    name: "",
    template: "",
    images: [],
    song: "",
    date: "",
    time: "00:00",
    privacy: "public",
    password: "",
  });

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return wishData.name.trim().length > 0;
      case 2: return wishData.template.length > 0;
      case 3: return true;
      case 4: return wishData.song.length > 0;
      case 5: return wishData.date.length > 0;
      case 6: return wishData.privacy === "public" ||
               (wishData.privacy === "private" && wishData.password.length >= 6);
      default: return true;
    }
  };

  const updateWishData = (data: Partial<WishData>) => {
    setWishData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length && canProceed()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen gradient-soft">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Create Birthday Wish
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {steps[currentStep - 1].title}
            </span>
          </div>

          <Progress value={progress} className="h-2 rounded-full" />

          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 transition-all ${
                    step.id < currentStep
                      ? "bg-primary text-white"
                      : step.id === currentStep
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-muted"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </div>
                <span className="text-xs hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <CurrentStepComponent data={wishData} onUpdate={updateWishData} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">

            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-2xl"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step.id === currentStep
                      ? "bg-primary w-8"
                      : step.id < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="rounded-2xl gradient-primary border-0 hover:opacity-90"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="w-24" />
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreateWish;
