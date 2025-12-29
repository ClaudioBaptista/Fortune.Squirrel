import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, Repeat, X, Coins, ChevronUp, RotateCw } from 'lucide-react';
import { generateGrid, generateRespinGrid, checkWin, checkFortuneTrigger } from './lib/logic';
import SlotSymbol from './components/SlotSymbol';
import BigWinModal from './components/BigWinModal'; // <--- IMPORTADO

const BET_OPTIONS = [0.40, 0.80, 1.20, 2.00, 4.00, 10.00, 20.00, 50.00, 100.00];
const ANIMATION_DURATION = { normal: 600, turbo: 250 };

const BackgroundParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-fortuneGold-base rounded-full opacity-30"
        style={{ width: Math.random() * 4 + 'px', height: Math.random() * 4 + 'px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%' }}
        animate={{ y: [0, -100], opacity: [0, 0.5, 0] }}
        transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </div>
);

const App = () => {
  // ESTADOS
  const [grid, setGrid] = useState(generateGrid());
  const [balance, setBalance] = useState(1000.00);
  const [currentBet, setCurrentBet] = useState(0.80);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRespinning, setIsRespinning] = useState(false);
  const [winData, setWinData] = useState({ totalWin: 0, winningLines: [] });
  
  // UI & UX
  const [turboMode, setTurboMode] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [showBetMenu, setShowBetMenu] = useState(false);
  const [showBigWin, setShowBigWin] = useState(false); // <--- ESTADO DO POPUP

  // ANIMAÇÃO
  const [squirrelAction, setSquirrelAction] = useState('idle'); 
  const [flyingWilds, setFlyingWilds] = useState([]); 
  const [wildLandTargets, setWildLandTargets] = useState([]);

  // ENGINE
  const handleSpin = () => {
    if (balance < currentBet) { alert("Saldo Insuficiente"); setAutoMode(false); return; }
    
    setShowBetMenu(false);
    setSquirrelAction('idle');
    setWildLandTargets([]);

    if (!isRespinning) {
        setBalance(prev => prev - currentBet);
        setWinData({ totalWin: 0, winningLines: [] });
    }
    
    setIsSpinning(true);

    const duration = turboMode ? ANIMATION_DURATION.turbo : ANIMATION_DURATION.normal;
    const intervalTime = turboMode ? 50 : 80;

    const spinInterval = setInterval(() => {
      isRespinning ? setGrid(prev => generateRespinGrid(prev[1])) : setGrid(generateGrid());
    }, intervalTime);

    setTimeout(() => {
      clearInterval(spinInterval);
      let finalGrid = isRespinning ? generateRespinGrid(grid[1]) : generateGrid();
      
      const fortuneTriggered = checkFortuneTrigger(finalGrid);
      
      if (fortuneTriggered && !isRespinning) {
          triggerWildDrop(finalGrid);
      } else {
          setGrid(finalGrid);
          processResult(finalGrid, fortuneTriggered);
      }
    }, duration);
  };

  const triggerWildDrop = (finalGrid) => {
      setSquirrelAction('throw');
      setFlyingWilds([{ id: 1, targetIndex: 0 }, { id: 2, targetIndex: 1 }, { id: 3, targetIndex: 2 }]);

      setTimeout(() => {
          setFlyingWilds([]); 
          setGrid(finalGrid);
          setWildLandTargets([0,1,2]);
          setTimeout(() => {
              setWildLandTargets([]);
              processResult(finalGrid, true); 
          }, 300);
      }, 400);
  };

  const processResult = (finalGrid, fortuneTriggered) => {
    const result = checkWin(finalGrid);

    if (result.totalWin > 0) {
        const realPrize = (result.totalWin / 10) * currentBet;
        setBalance(prev => prev + realPrize);
        setWinData({ ...result, totalWin: realPrize });
        triggerWinEffects(realPrize); // <--- AQUI CHAMA O EFEITO
        
        setIsRespinning(false);
        setIsSpinning(false);
    } else if (fortuneTriggered) {
        setIsRespinning(true);
        setTimeout(() => handleSpin(), 600); 
    } else {
        setIsSpinning(false);
        if (isRespinning) setTimeout(() => handleSpin(), 500);
    }
  };

  const triggerWinEffects = (amount) => {
    // Se ganhou mais que 5x a aposta, mostra o BIG WIN
    if (amount >= currentBet * 5) {
      setSquirrelAction('win');
      setShowBigWin(true); // Abre o Modal
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.7 }, colors: ['#FFD700', '#b8860b', '#FF0000'] });
    }
  };

  // Auto Spin
  useEffect(() => {
      if (autoMode && !isSpinning && !isRespinning && !showBigWin && balance >= currentBet) {
          const timer = setTimeout(() => handleSpin(), 1000);
          return () => clearTimeout(timer);
      }
  }, [autoMode, isSpinning, isRespinning, showBigWin, balance]);

  return (
    // ADICIONEI "font-fortune" AQUI NO CONTAINER PRINCIPAL
    <div className="min-h-screen bg-fortuneRed-darkest text-white flex flex-col items-center font-fortune overflow-hidden select-none relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,#4a0000_0%,#1a0000_80%)] z-0"></div>
      <BackgroundParticles />

      {/* MODAL DE BIG WIN (APARECE POR CIMA DE TUDO) */}
      <AnimatePresence>
        {showBigWin && (
          <BigWinModal amount={winData.totalWin} onClose={() => setShowBigWin(false)} />
        )}
      </AnimatePresence>

      {/* HEADER ESQUILO */}
      <div className="h-1/3 w-full flex items-end justify-center pb-6 relative z-10">
          <div className="absolute bottom-0 w-64 h-20 bg-[radial-gradient(ellipse_at_center,#ffd700_0%,transparent_70%)] opacity-30 blur-xl"></div>

          <motion.div 
            animate={
                squirrelAction === 'throw' ? { scale: 1.1, y: -30, rotate: [0, -10, 10, 0] } :
                squirrelAction === 'win' ? { scale: [1, 1.3, 1], rotate: [0, 5, -5, 0], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] } :
                isRespinning ? { scale: [1, 1.05, 1], y: [0, -10, 0] } : 
                { y: [0, -8, 0] }
            }
            transition={{ duration: squirrelAction === 'throw' ? 0.4 : (isRespinning ? 0.6 : 3), repeat: squirrelAction === 'idle' ? Infinity : 0 }}
            className="text-9xl drop-shadow-gold-glow-md relative z-20 origin-bottom"
          >
            🐿️
          </motion.div>

          {/* PLACA DE GANHO PEQUENA (SÓ SE NÃO TIVER O BIG WIN) */}
          <AnimatePresence>
              {winData.totalWin > 0 && !showBigWin && (
                  <motion.div 
                    initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }}
                    className="absolute bottom-12 z-30 bg-gradient-to-r from-red-600 to-red-900 border-y-4 border-fortuneGold-base px-10 py-2 rounded-2xl shadow-gold-glow-lg"
                  >
                    <div className="text-fortuneGold-base text-xs uppercase tracking-widest text-center">Ganho</div>
                    <div className="text-white text-3xl text-center stroke-black drop-shadow-md">
                        R$ {winData.totalWin.toFixed(2)}
                    </div>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>

      {/* NOZES VOADORAS */}
      <AnimatePresence>
        {flyingWilds.map((wild) => (
            <motion.div
                key={wild.id}
                initial={{ top: "25%", left: "50%", x: "-50%", scale: 0.2, opacity: 1 }}
                animate={{ top: `calc(48% + ${wild.targetIndex * 85}px)`, scale: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 1.5 }} 
                transition={{ duration: 0.4, ease: "backIn" }}
                className="absolute z-50 text-7xl drop-shadow-gold-glow-lg"
                style={{ position: 'absolute' }}
            >
                🌰
                <motion.div animate={{ height: [0, 100], opacity: [1, 0] }} className="absolute bottom-1/2 left-1/2 w-4 -translate-x-1/2 bg-fortuneGold-base blur-md origin-bottom -z-10" />
            </motion.div>
        ))}
      </AnimatePresence>

      {/* AREA DO JOGO */}
      <div className="relative z-10 bg-gradient-to-b from-fortuneRed-dark to-fortuneRed-darkest p-4 pt-10 rounded-t-[50px] border-t-8 border-fortuneGold-dark shadow-[0_-20px_60px_rgba(0,0,0,0.9)] w-full max-w-md flex-1 flex flex-col items-center">
          
          <div className="w-full px-8 flex justify-between mb-6 relative z-10">
              <div className="bg-fortuneRed-darkest/80 px-4 py-2 rounded-full border-2 border-fortuneGold-dark/50 min-w-[110px] shadow-inset-gold backdrop-blur-md flex flex-col items-center">
                  <div className="text-[10px] text-fortuneGold-light uppercase tracking-wider">Saldo</div>
                  <div className="text-sm text-white">R$ {balance.toFixed(2)}</div>
              </div>
              <div className="bg-fortuneRed-darkest/80 px-4 py-2 rounded-full border-2 border-fortuneGold-dark/50 min-w-[110px] shadow-inset-gold backdrop-blur-md flex flex-col items-center">
                  <div className="text-[10px] text-fortuneGold-light uppercase tracking-wider">Ganho</div>
                  <div className="text-sm text-fortuneGold-base">R$ {winData.totalWin.toFixed(2)}</div>
              </div>
          </div>

          <div className="relative z-10 p-3 bg-fortuneRed-darkest rounded-2xl border-4 border-fortuneGold-dark shadow-inset-gold">
              <div className="absolute inset-0 bg-reel-gradient rounded-xl opacity-80"></div>
              <div className="grid grid-cols-3 gap-2 relative">
                  {grid.map((col, cIdx) => (
                      <div key={cIdx} className={`flex flex-col gap-2 ${isRespinning && cIdx === 1 ? 'z-20' : ''}`}>
                          {col.map((symbol, rIdx) => {
                              const isWin = winData.totalWin > 0 && winData.winningLines.some(() => symbol.value > 5);
                              const isWildTarget = isRespinning && cIdx === 1 && wildLandTargets.includes(rIdx);
                              return <SlotSymbol key={rIdx} symbol={symbol} isWin={isWin} isWildDropTarget={isWildTarget} />;
                          })}
                      </div>
                  ))}
                  {isRespinning && <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-0 bottom-0 left-[33.33%] right-[33.33%] border-4 border-fortuneGold-base rounded-xl shadow-gold-glow-md pointer-events-none z-30 animate-pulse" />}
              </div>
          </div>

          {/* CONTROLES */}
          <div className="mt-auto w-full pb-8 px-6 relative z-10">
              <div className="flex items-center justify-between gap-6">
                  
                  <button onClick={() => setTurboMode(!turboMode)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 transition-all shadow-lg active:scale-95 ${turboMode ? 'bg-orb-gradient border-fortuneGold-light' : 'bg-fortuneRed-darkest border-fortuneGold-dark/50 opacity-80'}`}>
                      <Zap size={24} className={turboMode ? "text-fortuneRed-darkest" : "text-fortuneGold-dark"} fill={turboMode ? "currentColor" : "none"} />
                      <span className={`text-[10px] mt-1 ${turboMode ? "text-fortuneRed-darkest" : "text-fortuneGold-dark"}`}>TURBO</span>
                  </button>

                  <div className="flex-1 flex flex-col items-center justify-end -mt-10 relative">
                      <button
                          onClick={isRespinning ? null : (autoMode ? () => setAutoMode(false) : handleSpin)}
                          disabled={(isSpinning && !autoMode && !isRespinning) || showBetMenu}
                          className={`w-24 h-24 rounded-full border-4 shadow-gold-glow-md flex items-center justify-center transition-all active:scale-95 mb-3 relative z-10 overflow-hidden
                              ${isRespinning ? 'bg-fortuneGold-base border-white animate-pulse' : autoMode ? 'bg-gradient-to-b from-red-500 to-red-800 border-red-400' : 'bg-orb-gradient border-fortuneGold-light hover:shadow-gold-glow-lg'}`}
                      >
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#ffffff_0%,transparent_50%)] opacity-40"></div>
                           {isRespinning ? <span className="text-fortuneRed-darkest text-xs tracking-widest">RESPIN</span> : autoMode ? <div className="flex flex-col items-center leading-none text-white drop-shadow-md"><span className="text-lg">PARAR</span><span className="text-[9px]">AUTO</span></div> : isSpinning ? <RotateCw size={40} className="text-fortuneRed-darkest animate-spin" /> : <Repeat size={40} className="text-fortuneRed-darkest rotate-90 drop-shadow-sm" strokeWidth={3} />}
                      </button>

                      <button onClick={() => setShowBetMenu(!showBetMenu)} className="bg-gradient-to-r from-fortuneGold-dark to-fortuneGold-base border-2 border-fortuneGold-light/50 px-6 py-2 rounded-full flex items-center gap-3 shadow-gold-glow-sm active:scale-95 transition-transform">
                        <div className="flex flex-col items-center leading-none">
                            <span className="text-[9px] text-fortuneRed-darkest uppercase tracking-wider">Aposta</span>
                            <span className="text-base text-fortuneRed-darkest">R$ {currentBet.toFixed(2)}</span>
                        </div>
                        <ChevronUp size={18} className={`text-fortuneRed-darkest transition-transform ${showBetMenu ? 'rotate-180' : ''}`} strokeWidth={3} />
                      </button>
                  </div>

                  <button onClick={() => setAutoMode(!autoMode)} className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 transition-all shadow-lg active:scale-95 ${autoMode ? 'bg-gradient-to-b from-green-500 to-green-800 border-green-300' : 'bg-fortuneRed-darkest border-fortuneGold-dark/50 opacity-80'}`}>
                      <Repeat size={24} className={autoMode ? "text-white" : "text-fortuneGold-dark"} />
                      <span className={`text-[10px] mt-1 ${autoMode ? "text-white" : "text-fortuneGold-dark"}`}>AUTO</span>
                  </button>
              </div>
          </div>
      </div>

      <AnimatePresence>
        {showBetMenu && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-fortuneRed-darkest/90 backdrop-blur-sm z-40" onClick={() => setShowBetMenu(false)} />
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-fortuneRed-dark to-fortuneRed-darkest rounded-t-[40px] border-t-4 border-fortuneGold-base z-50 p-6 pb-10 shadow-gold-glow-lg">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3 text-fortuneGold-base">
                            <Coins size={28} className="drop-shadow-gold-glow-sm" />
                            <span className="text-2xl uppercase tracking-wide drop-shadow-sm">Valor da Aposta</span>
                        </div>
                        <button onClick={() => setShowBetMenu(false)} className="text-fortuneGold-dark bg-fortuneRed-darkest p-2 rounded-full border border-fortuneGold-dark/30 active:scale-90 transition-transform"><X size={20} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {BET_OPTIONS.map((bet) => (
                            <button key={bet} onClick={() => { setCurrentBet(bet); setShowBetMenu(false); }} className={`py-5 rounded-2xl text-xl border-2 transition-all relative overflow-hidden group ${currentBet === bet ? 'bg-orb-gradient border-fortuneGold-light text-fortuneRed-darkest shadow-gold-glow-md scale-105' : 'bg-fortuneRed-darkest border-fortuneGold-dark/30 text-fortuneGold-base hover:border-fortuneGold-base hover:text-white'}`}>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ffffff_0%,transparent_40%)] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <span className="text-xs block -mb-1 opacity-80">R$</span>
                                {bet.toFixed(2)}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;