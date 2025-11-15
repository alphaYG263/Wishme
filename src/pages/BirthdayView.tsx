// src/pages/BirthdayView.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WelcomeScreen from "@/components/birthday/WelcomeScreen";
import CakeCutting from "@/components/birthday/CakeCutting";
import { motion, AnimatePresence } from "framer-motion";

interface WishData {
  id: string;
  recipient_name: string;
  birthday_date: string;
  template_id: string;
  music_id: string;
  custom_url: string;
  privacy: string;
  password_hash: string | null;
  note_message?: string;
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
  const [password, setPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    fetchWishData();
  }, [region, vipSlot, wishName]);

  useEffect(() => {
    if (images.length > 0 && step === 2) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [images, step]);

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

      // Check for password protection
      if (wishData.privacy === 'private' && wishData.password_hash) {
        setWish(wishData);
        setShowPasswordForm(true);
        setLoading(false);
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === wish?.password_hash) {
      setShowPasswordForm(false);
      fetchWishData();
    } else {
      toast.error("Incorrect password");
      setPassword("");
    }
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-600" />
          <p className="text-gray-700">Loading birthday wish...</p>
        </div>
      </div>
    );
  }

  // Password prompt UI
  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-pink-200 animate-scale-in shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-full bg-pink-100 mb-4">
              <Lock className="w-8 h-8 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Password Protected
            </h2>
            <p className="text-gray-600">
              This birthday wish is private
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="rounded-2xl bg-white/50 border-pink-300 h-12"
              required
              autoFocus
            />
            <Button 
              type="submit" 
              className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white h-12 font-semibold hover:opacity-90"
            >
              Unlock Birthday Wish
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (!wish) return null;

  // Step-based animation flow
  return (
    <div className="min-h-screen">
      {step === 0 && (
        <WelcomeScreen recipientName={wish.recipient_name} onNext={nextStep} />
      )}
      
      {step === 1 && (
        <CakeCutting onNext={nextStep} />
      )}
      
      {step === 2 && (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-pink-400 rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.3, 0.6, 0.3],
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

          <div className="relative z-10 max-w-4xl w-full text-center">
            {/* Birthday Message */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block mb-8"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-9xl">🎂</div>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6 drop-shadow-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Happy Birthday
              </motion.h1>
              
              <motion.h2 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-8 drop-shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {wish.recipient_name}!
              </motion.h2>

              <motion.div 
                className="flex flex-wrap justify-center gap-4 text-3xl md:text-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {['🎉', '🎈', '🎁', '✨', '🎊'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Image Display */}
            {images.length > 0 && (
              <motion.div 
                className="relative w-full max-w-4xl mb-12 mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.8 }}
                    >
                      <img 
                        src={images[currentImageIndex].image_url} 
                        alt={`Memory ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Image Indicators */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-3 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-pink-600 w-8"
                            : "bg-pink-300 w-3 hover:bg-pink-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Custom Note Message */}
            {wish.note_message && (
              <motion.div 
                className="max-w-2xl mx-auto text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-pink-200 shadow-2xl">
                  <p className="text-xl md:text-2xl text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {wish.note_message}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <div className="px-6 py-3 bg-white/50 rounded-full backdrop-blur-sm border border-pink-200">
                <span className="text-gray-700 font-semibold flex items-center gap-2">
                  Made with ❤️ by BestWishes
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayView;