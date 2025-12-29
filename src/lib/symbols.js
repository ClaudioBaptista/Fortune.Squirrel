// Definição dos Símbolos e seus pagamentos
// IDs: W=Wild, H1=High1, L1=Low1, etc.

export const SYMBOLS = [
  { 
    id: 'W', 
    name: 'Golden Nut Wild', 
    icon: '🌰', // Placeholder: Noz Dourada
    isWild: true,
    value: 100, // Paga muito se vier 3 puros
    weight: 500 // Muito Raro (aprox 2% de chance por célula)
  },
  { 
    id: 'H1', 
    name: 'Saco de Moedas', 
    icon: '💰', 
    isWild: false,
    value: 50, 
    weight: 25 // Raro
  },
  { 
    id: 'H2', 
    name: 'Pilha de Nozes', 
    icon: '🥜', 
    isWild: false,
    value: 25, 
    weight: 40 // Médio
  },
  { 
    id: 'L1', 
    name: 'Bolota', 
    icon: '🌾', 
    isWild: false,
    value: 10, 
    weight: 80 // Comum
  },
  { 
    id: 'L2', 
    name: 'Folha de Carvalho', 
    icon: '🍃', 
    isWild: false,
    value: 5, 
    weight: 120 // Muito Comum
  },
];

// Função auxiliar para pegar um símbolo pelo ID
export const getSymbolById = (id) => SYMBOLS.find(s => s.id === id);