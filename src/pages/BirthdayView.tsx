// src/pages/BirthdayView.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2, Heart } from "lucide-react";

interface WishData {
  id: string;
  recipient_name: string;
  birthday_date: string;
  template_id: string;
  music_id: string;
  custom_url: string;
}

interface WishImage {
  id: string;
  image_url: string;
  order_index: number;
}

const BirthdayView = () => {
  const { region, vipSlot, wishName } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState<WishData | null>(null);
  const [images, setImages] = useState<WishImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [heartsArray, setHeartsArray] = useState<Array<{ id: number; left: number }>>([]);

  useEffect(() => {
    fetchWishData();
  }, [region, vipSlot, wishName]);

  useEffect(() => {
    // Generate floating hearts periodically
    const heartInterval = setInterval(() => {
      setHeartsArray(prev => [
        ...prev,
        { id: Date.now(), left: Math.random() * 100 }
      ]);
    }, 2000);

    return () => clearInterval(heartInterval);
  }, []);

  useEffect(() => {
    // Clean up old hearts
    const cleanup = setInterval(() => {
      setHeartsArray(prev => prev.slice(-10));
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [images]);

  const fetchWishData = async () => {
    try {
      const customUrl = vipSlot 
        ? `${region}/${vipSlot}/${wishName}`
        : `${region}/${wishName}`;

      const { data: wishData, error: wishError } = await supabase
        .from('wishes')
        .select('*')
        .eq('custom_url', customUrl)
        .single();

      if (wishError) throw wishError;
      if (!wishData) {
        toast.error("Wish not found");
        navigate("/");
        return;
      }

      if (wishData.status === 'expired') {
        navigate(`/wish/${wishData.id}/expired`);
        return;
      }

      const { data: imagesData, error: imagesError } = await supabase
        .from('wish_images')
        .select('*')
        .eq('wish_id', wishData.id)
        .order('order_index', { ascending: true });

      if (imagesError) throw imagesError;

      setWish(wishData);
      setImages(imagesData || []);

      // Update view count
      await supabase
        .from('wishes')
        .update({ 
          status: 'active',
          views_count: (wishData.views_count || 0) + 1 
        })
        .eq('id', wishData.id);

    } catch (error: any) {
      console.error('Error fetching wish:', error);
      toast.error(error.message || 'Failed to load birthday wish');
      navigate("/");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {heartsArray.map((heart) => (
          <div
            key={heart.id}
            className="absolute bottom-0 animate-float-up"
            style={{
              left: `${heart.left}%`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <Heart className="w-6 h-6 text-white/30 fill-white/30" />
          </div>
        ))}
      </div>

      {/* Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
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
              className="w-2 h-2 md:w-3 md:h-3 rounded-full"
              style={{
                background: ["#FF6B9D", "#C084FC", "#60A5FA", "#FBBF24", "#34D399"][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Birthday Message */}
        {showMessage && (
          <div className="text-center mb-12 animate-fade-in-scale">
            <div className="inline-block mb-8">
              <div className="text-8xl md:text-9xl animate-bounce-slow">
                🎂
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-slide-up drop-shadow-2xl">
              Happy Birthday
            </h1>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-slide-up animation-delay-200 drop-shadow-xl">
              {wish.recipient_name}!
            </h2>

            <div className="flex flex-wrap justify-center gap-4 text-3xl md:text-5xl animate-slide-up animation-delay-400">
              <span className="animate-bounce animation-delay-100">🎉</span>
              <span className="animate-bounce animation-delay-200">🎈</span>
              <span className="animate-bounce animation-delay-300">🎁</span>
              <span className="animate-bounce animation-delay-400">✨</span>
              <span className="animate-bounce animation-delay-500">🎊</span>
            </div>
          </div>
        )}

        {/* Image Display with Animations */}
        {images.length > 0 && (
          <div className="relative w-full max-w-4xl mb-12">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 backdrop-blur-sm">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentImageIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                    <div className="text-6xl">📸</div>
                  </div>
                  
                  {/* Photo Frame Effect */}
                  <div className="absolute inset-0 border-8 border-white/20 pointer-events-none" />
                  
                  {/* Sparkle Effects */}
                  {index === currentImageIndex && (
                    <>
                      <div className="absolute top-4 right-4 text-3xl animate-ping">
                        ✨
                      </div>
                      <div className="absolute bottom-4 left-4 text-3xl animate-ping animation-delay-500">
                        ⭐
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Birthday Message Card */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-white/30 shadow-2xl animate-fade-in-scale animation-delay-600">
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-6">
              Wishing you a day filled with love, laughter, and all the happiness in the world! 
              May this year bring you endless joy and unforgettable moments! 🎊
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <div className="px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <span className="text-white font-semibold">Made with ❤️</span>
              </div>
              <div className="px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <span className="text-white font-semibold">BestWishes.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cake Animation */}
        <div className="mt-12 animate-float">
          <div className="text-7xl md:text-8xl">
            🎂
          </div>
        </div>
      </div>

      {/* Additional CSS for custom animations */}
      <style>{`
        @keyframes float-up {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        .animate-float-up {
          animation: float-up linear forwards;
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 1s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  );
};

export default BirthdayView;