import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLoveNote } from './services/geminiService';
import HeartBackground from './components/HeartBackground';
import Envelope from './components/Envelope';
import PhotoGallery from './components/PhotoGallery';
import Loader from './components/Loader';
import { music } from './utils/media';

declare global {
  interface Window {
    confetti: any;
  }
}

const App: React.FC = () => {
  const [yesPressed, setYesPressed] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [aiNote, setAiNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // State for the "Runaway No" button
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startMusic = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(music);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }
    audioRef.current.play().catch(() => { });
  }, []);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
  };

  // Start music as soon as assets are loaded (envelope screen)
  useEffect(() => {
    if (isAssetsLoaded) {
      startMusic();
    }
  }, [isAssetsLoaded, startMusic]);

  const yesButtonSize = noCount * 20 + 16;

  const noPhrases = [
    "No", "Are you sure?", "Really sure?", "Think again!", "Last chance!",
    "Surely not?", "You might regret this!", "Give it another thought!",
    "Are you absolutely certain?", "This could be a mistake!", "Have a heart!",
    "Don't be so cold!", "Change of heart?", "Wouldn't you reconsider?",
    "Is that your final answer?", "You're breaking my heart ;(",
    "I'm gonna cry...", "Plsss? :((", "Pretty please?", "I'll be very sad",
    "Noooooooooo"
  ];

  const getNoButtonText = () => {
    return noPhrases[Math.min(noCount, noPhrases.length - 1)];
  };

  const handleNoInteraction = () => {
    setNoCount(prev => prev + 1);

    // Make the button jump to a random position
    // We limit the jump so it doesn't go off screen too easily, 
    // but works within the relative container usually
    const x = (Math.random() - 0.5) * 300;
    const y = (Math.random() - 0.5) * 300;
    setNoBtnPosition({ x, y });
  };

  const handleYesClick = async () => {
    setYesPressed(true);

    // Confetti
    if (window.confetti) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }

    // Fetch AI Note (and send email in background)
    setIsLoading(true);

    // Fire and forget email notification
    fetch("https://formsubmit.co/ajax/nauelverse@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        subject: "She said YES! 💘",
        message: "Congratulations! Your Valentine accepted your request. Time to celebrate! 🥂",
        _captcha: "false" // Disable captcha for cleaner UX
      })
    }).catch(err => console.error("Failed to send email notif:", err));

    try {
      const note = await generateLoveNote();
      setAiNote(note);
    } catch (e) {
      console.error(e);
      setAiNote("I love you more than words can say! ❤️");
    } finally {
      setIsLoading(false);
    }
  };



  if (!isAssetsLoaded) {
    return <Loader onComplete={() => setIsAssetsLoaded(true)} />;
  }

  if (!isEnvelopeOpen) {
    return <Envelope onOpen={handleEnvelopeOpen} />;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-pink-100 to-rose-200 overflow-x-hidden text-center selection:bg-rose-300 font-sans">
      <HeartBackground />

      <div className="z-10 w-full max-w-3xl px-4 py-8">
        <AnimatePresence mode="wait">
          {yesPressed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                className="relative"
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <img
                  src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
                  alt="Bears kissing"
                  className="w-64 h-64 object-contain drop-shadow-2xl rounded-full border-4 border-white/50"
                />
                <motion.div
                  className="absolute -top-4 -right-4 text-5xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  💖
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-6xl font-hand font-bold text-rose-600 drop-shadow-sm"
              >
                Yay!!! I knew you'd say yes!
              </motion.h1>

              {/* AI Note Section */}
              <div className="w-full max-w-md mt-4">
                {isLoading ? (
                  <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg animate-pulse flex flex-col items-center">
                    <div className="text-4xl mb-2">💌</div>
                    <span className="text-rose-600 font-medium">Cupid is writing a special note...</span>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/60 text-left relative overflow-hidden group transform rotate-1"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-rose-400" />
                    <h3 className="text-rose-400 text-sm font-bold uppercase tracking-wider mb-2">A Note For You</h3>
                    <p className="text-xl md:text-2xl text-gray-800 font-hand leading-relaxed">
                      "{aiNote}"
                    </p>
                    <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 rotate-12">❤️</div>
                  </motion.div>
                )}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => window.location.reload()}
                className="mt-8 px-8 py-3 bg-white/50 hover:bg-white/80 text-rose-500 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
              >
                Ask Again ↺
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="ask"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
              className="w-full flex flex-col items-center"
            >
              <PhotoGallery />

              <div className="flex flex-col items-center bg-white/30 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/40 max-w-2xl mx-auto">
                <img
                  src="https://media.tenor.com/k6gYrJccYjMAAAAi/mocha-bear.gif"
                  alt="Cute bear asking"
                  className="w-40 h-40 md:w-56 md:h-56 object-contain mb-6 drop-shadow-xl"
                />

                <div className="mb-8 max-w-lg px-2">
                  <p className="text-lg md:text-xl text-rose-700/90 font-medium italic leading-relaxed">
                    "This is our second Valentine's together. I am happy we were able to make it here together. You've been an integral part of my growth, and I will be delighted and happy as you are my Valentine. No matter time or place, no matter how many years go by, I will always ask you to be my girlfriend."
                  </p>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-rose-600 mb-8 font-hand drop-shadow-sm leading-tight">
                  Will you be my Valentine?
                </h1>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full min-h-[100px] relative">
                  <button
                    className={`bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-green-200/50 shadow-xl transform transition-all duration-200 hover:scale-110 active:scale-95 z-10`}
                    style={{ fontSize: Math.min(yesButtonSize, 100), padding: `${Math.min(yesButtonSize * 0.5, 50)}px ${Math.min(yesButtonSize, 100)}px` }}
                    onClick={handleYesClick}
                  >
                    Yes!
                  </button>

                  <motion.button
                    ref={noBtnRef}
                    animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onMouseEnter={handleNoInteraction}
                    onClick={handleNoInteraction}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-rose-200/50 shadow-xl z-20 min-w-[120px]"
                  >
                    {getNoButtonText()}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="fixed bottom-4 w-full text-center text-rose-400 text-sm font-medium">
        Made with ❤️ for you
      </footer>
    </div>
  );
};

export default App;