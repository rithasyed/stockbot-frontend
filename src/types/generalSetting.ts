
export type GeneralSettingStore = {
  TTM: boolean;
  theme: "light" | "dark";
  setTTM: (TTM: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
};
