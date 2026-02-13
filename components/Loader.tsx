import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { media, video, music } from '../utils/media';

interface LoaderProps {
    onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const assets = [...media, video, music].filter(Boolean) as string[];
        let loadedCount = 0;
        const total = assets.length;

        if (total === 0) {
            onComplete();
            return;
        }

        const updateProgress = () => {
            loadedCount++;
            const newProgress = Math.round((loadedCount / total) * 100);
            setProgress(newProgress);

            if (loadedCount === total) {
                setTimeout(onComplete, 500); // Small delay at 100%
            }
        };

        assets.forEach(src => {
            if (src.endsWith('.mp4') || src.endsWith('.webm')) {
                const vid = document.createElement('video');
                vid.src = src;
                vid.onloadeddata = updateProgress;
                vid.onerror = updateProgress;
            } else if (src.endsWith('.mp3') || src.endsWith('.wav') || src.endsWith('.ogg')) {
                const audio = new Audio();
                audio.src = src;
                audio.oncanplaythrough = updateProgress;
                audio.onerror = updateProgress;
            } else {
                const img = new Image();
                img.src = src;
                img.onload = updateProgress;
                img.onerror = updateProgress;
            }
        });

    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-rose-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
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
        </div>
    );
};

export default Loader;
