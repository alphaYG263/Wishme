import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Music, Volume2, VolumeX } from "lucide-react";

const BirthdayView = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  const slides = [
    { type: "message", content: "Happy Birthday, Sarah! 🎉" },
    { type: "image", content: "Photo 1" },
    { type: "image", content: "Photo 2" },
    { type: "image", content: "Photo 3" },
    { type: "message", content: "Wishing you a day filled with love and joy! ❤️" },
    { type: "image", content: "Photo 4" },
    { type: "message", content: "Here's to another amazing year! 🥳" },
  ];

  useEffect(() => {
    // Auto-advance slides
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 3}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: ["#FF6B9D", "#C084FC", "#60A5FA", "#FBBF24", "#34D399"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowConfetti(!showConfetti)}
            className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            ✨
          </Button>
        </header>

        {/* Slideshow */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl animate-scale-in">
              {slides[currentSlide].type === "message" ? (
                <div className="aspect-video flex items-center justify-center p-12 text-center">
                  <h2 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
                    {slides[currentSlide].content}
                  </h2>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center gradient-hero">
                  <div className="text-white/50 text-6xl">📷</div>
                </div>
              )}

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-white/80 text-sm">
            Slide {currentSlide + 1} of {slides.length}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default BirthdayView;
