import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const emojis = ['❤️', '💖', '🌸', '🌹', '✨', '🧸', '💌', '💝'];

const HeartBackground: React.FC = () => {
  const [elements, setElements] = useState<{ id: number; left: number; duration: number; delay: number; emoji: string }[]>([]);

  useEffect(() => {
    const newElements = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
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
            fontSize: `${Math.random() * 20 + 15}px`,
            filter: 'blur(0.5px)'
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
    </div>
  );
};

export default HeartBackground;