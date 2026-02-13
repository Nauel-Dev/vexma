import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EnvelopeProps {
    onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(onOpen, 1000); // Wait for animation to finish before unmounting/hiding
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-100 overflow-hidden">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: isOpen ? 5 : 1, opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative cursor-pointer group"
                onClick={handleOpen}
            >
                <div className="w-72 h-48 bg-rose-300 rounded-lg shadow-2xl relative flex items-center justify-center border-2 border-rose-400">
                    {/* Flap */}
                    <motion.div
                        className="absolute top-0 w-0 h-0 border-l-[144px] border-l-transparent border-r-[144px] border-r-transparent border-t-[100px] border-t-rose-400 origin-top"
                        animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 20 }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* Letter inside */}
                    <motion.div
                        className="absolute bg-white w-64 h-40 rounded shadow-sm flex items-center justify-center"
                        initial={{ y: 0 }}
                        animate={{ y: isOpen ? -100 : 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="text-center">
                            <span className="text-4xl">💌</span>
                            <p className="font-hand text-rose-500 mt-2 font-bold">For You</p>
                        </div>
                    </motion.div>

                    {/* Front pocket */}
                    <div className="absolute bottom-0 w-0 h-0 border-l-[144px] border-l-transparent border-r-[144px] border-r-transparent border-b-[100px] border-b-rose-300 z-10 drop-shadow-lg" />
                    <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[144px] border-l-rose-200 border-b-[90px] border-b-transparent z-10" />
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[144px] border-r-rose-200 border-b-[90px] border-b-transparent z-10" />

                    {/* Heart Seal */}
                    <motion.div
                        className="absolute top-[40%] text-6xl drop-shadow-md z-30"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        ❤️
                    </motion.div>

                    <motion.div
                        className="absolute -bottom-12 w-full text-center text-rose-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Click to Open
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Envelope;
