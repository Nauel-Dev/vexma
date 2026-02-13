import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { media, video, music } from '../utils/media';

interface LoaderProps {
    onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const assets = [...media, video, music].filter(Boolean) as string[];
        let loadedCount = 0;
        const total = assets.length;
        let isMounted = true;

        if (total === 0) {
            setIsReady(true);
            return;
        }

        const updateProgress = () => {
            if (!isMounted) return;
            loadedCount++;
            const newProgress = Math.round((loadedCount / total) * 100);
            setProgress(newProgress);

            if (loadedCount === total) {
                setTimeout(() => {
                    if (isMounted) setIsReady(true);
                }, 400);
            }
        };

        // Global fallback: if loading takes too long (e.g. 10s), force completion
        const globalTimeoutId = setTimeout(() => {
            if (isMounted && loadedCount < total) {
                console.warn("Loader timed out. Forcing completion.");
                setIsReady(true);
            }
        }, 10000); // 10 seconds max wait time

        assets.forEach(src => {
            let handled = false;
            const onComplete = () => {
                if (handled) return;
                handled = true;
                clearTimeout(timeoutId);
                updateProgress();
            };

            // Individual asset safety timeout
            const timeoutId = setTimeout(() => {
                onComplete();
            }, 5000); // 5 seconds max per asset

            try {
                const srcString = String(src).toLowerCase(); // Handle potential non-string imports safely

                if (srcString.endsWith('.mp4') || srcString.endsWith('.webm')) {
                    const vid = document.createElement('video');
                    vid.src = src;
                    vid.load();
                    vid.onloadeddata = onComplete;
                    vid.onerror = onComplete;
                } else if (srcString.endsWith('.mp3') || srcString.endsWith('.wav') || srcString.endsWith('.ogg')) {
                    const audio = new Audio();
                    audio.src = src;
                    audio.load();
                    // 'onloadeddata' is faster/less strict than 'oncanplaythrough'
                    audio.onloadeddata = onComplete;
                    audio.onerror = onComplete;
                } else {
                    const img = new Image();
                    img.src = src;
                    img.onload = onComplete;
                    img.onerror = onComplete;
                }
            } catch (error) {
                console.error("Error determining asset type for:", src, error);
                onComplete(); // Count as loaded to avoid hanging
            }
        });

        return () => {
            isMounted = false;
            clearTimeout(globalTimeoutId);
        };

    }, []);

    const handleReady = () => {
        // Start music on user click (satisfies browser autoplay policy)
        const audio = document.createElement('audio');
        const source = document.createElement('source');
        source.src = music;
        source.type = 'audio/mpeg';
        audio.appendChild(source);
        audio.loop = true;
        audio.volume = 0.4;
        audio.load();
        audio.play().catch(() => { });
        // Store on window so it persists
        (window as any).__bgMusic = audio;

        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-rose-50">
            <AnimatePresence mode="wait">
                {!isReady ? (
                    <motion.div
                        key="loading"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="text-6xl animate-bounce">🧸</div>
                        <h2 className="text-2xl font-bold text-rose-500 font-hand">Gathering Memories...</h2>

                        <div className="w-64 h-4 bg-rose-200 rounded-full overflow-hidden border border-rose-300">
                            <motion.div
                                className="h-full bg-rose-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 50 }}
                            />
                        </div>
                        <p className="text-rose-400 font-mono text-sm">{progress}%</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="ready"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.div
                            className="text-7xl"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            💌
                        </motion.div>
                        <h2 className="text-3xl font-bold text-rose-600 font-hand">Are you ready?</h2>
                        <motion.button
                            onClick={handleReady}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Yes! 💖
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Loader;
