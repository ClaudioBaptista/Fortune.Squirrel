import { SYMBOLS } from './symbols';

const PAYLINES = [
  [{c:0, r:0}, {c:1, r:0}, {c:2, r:0}], // Topo
  [{c:0, r:1}, {c:1, r:1}, {c:2, r:1}], // Meio
  [{c:0, r:2}, {c:1, r:2}, {c:2, r:2}], // Baixo
  [{c:0, r:0}, {c:1, r:1}, {c:2, r:2}], // Diagonal \
  [{c:0, r:2}, {c:1, r:1}, {c:2, r:0}], // Diagonal /
];

export const getRandomSymbol = () => {
  const totalWeight = SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
  let randomNum = Math.random() * totalWeight;
  for (let symbol of SYMBOLS) {
    if (randomNum < symbol.weight) return symbol;
    randomNum -= symbol.weight;
  }
  return SYMBOLS[SYMBOLS.length - 1];
};

export const generateGrid = () => {
  return [
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
  ];
};

// --- NOVA FUNÇÃO: Gera apenas os laterais (mantém o meio fixo) ---
export const generateRespinGrid = (lockedMiddleCol) => {
  return [
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()], // Gira Esq
    lockedMiddleCol,                                           // Mantém Meio
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()], // Gira Dir
  ];
};

export const checkWin = (grid) => {
  let totalWin = 0;
  let winningLines = [];

  PAYLINES.forEach((line, index) => {
    const s1 = grid[line[0].c][line[0].r];
    const s2 = grid[line[1].c][line[1].r];
    const s3 = grid[line[2].c][line[2].r];

    const symbols = [s1, s2, s3];
    // Identifica qual símbolo estamos buscando (ignora Wilds)
    const reference = symbols.find(s => !s.isWild) || s1; 

    // Verifica match (Symbolo igual OU Wild)
    const isMatch = symbols.every(s => s.id === reference.id || s.isWild);

    if (isMatch) {
      // Se forem 3 Wilds, paga o valor do Wild. Se não, paga o valor do símbolo normal.
      const symbolValue = reference.isWild ? s1.value : reference.value;
      totalWin += symbolValue;
      winningLines.push(index);
    }
  });

  return { totalWin, winningLines };
};

// --- NOVA FUNÇÃO: Verifica se ativou o modo Fortune (Meio cheio de Wilds) ---
export const checkFortuneTrigger = (grid) => {
    // Coluna 1 é a do meio (0, 1, 2)
    const middleCol = grid[1]; 
    // Verifica se todos na coluna do meio são Wild
    return middleCol.every(s => s.isWild);
};