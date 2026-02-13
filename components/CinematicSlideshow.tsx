import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { media } from '../utils/media';

interface CinematicSlideshowProps {
    onComplete: () => void;
}

const captions = [
    "Every moment with you...",
    "Is a memory I treasure...",
    "Your smile lights up my world...",
    "I fall for you every single day...",
    "You make everything beautiful...",
    "My favorite place is next to you...",
    "Together is my favorite place to be...",
    "You're my forever and always...",
    "Every love story is beautiful...",
    "But ours is my favorite...",
    "I loved you then...",
    "I love you still...",
];

// Subtle Ken Burns — gentle movement, not too zoomed
const kenBurnsVariants = [
    { scale: [1, 1.06], x: [0, -8], y: [0, -5] },
    { scale: [1.04, 1], x: [-5, 5], y: [-3, 3] },
    { scale: [1, 1.05], x: [0, 6], y: [0, -6] },
    { scale: [1.05, 1.01], x: [5, -5], y: [3, -3] },
    { scale: [1, 1.04], x: [0, -5], y: [0, 4] },
    { scale: [1.03, 1], x: [-6, 0], y: [4, 0] },
];

const CinematicSlideshow: React.FC<CinematicSlideshowProps> = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const SLIDE_DURATION = 4000;

    useEffect(() => {
        if (currentIndex >= media.length) {
            setIsComplete(true);
            setTimeout(onComplete, 1500);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, SLIDE_DURATION);

        return () => clearTimeout(timer);
    }, [currentIndex, onComplete]);

    const kenBurns = kenBurnsVariants[currentIndex % kenBurnsVariants.length];
    const caption = captions[currentIndex % captions.length];

    return (
        <div className="fixed inset-0 z-50 bg-black overflow-hidden">
            {/* Cinematic letterbox bars */}
            <div className="absolute top-0 left-0 right-0 h-[6%] md:h-[8%] bg-black z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-[6%] md:h-[8%] bg-black z-20" />

            <AnimatePresence mode="sync">
                {!isComplete && currentIndex < media.length && (
                    <motion.div
                        key={currentIndex}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                        {/* Ken Burns animated image — object-contain on mobile for full visibility */}
                        <motion.img
                            src={media[currentIndex]}
                            alt=""
                            className="w-full h-full object-contain md:object-cover"
                            initial={{
                                scale: kenBurns.scale[0],
                                x: kenBurns.x[0],
                                y: kenBurns.y[0],
                            }}
                            animate={{
                                scale: kenBurns.scale[1],
                                x: kenBurns.x[1],
                                y: kenBurns.y[1],
                            }}
                            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                        />

                        {/* Vignette overlay */}
                        <div
                            className="absolute inset-0 z-10"
                            style={{
                                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
                            }}
                        />

                        {/* Caption */}
                        <motion.div
                            className="absolute bottom-[10%] md:bottom-[12%] left-0 right-0 z-30 text-center px-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-white text-xl md:text-4xl font-hand drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] italic">
                                {caption}
                            </p>
                        </motion.div>

                        {/* Subtle sparkle particles */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-white/30 text-xs"
                                    style={{
                                        left: `${15 + Math.random() * 70}%`,
                                        top: `${15 + Math.random() * 70}%`,
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.4,
                                        repeat: Infinity,
                                    }}
                                >
                                    ✦
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute bottom-[2%] left-0 right-0 z-30 flex justify-center gap-1.5 md:gap-2 flex-wrap px-4">
                {media.map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${i === currentIndex
                                ? 'bg-white scale-125'
                                : i < currentIndex
                                    ? 'bg-white/60'
                                    : 'bg-white/20'
                            }`}
                    />
                ))}
            </div>

            {/* Final fade to white */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        className="absolute inset-0 z-40 bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CinematicSlideshow;
