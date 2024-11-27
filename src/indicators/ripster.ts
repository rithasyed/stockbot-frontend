import { IChartApi, ISeriesApi, Time } from "lightweight-charts";
import { HLCAreaSeries } from "../plugins/hlc-series/hlc-series";
import { useEffect, useRef, useCallback } from "react";
import React from "react";
import { ema } from "technicalindicators";

interface CandleStick {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface EMAData {
  time: Time;
  value: number;
}

interface HLCprops {
  candleSticks: CandleStick[] | undefined;
  chartInstance: IChartApi | null;
  theme: string;
}

export function calculateEma(
  period: number,
  hl2: number[],
  candleSticks: CandleStick[]
) {
  const values = ema({ period, values: hl2 });
  const emaValues = [...new Array(period - 1).fill(null), ...values];
  const emaData = emaValues
    .map((value, i) => {
      if (value === null) return null;
      return {
        time: candleSticks?.[i]?.time,
        value: value,
      };
    })
    .filter((item): item is { time: Time; value: number } => item !== null);

  return emaData;
}

const Ripster: React.FC<HLCprops> = ({
  chartInstance,
  candleSticks,
  theme,
}) => {
  const emaLongRef = useRef<ISeriesApi<"Custom"> | null>(null);
  const emaMidRef = useRef<ISeriesApi<"Custom"> | null>(null);
  const emaSmallRef = useRef<ISeriesApi<"Custom"> | null>(null);
  const emaSeriesRefs = useRef<(ISeriesApi<"Custom"> | null)[]>([]);
  const prevChartInstanceRef = useRef<IChartApi | null>(null);

  const combineEmaData = useCallback((emaLow: EMAData[], emaHigh: EMAData[]) => {
    const combinedData = [];
    const ema50Map = new Map(emaHigh.map((item) => [item.time, item.value]));

    for (const emaLowItem of emaLow) {
      const emaLongValue = ema50Map.get(emaLowItem.time);
      if (emaLongValue !== undefined) {
        combinedData.push({
          time: emaLowItem.time,
          low: emaLowItem.value,
          high: emaLongValue,
        });
      }
    }

    return combinedData;
  }, []);

  const addEMASeries = useCallback((
    chartInstance: IChartApi, 
    theme: string, 
    candleSticks: CandleStick[]
  ) => {
    try {
      const hl2 = candleSticks.map((candle) => (candle.high + candle.low) / 2);
      const ema34 = calculateEma(34, hl2, candleSticks);
      const ema50 = calculateEma(50, hl2, candleSticks);
      const ema5 = calculateEma(5, hl2, candleSticks);
      const ema8 = calculateEma(8, hl2, candleSticks);
      const ema9 = calculateEma(9, hl2, candleSticks);
      const ema13 = calculateEma(13, hl2, candleSticks);

      // Combine EMA data
      const combinedLongEMA = combineEmaData(ema34, ema50);
      const combinedMidEMA = combineEmaData(ema5, ema13);
      const combinedSmallEMA = combineEmaData(ema8, ema9);

      // Create new series
      const emaSeriesLong = new HLCAreaSeries();
      const emaSeriesMid = new HLCAreaSeries();
      const emaSeriesSmall = new HLCAreaSeries();

      // Add custom series with theme-specific colors
      emaLongRef.current = chartInstance.addCustomSeries(emaSeriesLong, {
        positiveColor: theme !== "dark" ? "#bcdffb" : "#0047ab",
        negativeColor: theme !== "dark" ? "#ffe9c9" : "#ff8c00",
      });

      emaMidRef.current = chartInstance.addCustomSeries(emaSeriesMid, {
        positiveColor: theme !== "dark" ? "#bfe1c0" : "#228b22",
        negativeColor: theme !== "dark" ? "#fbbdb9" : "#ff6347",
      });

      emaSmallRef.current = chartInstance.addCustomSeries(emaSeriesSmall, {
        positiveColor: theme !== "dark" ? "#67aa68" : "#006400",
        negativeColor: theme !== "dark" ? "#d97786" : "#8b0000",
      });

      // Set data for each series
      emaLongRef.current?.setData(combinedLongEMA);
      emaMidRef.current?.setData(combinedMidEMA);
      emaSmallRef.current?.setData(combinedSmallEMA);

      // Update series refs
      emaSeriesRefs.current = [
        emaLongRef.current,
        emaMidRef.current,
        emaSmallRef.current
      ].filter((ref): ref is ISeriesApi<"Custom"> => ref !== null);

      return true;
    } catch (error) {
      console.error("Error adding EMA series:", error);
      return false;
    }
  }, [combineEmaData]);

  useEffect(() => {
    // Prevent unnecessary re-renders
    if (!candleSticks || candleSticks.length === 0) {
      console.log("No candlesticks data available");
      return;
    }

    // Remove previous series if chart instance changes or is null
    if (prevChartInstanceRef.current && prevChartInstanceRef.current !== chartInstance) {
      emaSeriesRefs.current.forEach((ref) => {
        if (ref && prevChartInstanceRef.current) {
          try {
            prevChartInstanceRef.current.removeSeries(ref);
          } catch (error) {
            console.error("Error removing previous series:", error);
          }
        }
      });
      emaSeriesRefs.current = [];
    }

    // Try to add series if chart instance is available
    if (chartInstance) {
      addEMASeries(chartInstance, theme, candleSticks);
      prevChartInstanceRef.current = chartInstance;
    } else {
      console.log("Chart instance is null, skipping EMA series addition");
    }

    // Cleanup function
    return () => {
      emaSeriesRefs.current.forEach((ref) => {
        if (ref && chartInstance) {
          try {
            chartInstance.removeSeries(ref);
          } catch (error) {
            console.error("Error removing series in cleanup:", error);
          }
        }
      });
      emaSeriesRefs.current = [];
      emaLongRef.current = null;
      emaMidRef.current = null;
      emaSmallRef.current = null;
    };
  }, [chartInstance, candleSticks, theme, addEMASeries]);

  return null;
};

export default React.memo(Ripster);