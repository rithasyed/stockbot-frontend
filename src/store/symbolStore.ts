// src/zustand/store.js
import { Symbols, SymbolsStore } from "@/types/symbols";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

const initialState = {
  loading: false,
  success: false,
  error: false,
  data: [],
  errorData: null,
};

export const useSymbols = create<SymbolsStore>((set, get) => ({
  ...initialState,
  execute: async () => {
    set({ ...initialState, loading: true });
    try {
      const res = await axios.get("/api/symbols");
      set({ ...initialState, success: true, data: res.data });
    } catch (err: AxiosError | any) {
      console.error("Error in data fetch:", err);
      set({ ...initialState, error: true, errorData: err.message });
    }
  },
  addSymbol: async (symbol: string) => {
    set({ ...initialState, loading: true });
    try {
      const res = await axios.post("/api/symbols", { name: symbol });
      const symbols = get().data;
      const lastSymbol = symbols[symbols.length - 1];
      set({
        ...initialState,
        success: true,
        data: [...symbols, { id: lastSymbol.id + 1, name: res.data.name }],
      });
    } catch (err: AxiosError | any) {
      console.error("Error in data fetch:", err);
      set({ ...initialState, error: true, errorData: err.message });
    }
  },
}));
