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
  const [wishData, setWishData] = useState({
    name: "",
    template: "",
    images: [],
    song: "",
    date: "",
    time: "",
    privacy: "public",
    password: "",
  });

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateWishData = (data: Partial<typeof wishData>) => {
    setWishData({ ...wishData, ...data });
  };

  return (
    <div className="min-h-screen gradient-soft">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Create Birthday Wish
          </h1>
        </div>
      </header>

      {/* Progress Bar */}
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
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <CurrentStepComponent 
            data={wishData} 
            onUpdate={updateWishData}
          />
        </div>
      </main>

      {/* Navigation Footer */}
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

            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length}
              className="rounded-2xl gradient-primary border-0 hover:opacity-90"
            >
              {currentStep === steps.length ? "Publish" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreateWish;
