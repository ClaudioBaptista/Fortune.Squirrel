import React from 'react';
import { motion } from 'framer-motion';

const SlotSymbol = ({ symbol, isWin, isWildDropTarget }) => {
  // Base para todos os símbolos (efeito de profundidade 3D)
  const baseClasses = "relative w-20 h-20 flex items-center justify-center rounded-xl transition-transform";
  
  // Estilo específico para o WILD (A Noz Dourada)
  if (symbol.isWild) {
    return (
      <motion.div 
        className={`${baseClasses} bg-gradient-to-br from-fortuneGold-base to-fortuneGold-dark shadow-gold-glow-md border-2 border-fortuneGold-light`}
        animate={isWin ? { scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] } : {}}
        transition={{ duration: 0.8, repeat: isWin ? Infinity : 0 }}
      >
        {/* Efeito de brilho interno girando */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#fff2b3_100%)] opacity-50 rounded-xl animate-spin-slow"></div>
        
        {/* O Ícone */}
        <span className="text-5xl relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
          {symbol.icon}
        </span>

        {/* Flash quando é alvo do arremesso */}
        {isWildDropTarget && (
            <motion.div initial={{opacity:0}} animate={{opacity:[0,1,0]}} transition={{duration:0.5}} className="absolute inset-0 bg-white rounded-xl z-20" />
        )}
      </motion.div>
    );
  }

  // Estilo para símbolos normais (Borda dourada mais sutil)
  return (
    <motion.div 
      className={`${baseClasses} bg-gradient-to-br from-fortuneRed-dark to-fortuneRed-darkest border border-fortuneGold-dark/30 shadow-inset-gold`}
       animate={isWin ? { scale: [1, 1.05, 1], y: [0, -2, 0] } : {}}
       transition={{ duration: 0.6, repeat: isWin ? Infinity : 0 }}
    >
      <span className="text-5xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] grayscale-[0.2] group-hover:grayscale-0 transition-all">
        {symbol.icon}
      </span>
    </motion.div>
  );
};

export default SlotSymbol;