export interface Symbols {
    id: number;
    name: string;
  }

export type SymbolsStore = {
    loading: boolean;
    success: boolean;
    error: boolean;
    data: Symbols[];
    errorData: null;
    execute: () => void;
    addSymbol: (symbol: string) => void;
  };