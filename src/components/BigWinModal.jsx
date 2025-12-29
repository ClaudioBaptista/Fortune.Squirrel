import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BigWinModal = ({ amount, onClose }) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  // Efeito de contagem numérica (Count Up)
  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 segundos para contar tudo
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = amount / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= amount) {
        setDisplayAmount(amount);
        clearInterval(timer);
        // Fecha automaticamente após mostrar o valor final por um tempo
        setTimeout(onClose, 2000);
      } else {
        setDisplayAmount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [amount, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative flex flex-col items-center">
        {/* Explosão de Luz atrás */}
        <div className="absolute animate-[spin_4s_linear_infinite] w-[500px] h-[500px] bg-[conic-gradient(from_0deg,transparent_0deg,#ffd700_90deg,transparent_180deg,#ffd700_270deg,transparent_360deg)] opacity-30 blur-md rounded-full -z-10"></div>
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-6xl md:text-8xl font-fortune text-[#ffd700] drop-shadow-[0_5px_0_#b8860b] stroke-black"
          style={{ WebkitTextStroke: '2px #3d0000' }}
        >
          BIG WIN
        </motion.div>
        
        <div className="mt-4 text-4xl md:text-6xl font-fortune text-white drop-shadow-md">
          R$ {displayAmount.toFixed(2)}
        </div>

        <div className="mt-8 text-sm text-yellow-200 font-bold uppercase tracking-widest animate-pulse">
          Toque para pular
        </div>
      </div>
    </motion.div>
  );
};

export default BigWinModal;