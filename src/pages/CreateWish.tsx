// src/pages/CreateWish.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { WishFormData, Slide } from "@/lib/types/wish.types";

// Import wizard steps
import StepName from "@/components/wizard/StepName";
import StepGradient from "@/components/wizard/StepGradient";
import StepSlides from "@/components/wizard/StepSlides";
import StepNote from "@/components/wizard/StepNote";
import StepMusic from "@/components/wizard/StepMusic";
import StepPrivacy from "@/components/wizard/StepPrivacy";
import StepPublish from "@/components/wizard/StepPublish";

const STEPS = [
  { id: 1, title: "Recipient Name", component: StepName },
  { id: 2, title: "Choose Gradient", component: StepGradient },
  { id: 3, title: "Create Slides", component: StepSlides },
  { id: 4, title: "Personal Note", component: StepNote },
  { id: 5, title: "Background Music", component: StepMusic },
  { id: 6, title: "Privacy Settings", component: StepPrivacy },
  { id: 7, title: "Publish", component: StepPublish },
];

const CreateWish = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<WishFormData>({
    recipientName: "",
    birthdayDate: "", 
    gradient: "sunset",
    slides: [
      {
        id: "slide-1",
        frameShape: "rectangle",
        imageUrl: "",
        slideName: "Slide 1",
        transition: "fade",
        order: 0,
      },
    ],
    noteMessage: "",
    noteAuthor: "",
    useCustomAuthor: false,
    musicType: "preset",
    musicPreset: "happy-classic",
    privacy: "public",
    customUrl: "",
    birthdayTime: "00:00",
  });

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, is_premium")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        setUsername(user?.user_metadata?.username || user?.email?.split("@")[0] || "User");
        setIsPremium(false);
      } else if (data) {
        setUsername(data.username);
        setIsPremium(data.is_premium || false);
        setFormData((prev) => ({
          ...prev,
          noteAuthor: data.username,
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updates: Partial<WishFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.recipientName.trim().length > 0 && formData.birthdayDate !== "";
      case 2:
        return formData.gradient !== "";
      case 3:
        return (
          formData.slides.length > 0 &&
          formData.slides.every((slide) => slide.imageUrl && slide.slideName)
        );
      case 4:
        return (
          formData.noteMessage.trim().length > 0 &&
          (formData.useCustomAuthor
            ? formData.noteAuthor.trim().length > 0
            : true)
        );
      case 5:
        return (
          (formData.musicType === "preset" && formData.musicPreset) ||
          (formData.musicType === "custom" && formData.musicFile)
        );
      case 6:
        return (
          formData.privacy === "public" ||
          (formData.privacy === "private" && formData.password)
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error("Please complete all required fields");
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/bestwishes/home");
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;
  const progress = (currentStep / STEPS.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="rounded-2xl gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {currentStep === 1 ? "Home" : "Back"}
            </Button>

            <div className="flex-1 mx-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {STEPS[currentStep - 1].title}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {currentStep < STEPS.length && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="rounded-2xl gradient-primary border-0 gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-fade-in">
          <CurrentStepComponent
            data={formData}
            onUpdate={handleUpdate}
            username={username}
            isPremium={isPremium}
          />
        </div>
      </main>

      {/* Navigation Footer (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 rounded-2xl"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          {currentStep < STEPS.length && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 rounded-2xl gradient-primary border-0"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateWish;
