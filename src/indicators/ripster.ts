import { IChartApi, ISeriesApi, Time } from "lightweight-charts";
import { HLCAreaSeries } from "../plugins/hlc-series/hlc-series";
import { useEffect, useRef } from "react";
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
const Ripster: React.FC<HLCprops> = ({ chartInstance, candleSticks }) => {
  const emaLongRef = React.useRef<ISeriesApi<"Custom"> | null>();
  const emaMidRef = React.useRef<ISeriesApi<"Custom"> | null>();
  const emaSmallRef = React.useRef<ISeriesApi<"Custom"> | null>();
  const emaSeriesRefs = useRef<(ISeriesApi<"Custom"> | null)[]>([]);

  // candleSticks = candleSticks?.splice(0,500)
  function combineEmaData(emaLow: EMAData[], emaHigh: EMAData[]) {
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
  }

  useEffect(() => {
    if (!chartInstance || !candleSticks || candleSticks.length === 0) return;
    const hl2 = candleSticks?.map((candle) => (candle.high + candle.low) / 2);
    const ema34 = calculateEma(34, hl2, candleSticks);
    const ema50 = calculateEma(50, hl2, candleSticks);
    const ema5 = calculateEma(5, hl2, candleSticks);
    const ema8 = calculateEma(8, hl2, candleSticks);
    const ema9 = calculateEma(9, hl2, candleSticks);
    const ema13 = calculateEma(13, hl2, candleSticks);

    // Usage
    const combinedLongEMA = combineEmaData(ema34, ema50);
    const combinedMidEMA = combineEmaData(ema5, ema13);
    const combinedSmallEMA = combineEmaData(ema8, ema9);

    const emaSeriesLong = new HLCAreaSeries();
    const emaSeriesMid = new HLCAreaSeries();
    const emaSeriesSmall = new HLCAreaSeries();
    emaLongRef.current = chartInstance?.addCustomSeries(emaSeriesLong, {
      /* Options */
      positiveColor: "#bcdffb",
      negativeColor: "#ffe9c9",
    });
    emaMidRef.current = chartInstance?.addCustomSeries(emaSeriesMid, {
      /* Options */
      positiveColor: "#bfe1c0",
      negativeColor: "#fbbdb9",
    });
    emaSmallRef.current = chartInstance?.addCustomSeries(emaSeriesSmall, {
      /* Options */
      positiveColor: "#67aa68",
      negativeColor: "#d97786",
    });

    emaLongRef.current?.setData(combinedLongEMA);
    emaMidRef.current?.setData(combinedMidEMA);
    emaSmallRef.current?.setData(combinedSmallEMA);
    emaSeriesRefs.current.push(
      emaLongRef.current,
      emaMidRef.current,
      emaSmallRef.current
    );

    chartInstance?.timeScale().setVisibleRange({
      from: candleSticks?.[0].time as string,
      to: candleSticks?.[candleSticks.length - 1].time as string,
    });
    return () => {
      emaSeriesRefs.current.forEach((ref) => {
        if (ref && chartInstance != undefined) {
          chartInstance?.removeSeries(ref);
        }
      });
      emaSeriesRefs.current = [];
    };
  }, [chartInstance, candleSticks]);

  return null;
};
export default Ripster;
