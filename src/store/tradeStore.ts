// src/zustand/store.js
import { TradeStore } from "@/types/trades";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

const initialState = {
  loading: false,
  success: false,
  error: false,
  data: [],
  errorData: null,
};

export const useTrades = create<TradeStore>((set, get) => ({
  ...initialState,
  execute: async () => {
    set({ ...initialState, loading: true });
    try {
      const res = await axios.get("/api/trades");
      set({ ...initialState, success: true, data: res.data });
    } catch (err: AxiosError | any) {
      console.error("Error in data fetch:", err);
      set({ ...initialState, error: true, errorData: err.message });
    }
  },

}));