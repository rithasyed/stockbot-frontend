// src/zustand/store.js
import { GeneralSettingStore } from "@/types/generalSetting";
import { create } from "zustand";

const initialState = {
  TTM: false,
  theme: "light" as "light" | "dark",
};

export const useGeneralSetting = create<GeneralSettingStore>((set, get) => ({
  ...initialState,
  setTTM(TTM: boolean) {
    set({ ...get(), TTM });
  },
  setTheme(theme: "light" | "dark") {
    set({ ...get(), theme: theme });
  },
}));
