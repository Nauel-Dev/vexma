import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { media } from '../utils/media';

const emojis = ['❤️', '💖', '🌸', '🌹', '✨', '🧸', '💌', '💝'];

const HeartBackground: React.FC = () => {
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    const newElements = Array.from({ length: 40 }).map((_, i) => {
      const isPhoto = Math.random() > 0.8 && media.length > 0;
      const photo = isPhoto ? media[Math.floor(Math.random() * media.length)] : null;

      return {
        id: i,
        left: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        isPhoto,
        photo,
        scale: Math.random() * 0.5 + 0.5
      };
    });
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ y: '110vh', opacity: 0, rotate: 0 }}
          animate={{ y: '-10vh', opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: `${el.left}%`,
          }}
        >
          {el.isPhoto ? (
            <div
              className="w-16 h-16 rounded-full border-2 border-rose-200 overflow-hidden shadow-sm opacity-80"
              style={{
                backgroundImage: `url('${el.photo}')`,
                backgroundSize: 'cover',
                maskImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\'0 0 512 512\' width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z\'/></svg>")',
                maskSize: 'contain',
                WebkitMaskImage: 'url("data:image/svg+xml;utf8,<svg viewBox=\'0 0 512 512\' width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z\'/></svg>")',
                WebkitMaskSize: 'contain'
              }}
            />
          ) : (
            <div
              style={{
                fontSize: `${Math.random() * 20 + 20}px`,
                filter: 'blur(0.5px)',
                opacity: 0.6
              }}
            >
              {el.emoji}
            </div>
          )}
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
    </div>
  );
};

export default HeartBackground;