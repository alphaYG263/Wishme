// src/components/output/NoteCard.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
  message: string;
  author: string;
  isOpen: boolean;
  onToggle: () => void;
}

const NoteCard = ({ message, author, isOpen, onToggle }: NoteCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Closed State - Clickable Preview
          <motion.div
            key="closed"
            initial={{ y: -100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            onClick={onToggle}
            className="cursor-pointer"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Envelope/Card Preview */}
              <div className="relative w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-3xl shadow-2xl border-4 border-pink-200 dark:border-pink-800 flex items-center justify-center">
                {/* Decorative Heart */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />
                </motion.div>

                {/* Message Indicator */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    💌 A message for you
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Click to open
                  </p>
                </div>

                {/* Sparkle Effect */}
                <motion.div
                  className="absolute top-4 right-4 text-2xl"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute bottom-4 left-4 text-xl"
                  animate={{
                    rotate: [0, -360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  ⭐
                </motion.div>
              </div>

              {/* Shadow pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-pink-400/20 blur-2xl -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        ) : (
          // Open State - Full Note Card
          <motion.div
            key="open"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className="relative w-full max-w-3xl"
          >
            {/* Close Button */}
            <Button
              onClick={onToggle}
              variant="ghost"
              size="icon"
              className="absolute -top-4 -right-4 z-30 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 border-2 border-pink-200 dark:border-pink-800"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Note Card */}
            <motion.div
              className="relative bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-3xl shadow-2xl border-4 border-pink-200 dark:border-pink-800 overflow-hidden"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Decorative Header */}
              <div className="relative py-8 px-8 border-b-2 border-pink-200 dark:border-pink-800">
                <motion.div
                  className="flex justify-center mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                </motion.div>
                <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
                  A Special Message
                </h2>
              </div>

              {/* Message Content */}
              <div className="p-8 md:p-12">
                <motion.div
                  className="prose prose-lg max-w-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap text-center mb-8">
                    {message}
                  </p>

                  {/* Author Signature */}
                  <motion.div
                    className="flex justify-end items-center gap-2 mt-8 pt-6 border-t border-pink-200 dark:border-pink-800"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-base text-gray-600 dark:text-gray-300 italic font-handwriting">
                      With love,
                    </p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 font-handwriting">
                      {author}
                    </p>
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 text-3xl opacity-20 animate-float">
                🌟
              </div>
              <div
                className="absolute bottom-4 left-4 text-2xl opacity-20 animate-float"
                style={{ animationDelay: "1s" }}
              >
                💝
              </div>
            </motion.div>

            {/* Background Glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-pink-400/20 blur-3xl -z-10"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoteCard;



