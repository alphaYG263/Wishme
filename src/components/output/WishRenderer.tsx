// src/components/output/WishRenderer.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GRADIENTS } from "@/lib/constants/gradients";
import { FRAME_SHAPES } from "@/lib/constants/frameShapes";
import { TRANSITIONS } from "@/lib/constants/transitions";
import { MUSIC_PRESETS } from "@/lib/constants/music";
import NoteCard from "./NoteCard";

interface Slide {
  id: string;
  image_url: string;
  frame_shape: string;
  slide_name: string;
  transition: string;
  order_index: number;
}

interface WishRendererProps {
  gradient: string;
  slides: Slide[];
  noteMessage: string;
  noteAuthor: string;
  musicType: "preset" | "custom";
  musicUrl: string | null;
  musicPreset: string | null;
}

const WishRenderer = ({
  gradient,
  slides,
  noteMessage,
  noteAuthor,
  musicType,
  musicUrl,
  musicPreset,
}: WishRendererProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNoteCard, setShowNoteCard] = useState(false);
  const [noteCardOpen, setNoteCardOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get gradient CSS class
  const gradientClass =
    GRADIENTS.find((g) => g.id === gradient)?.cssClass ||
    "from-pink-400 via-purple-500 to-blue-500";

  // Auto-advance slides
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setShowNoteCard(true);
      return;
    }

    const timer = setTimeout(() => {
      if (currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
      } else {
        setShowNoteCard(true);
      }
    }, 4500); // 4.5 seconds per slide

    return () => clearTimeout(timer);
  }, [currentSlideIndex, slides.length]);

  // Get music URL
  const getMusicUrl = () => {
    if (musicType === "custom" && musicUrl) {
      return musicUrl;
    }
    if (musicType === "preset" && musicPreset) {
      const preset = MUSIC_PRESETS.find((p) => p.id === musicPreset);
      return preset?.url || "";
    }
    return "";
  };

  // Play music on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.warn("Audio autoplay blocked:", error);
      });
    }
  }, []);

  // Get transition animation
  const getTransitionAnimation = (transitionId: string, isFirstSlide: boolean) => {
    if (isFirstSlide) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 1 },
      };
    }

    const transition = TRANSITIONS.find((t) => t.id === transitionId);

    switch (transitionId) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 1 },
        };
      case "slide-left":
        return {
          initial: { x: "100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "-100%", opacity: 0 },
          transition: { duration: 0.8 },
        };
      case "slide-right":
        return {
          initial: { x: "-100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "100%", opacity: 0 },
          transition: { duration: 0.8 },
        };
      case "slide-up":
        return {
          initial: { y: "100%", opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: "-100%", opacity: 0 },
          transition: { duration: 0.8 },
        };
      case "slide-down":
        return {
          initial: { y: "-100%", opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: "100%", opacity: 0 },
          transition: { duration: 0.8 },
        };
      case "zoom-in":
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.5, opacity: 0 },
          transition: { duration: 1 },
        };
      case "zoom-out":
        return {
          initial: { scale: 1.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0, opacity: 0 },
          transition: { duration: 1 },
        };
      case "rotate":
        return {
          initial: { rotate: -180, opacity: 0 },
          animate: { rotate: 0, opacity: 1 },
          exit: { rotate: 180, opacity: 0 },
          transition: { duration: 1.2 },
        };
      case "flip":
        return {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 },
          transition: { duration: 1 },
        };
      case "blur":
        return {
          initial: { filter: "blur(10px)", opacity: 0 },
          animate: { filter: "blur(0px)", opacity: 1 },
          exit: { filter: "blur(10px)", opacity: 0 },
          transition: { duration: 1 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 1 },
        };
    }
  };

  // Render slide with frame shape
  const renderSlide = (slide: Slide) => {
    const shape = FRAME_SHAPES.find((s) => s.id === slide.frame_shape);
    
    if (!shape) {
      return (
        <div className="relative w-full max-w-4xl mx-auto aspect-video">
          <img
            src={slide.image_url}
            alt={slide.slide_name}
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
        </div>
      );
    }

    // For special shapes, use clip-path
    const getClipPath = (shapeId: string) => {
      switch (shapeId) {
        case "circle":
          return "circle(50% at 50% 50%)";
        case "rounded":
          return "inset(0 round 20%)";
        case "heart":
          return "path('M50,90 C20,60 0,40 0,25 C0,12 10,0 25,0 C35,0 45,5 50,15 C55,5 65,0 75,0 C90,0 100,12 100,25 C100,40 80,60 50,90 Z')";
        case "star":
          return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        case "hexagon":
          return "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
        case "diamond":
          return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
        default:
          return "none";
      }
    };

    return (
      <div
        className="relative w-full max-w-4xl mx-auto"
        style={{ aspectRatio: shape.aspectRatio }}
      >
        <div
          className="w-full h-full relative overflow-hidden shadow-2xl"
          style={{
            clipPath: getClipPath(shape.id),
            WebkitClipPath: getClipPath(shape.id),
          }}
        >
          <img
            src={slide.image_url}
            alt={slide.slide_name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  };

  if (slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200">
        <p className="text-gray-700">No slides to display</p>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientClass} relative overflow-hidden`}
    >
      {/* Background Music */}
      {getMusicUrl() && (
        <audio ref={audioRef} loop>
          <source src={getMusicUrl()} type="audio/mpeg" />
        </audio>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Slide Display */}
      {!showNoteCard && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              className="w-full flex flex-col items-center"
              {...getTransitionAnimation(currentSlide.transition, currentSlideIndex === 0)}
            >
              {renderSlide(currentSlide)}

              {/* Slide Name */}
              <motion.div
                className="mt-8 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-white text-lg font-semibold">
                  {currentSlide.slide_name}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlideIndex
                    ? "bg-white w-8"
                    : "bg-white/40 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Note Card */}
      {showNoteCard && (
        <NoteCard
          message={noteMessage}
          author={noteAuthor}
          isOpen={noteCardOpen}
          onToggle={() => setNoteCardOpen(!noteCardOpen)}
        />
      )}
    </div>
  );
};

export default WishRenderer;