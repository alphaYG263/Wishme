// src/components/templates/MyHeartTemplate.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MyHeartTemplateProps {
  recipientName: string;
  images: string[]; // Array of image URLs from Supabase
  noteMessage?: string; // Custom message from user
  musicUrl?: string;
}

export const MyHeartTemplate = ({ 
  recipientName, 
  images, 
  noteMessage,
  musicUrl 
}: MyHeartTemplateProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [heartsArray, setHeartsArray] = useState<Array<{ id: number; left: number }>>([]);

  // Floating hearts animation
  useEffect(() => {
    const heartInterval = setInterval(() => {
      setHeartsArray(prev => [
        ...prev,
        { id: Date.now(), left: Math.random() * 100 }
      ]);
    }, 2000);

    return () => clearInterval(heartInterval);
  }, []);

  // Cleanup old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setHeartsArray(prev => prev.slice(-15));
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  // Image carousel
  useEffect(() => {
    if (images.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [images]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-400 via-red-400 to-purple-500">
      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {heartsArray.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute bottom-0"
            style={{ left: `${heart.left}%` }}
            initial={{ y: 0, opacity: 0, scale: 0.5 }}
            animate={{ 
              y: "-120vh", 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.8],
              rotate: [0, 360]
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              ease: "easeOut"
            }}
          >
            <Heart className="w-8 h-8 text-white/40 fill-white/40" />
          </motion.div>
        ))}
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            <div className="w-3 h-3 bg-white/30 rounded-full" />
          </motion.div>
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
          <motion.div 
            className="text-center mb-12"
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
              <div className="text-9xl">💝</div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Happy Birthday
            </motion.h1>
            
            <motion.h2 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 drop-shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {recipientName}!
            </motion.h2>

            <motion.div 
              className="flex flex-wrap justify-center gap-4 text-3xl md:text-5xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {['❤️', '💕', '💖', '💗', '💝'].map((emoji, i) => (
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
        )}

        {/* Image Display with Heart Frame */}
        {images.length > 0 && (
          <div className="relative w-full max-w-4xl mb-12">
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
                    src={images[currentImageIndex]} 
                    alt={`Memory ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Heart overlay effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${10 + i * 10}%`,
                          top: `${Math.random() * 80}%`,
                        }}
                        animate={{
                          y: [0, -100],
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.3,
                          repeat: Infinity
                        }}
                      >
                        <Heart className="w-6 h-6 text-white/60 fill-white/60" />
                      </motion.div>
                    ))}
                  </div>
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
                        ? "bg-white w-8"
                        : "bg-white/50 w-3 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Note Message */}
        {noteMessage && (
          <motion.div 
            className="max-w-2xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-white/40 shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                <Heart className="w-12 h-12 text-white fill-white mx-auto mb-6" />
              </motion.div>
              
              <p className="text-xl md:text-2xl text-white leading-relaxed font-light whitespace-pre-wrap">
                {noteMessage}
              </p>
            </div>
          </motion.div>
        )}

        {/* Made with Love Footer */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
            <span className="text-white font-semibold flex items-center gap-2">
              Made with <Heart className="w-4 h-4 fill-white" /> by BestWishes
            </span>
          </div>
        </motion.div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default MyHeartTemplate;