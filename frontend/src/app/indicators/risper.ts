import React, { useRef, useEffect } from "react";
import { IChartApi, ISeriesApi, Time, LineStyle } from "lightweight-charts";
import { ema } from "technicalindicators";

interface CandleStick {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface RipsterProps {
  candleSticks: CandleStick[] | undefined;
  chartInstance: IChartApi | null;
}

const Ripster: React.FC<RipsterProps> = ({ candleSticks, chartInstance }) => {
  const seriesRefs = useRef<(ISeriesApi<"Line"> | null)[]>([]);
  const areaSeriesRefs = useRef<(ISeriesApi<"Area"> | null)[]>([]);

  useEffect(() => {
    if (!chartInstance || !candleSticks || candleSticks.length === 0) return;

    const hl2 = candleSticks.map((candle) => (candle.high + candle.low) / 2);

    const emaPeriods = [5, 8, 9, 12, 34, 50];
    const emaColors = ["#4caf50", "#036103", "#880e4f", "#f44336", "#1f2937", "#ffb74d"];
    const fillPairs = [[0, 3], [1, 2], [4, 5]]; // Pairs to fill: [5, 12], [8, 9], [34, 50]
    const fillColors = ["rgba(76, 175, 80, 0.2)", "rgba(136, 14, 79, 0.2)", "rgba(31, 41, 55, 0.2)"];

    const emaValues = emaPeriods.map(period => {
      const values = ema({ period, values: hl2 });
      return [...new Array(period - 1).fill(null), ...values];
    });

    emaPeriods.forEach((period, index) => {
      const emaData = emaValues[index].map((value, i) => {
        if (value === null) return null;
        return {
          time: candleSticks[i].time,
          value: value,
        };
      }).filter((item): item is { time: Time; value: number } => item !== null);

      if (!seriesRefs.current[index]) {
        seriesRefs.current[index] = chartInstance.addLineSeries({
          color: emaColors[index],
          lineWidth: 1,
          lineStyle: LineStyle.Solid,
        });
      }

      seriesRefs.current[index]?.setData(emaData);
    });

    // Add filled areas
    fillPairs.forEach(([index1, index2], pairIndex) => {
      const areaData = candleSticks.map((candle, i) => {
        const value1 = emaValues[index1][i];
        const value2 = emaValues[index2][i];
        if (value1 === null || value2 === null) return null;
        return {
          time: candle.time,
          value: Math.min(value1, value2),
        };
      }).filter((item): item is { time: Time; value: number } => item !== null);

      if (!areaSeriesRefs.current[pairIndex]) {
        areaSeriesRefs.current[pairIndex] = chartInstance.addAreaSeries({
          topColor: fillColors[pairIndex],
          bottomColor: 'rgba(255, 255, 255, 0)',
          lineColor: 'rgba(255, 255, 255, 0)',
          lineWidth: 1,
        });
      }

      areaSeriesRefs.current[pairIndex]?.setData(areaData);
    });

    // Cleanup function
    return () => {
      seriesRefs.current.forEach((ref) => {
        if (ref) {
          chartInstance.removeSeries(ref);
        }
      });
      areaSeriesRefs.current.forEach((ref) => {
        if (ref) {
          chartInstance.removeSeries(ref);
        }
      });
      seriesRefs.current = [];
      areaSeriesRefs.current = [];
    };
  }, [candleSticks, chartInstance]);

  return null; // This component doesn't render anything
};

export default Ripster;