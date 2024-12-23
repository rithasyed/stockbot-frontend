import { Time } from "lightweight-charts";

export interface ChartProps {
  data: {
    candlestick: {
      time: Time;
      open: number;
      high: number;
      low: number;
      close: number;
    }[];
    ema: { time: Time; value: number }[];
    macd: { time: Time; macd: number; signal: number; histogram: number }[];
    vwap: { time: Time; vwap: number; upper: number; lower: number }[];
    vwap_signals: {
      time: Time;
      signal_up: boolean;
      signal_down: boolean;
      ripster_signal_up: boolean;
      ripster_signal_down: boolean;
      yellow_signal_up: boolean;
      yellow_signal_down: boolean;
      rsi_exit_up: boolean;
      rsi_exit_down: boolean;
    }[];
    ttm_squeeze_signals: {
      time: Time;
      squeeze_signal_up: boolean;
      squeeze_signal_down: boolean;
      ripster_signal_up: boolean;
      ripster_signal_down: boolean;
      yellow_signal_up: boolean;
      yellow_signal_down: boolean;
      signal_red_dot: boolean;
      rsi_exit_up: boolean;
      rsi_exit_down: boolean;
    }[];
    ttm_waves: {
      time: Time;
      momentum: number;
      ao: number;
      squeeze: string;
      atr1: number;
    }[];
  } | null;
}