import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Coins, Trophy } from 'lucide-react';

// --- CONFIGURAÇÃO DOS SÍMBOLOS ---
const SYMBOLS = [
  { icon: '🍒', value: 2, weight: 40 }, // Comum
  { icon: '🍋', value: 5, weight: 30 },
  { icon: '🍊', value: 10, weight: 20 },
  { icon: '💎', value: 20, weight: 8 },
  { icon: '7️⃣', value: 50, weight: 2 }, // Jackpot
];

const SPIN_COST = 10;
const INITIAL_BALANCE = 500;

const App = () => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [reels, setReels] = useState(['❓', '❓', '❓']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState('');
  const [lastWin, setLastWin] = useState(0);

  // Lógica Matemática (RNG)
  const getRandomSymbol = () => {
    const totalWeight = SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (let symbol of SYMBOLS) {
      if (randomNum < symbol.weight) return symbol;
      randomNum -= symbol.weight;
    }
    return SYMBOLS[0];
  };

  const spin = () => {
    if (balance < SPIN_COST || isSpinning) return;

    setBalance((prev) => prev - SPIN_COST);
    setIsSpinning(true);
    setWinMessage('');
    setLastWin(0);

    // Efeito visual de girar
    let interval = setInterval(() => {
      setReels([getRandomSymbol().icon, getRandomSymbol().icon, getRandomSymbol().icon]);
    }, 100);

    // Parar e calcular resultado (após 2 segundos)
    setTimeout(() => {
      clearInterval(interval);
      const reel1 = getRandomSymbol();
      const reel2 = getRandomSymbol();
      const reel3 = getRandomSymbol();
      
      const finalReels = [reel1.icon, reel2.icon, reel3.icon];
      setReels(finalReels);
      checkWin(finalReels, [reel1, reel2, reel3]);
      setIsSpinning(false);
    }, 2000);
  };

  const checkWin = (icons, symbolObjects) => {
    if (icons[0] === icons[1] && icons[1] === icons[2]) {
      const prize = symbolObjects[0].value * SPIN_COST;
      setBalance((prev) => prev + prize);
      setLastWin(prize);
      setWinMessage(`BIG WIN! +$${prize}`);
      triggerConfetti();
    } 
    else if (icons[0] === icons[1] || icons[1] === icons[2] || icons[0] === icons[2]) {
      const prize = 2; // Pequeno prêmio de consolação
      setBalance((prev) => prev + prize);
      setLastWin(prize);
      setWinMessage(`Quase! +$${prize}`);
    } else {
      setWinMessage('Tente novamente');
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#ff00ff', '#ffffff']
    });
  };

  return (
    <div className="min-h-screen bg-slotBg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/40 backdrop-blur-lg border-2 border-gold/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,215,0,0.15)]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-black/60 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-gold font-bold text-xl">
            <Coins size={24} />
            <span>${balance}</span>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            BET: ${SPIN_COST}
          </div>
        </div>

        {/* REELS AREA */}
        <div className="flex gap-4 mb-8 bg-slotReel p-6 rounded-2xl border-4 border-gold shadow-inner relative overflow-hidden">
           <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500/30 -translate-y-1/2 z-0"></div>
           
           {reels.map((symbol, index) => (
             <div key={index} className="flex-1 h-28 bg-white/5 rounded-lg flex items-center justify-center text-6xl z-10 border border-white/10">
                <motion.div
                  key={isSpinning ? Math.random() : index}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  {symbol}
                </motion.div>
             </div>
           ))}
        </div>

        {/* FEEDBACK MSG */}
        <div className="h-10 text-center mb-6">
          {winMessage && (
             <div className={`font-black text-xl uppercase ${lastWin > 5 ? 'text-neonPink' : 'text-gray-300'}`}>
               {winMessage}
             </div>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={spin}
          disabled={isSpinning || balance < SPIN_COST}
          className={`w-full py-5 rounded-xl font-black text-2xl uppercase tracking-widest transition-all 
            ${isSpinning || balance < SPIN_COST 
              ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
              : 'bg-gradient-to-r from-gold to-yellow-600 text-black hover:scale-105 shadow-[0_0_20px_#FFD700]'
            }`}
        >
          {isSpinning ? 'Girando...' : 'GIRAR'}
        </button>

      </div>
    </div>
  );
};

export default App;