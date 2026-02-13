import React from 'react';
import { motion, Variants } from 'framer-motion';
import { media, video } from '../utils/media';

const PhotoGallery: React.FC = () => {
    // Group 1: First 5 images
    const group1 = media.slice(0, 5);
    // Group 2: Next 2 images
    const group2 = media.slice(5, 7);
    // Group 3: Next 4 images
    const group3 = media.slice(7, 11);

    const cardVariants: Variants = {
        offscreen: {
            y: 50,
            opacity: 0,
            rotate: -10
        },
        onscreen: {
            y: 0,
            opacity: 1,
            rotate: 0,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col gap-12">

            {/* Group 1: 5 Photos (Masonry-ish) */}
            <div className="relative h-[400px] w-full">
                {group1.map((src, index) => (
                    <motion.div
                        key={`g1-${index}`}
                        className="absolute rounded-xl overflow-hidden shadow-lg border-4 border-white transform hover:scale-110 transition-transform z-10"
                        style={{
                            width: '180px',
                            height: '240px',
                            left: `${(index * 20) + (Math.random() * 5)}%`,
                            top: `${(index % 2 === 0 ? 0 : 100) + (Math.random() * 20)}px`,
                            rotate: `${(Math.random() * 30) - 15}deg`
                        }}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.8 }}
                        variants={cardVariants}
                    >
                        <img src={src} alt="Us" className="w-full h-full object-cover" />
                    </motion.div>
                ))}
            </div>

            {/* Group 2: 2 Photos (Featured) */}
            <div className="flex justify-center gap-8 items-center py-8">
                {group2.map((src, index) => (
                    <motion.div
                        key={`g2-${index}`}
                        className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white w-64 h-80 rotate-3 hover:rotate-0 transition-transform"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                    >
                        <img src={src} alt="Us Special" className="w-full h-full object-cover" />
                    </motion.div>
                ))}
            </div>

            {/* Video Feature (if available) */}
            {video && (
                <motion.div
                    className="mx-auto w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border-4 border-rose-200"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <video src={video} controls className="w-full" />
                </motion.div>
            )}

            {/* Group 3: 4 Photos (Grid) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {group3.map((src, index) => (
                    <motion.div
                        key={`g3-${index}`}
                        className="rounded-lg overflow-hidden shadow-md border-2 border-white aspect-square"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <img src={src} alt="Memory" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </motion.div>
                ))}
            </div>

        </div>
    );
};

export default PhotoGallery;
