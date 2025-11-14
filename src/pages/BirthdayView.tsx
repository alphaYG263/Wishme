// src/pages/BirthdayView.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Loader2 } from "lucide-react";

interface WishData {
  id: string;
  recipient_name: string;
  birthday_date: string;
  template_id: string;
  music_id: string;
}

interface WishImage {
  id: string;
  image_url: string;
  order_index: number;
}

const BirthdayView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState<WishData | null>(null);
  const [images, setImages] = useState<WishImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    fetchWishData();
  }, [id]);

  const fetchWishData = async () => {
    try {
      // Fetch wish details
      const { data: wishData, error: wishError } = await supabase
        .from('wishes')
        .select('*')
        .eq('id', id)
        .single();

      if (wishError) throw wishError;
      if (!wishData) {
        toast.error("Wish not found");
        navigate("/");
        return;
      }

      // Check if wish has expired
      if (wishData.status === 'expired') {
        navigate(`/wish/${id}/expired`);
        return;
      }

      // Fetch wish images
      const { data: imagesData, error: imagesError } = await supabase
        .from('wish_images')
        .select('*')
        .eq('wish_id', id)
        .order('order_index', { ascending: true });

      if (imagesError) throw imagesError;

      setWish(wishData);
      setImages(imagesData || []);

      // Update wish status to active if not already
      if (wishData.status !== 'active') {
        await supabase
          .from('wishes')
          .update({ status: 'active' })
          .eq('id', id);
      }
    } catch (error: any) {
      console.error('Error fetching wish:', error);
      toast.error(error.message || 'Failed to load birthday wish');
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && images.length > 0) {
      // Auto-advance slides
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % getTotalSlides());
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [loading, images]);

  const getTotalSlides = () => {
    // Opening message + images + closing message
    return 1 + images.length + 1;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % getTotalSlides());
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + getTotalSlides()) % getTotalSlides());
  };

  const renderSlideContent = () => {
    const totalSlides = getTotalSlides();

    // Opening message
    if (currentSlide === 0) {
      return (
        <div className="aspect-video flex items-center justify-center p-12 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
            Happy Birthday, {wish?.recipient_name}! 🎉
          </h2>
        </div>
      );
    }

    // Images
    if (currentSlide > 0 && currentSlide <= images.length) {
      const image = images[currentSlide - 1];
      return (
        <div className="aspect-video flex items-center justify-center bg-black">
          <img
            src={image.image_url}
            alt={`Memory ${currentSlide}`}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    // Closing message
    return (
      <div className="aspect-video flex items-center justify-center p-12 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
          Here's to another amazing year! 🥳
        </h2>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Loading birthday wish...</p>
        </div>
      </div>
    );
  }

  if (!wish) return null;

  const totalSlides = getTotalSlides();

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
            {[...Array(totalSlides)].map((_, index) => (
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
              {renderSlideContent()}

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
            Slide {currentSlide + 1} of {totalSlides}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default BirthdayView;