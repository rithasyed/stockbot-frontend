"use client";
import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  CrosshairMode,
  ISeriesApi,
  Time,
  DeepPartial,
  ChartOptions,
  ColorType,
  SeriesMarker,
  SeriesMarkerShape,
} from "lightweight-charts";
import Ripster from "../../indicators/ripster";
import { useGeneralSetting } from "@/store/generalSettingStore";
import { ChartProps } from "@/types/chart";


export default function Chart({ data }: ChartProps) {
  const { TTM, theme } = useGeneralSetting((state) => state);
  const chartRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<HTMLDivElement>(null);
  const ttmWavesChartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const macdChartInstance = useRef<IChartApi | null>(null);
  const ttmWavesChartInstance = useRef<IChartApi | null>(null);

  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const momentumSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const aoSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const squeezeSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const atr1SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const macdHistogramRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const macdLineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSignalRef = useRef<ISeriesApi<"Line"> | null>(null);
  const signalMarkersRef = useRef<ISeriesApi<"Line"> | null>(null);

  // const vwapLineRef = useRef<ISeriesApi<"Line"> | null>(null);
  // const vwapUpperBandRef = useRef<ISeriesApi<"Line"> | null>(null);
  // const vwapLowerBandRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (chartRef.current && macdChartRef.current && ttmWavesChartRef.current) {
      chartInstance.current = createChart(
        chartRef.current,
        getChartOptions(theme)
      );
      macdChartInstance.current = createChart(
        macdChartRef.current,
        getMACDChartOptions(theme)
      );
      ttmWavesChartInstance.current = createChart(
        ttmWavesChartRef.current,
        getTTMWavesOptions(theme)
      );

      candlestickSeriesRef.current =
        chartInstance.current.addCandlestickSeries();
      // emaLineRef.current = chartInstance.current.addLineSeries({
      //   color: "blue",
      //   lineWidth: 2,
      // });
      // vwapLineRef.current = chartInstance.current.addLineSeries({
      //   color: "purple",
      //   lineWidth: 2,
      // });
      // vwapUpperBandRef.current = chartInstance.current.addLineSeries({
      //   color: "rgba(255, 0, 0, 0.5)",
      //   lineWidth: 2,
      // });
      // vwapLowerBandRef.current = chartInstance.current.addLineSeries({
      //   color: "rgba(0, 255, 0, 0.5)",
      //   lineWidth: 2,
      // });
      // vwapAreaRef.current = chartInstance.current.addAreaSeries({
      //   topColor: "rgba(76, 175, 80, 0.2)",
      //   bottomColor: "rgba(76, 175, 80, 0.02)",
      //   lineColor: "rgba(76, 175, 80, 0)",
      // });

      atr1SeriesRef.current = ttmWavesChartInstance.current.addLineSeries({
        color: "rgba(255, 0, 0, 0.8)",
        lineWidth: 1,
        priceScaleId: "right",
      });

      momentumSeriesRef.current =
        ttmWavesChartInstance.current.addHistogramSeries({
          color: "#2962FF",
          priceFormat: { type: "volume" },
          priceScaleId: "right",
        });

      squeezeSeriesRef.current = ttmWavesChartInstance.current.addLineSeries({
        priceScaleId: "right",
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
        color: "rgba(0, 0, 0, 0)",
      });

      aoSeriesRef.current = ttmWavesChartInstance.current.addHistogramSeries({
        color: "#26A69A",
        priceFormat: { type: "volume" },
        priceScaleId: "right",
      });

      signalMarkersRef.current = chartInstance.current.addLineSeries({
        lastValueVisible: false,
        priceLineVisible: false,
      });
      macdHistogramRef.current = macdChartInstance.current.addHistogramSeries({
        // color: "#33cc00",
        // priceScaleId: "macd",
        priceLineVisible: false,
        priceFormat: {
          type: "volume",
          precision: 3,
        },
      });
      macdLineRef.current = macdChartInstance.current.addLineSeries({
        color: "blue",
        lineWidth: 2,
      });

      macdSignalRef.current = macdChartInstance.current.addLineSeries({
        color: "red",
        lineWidth: 2,
      });

      syncCharts(
        chartInstance.current,
        macdChartInstance.current,
        ttmWavesChartInstance.current,
        candlestickSeriesRef.current,
        macdLineRef.current
      );

      return () => {
        chartInstance.current?.remove();
        macdChartInstance.current?.remove();
        ttmWavesChartInstance.current?.remove();
      };
    }
  }, [theme]);

  useEffect(() => {
    try {
      if (
        data &&
        candlestickSeriesRef.current &&
        momentumSeriesRef.current &&
        aoSeriesRef.current &&
        squeezeSeriesRef.current &&
        atr1SeriesRef.current &&
        macdLineRef.current &&
        macdSignalRef.current &&
        macdHistogramRef.current
        // emaLineRef.current &&
        // vwapLineRef.current &&
        // vwapUpperBandRef.current &&
        // vwapLowerBandRef.current &&
        // vwapAreaRef.current &&
      ) {
        candlestickSeriesRef.current?.setData(data.candlestick);
        // emaLineRef.current.setData(data.ema);
        // vwapLineRef.current.setData(
        //   data.vwap.map((item) => ({ time: item.time, value: item.vwap }))
        // );
        // vwapUpperBandRef.current.setData(
        //   data.vwap.map((item) => ({ time: item.time, value: item.upper }))
        // );
        // vwapLowerBandRef.current.setData(
        //   data.vwap.map((item) => ({ time: item.time, value: item.lower }))
        // );
        // vwapAreaRef.current.setData(
        //   data.vwap.map((item) => ({
        //     time: item.time,
        //     value: item.upper,
        //     bottomValue: item.lower,
        //   }))
        // );
        atr1SeriesRef.current.setData(
          data.ttm_waves.map((item) => ({
            time: item.time,
            value: item.atr1,
          }))
        );

        momentumSeriesRef.current.setData(
          data.ttm_waves.map((item) => ({
            time: item.time,
            value: item.momentum,
            color:
              item.momentum >= 0
                ? item.momentum >
                  (data.ttm_waves[data.ttm_waves.indexOf(item) - 1]?.momentum ||
                    0)
                  ? "#00bcd4"
                  : "#2962ff"
                : item.momentum >
                  (data.ttm_waves[data.ttm_waves.indexOf(item) - 1]?.momentum ||
                    0)
                ? "#ffeb3b"
                : "#ff5252",
          }))
        );

        const squeezeData = data.ttm_waves.map((item) => ({
          time: item.time,
          value: 0,
        }));

        const squeezeMarkers: SeriesMarker<Time>[] = data.ttm_waves.map(
          (item) => ({
            time: item.time,
            position: "inBar",
            color:
              item.squeeze === "high"
                ? "#ff9800"
                : item.squeeze === "mid"
                ? "#ff5252"
                : item.squeeze === "low"
                ? "#363a45"
                : "#4caf50",
            shape: "circle",
            size: 0.5,
          })
        );

        squeezeSeriesRef.current.setData(squeezeData);
        squeezeSeriesRef.current.setMarkers(squeezeMarkers);

        aoSeriesRef.current.setData(
          data.ttm_waves.map((item) => ({
            time: item.time,
            value: item.ao,
            color:
              item.ao >= 0
                ? item.ao >
                  (data.ttm_waves[data.ttm_waves.indexOf(item) - 1]?.ao || 0)
                  ? "#26A69A"
                  : "#B2DFDB"
                : item.ao >
                  (data.ttm_waves[data.ttm_waves.indexOf(item) - 1]?.ao || 0)
                ? "#FFCDD2"
                : "#EF5350",
          }))
        );

        macdLineRef.current.setData(
          data.macd.map((item) => ({ time: item.time, value: item.macd }))
        );
        macdSignalRef.current.setData(
          data.macd.map((item) => ({ time: item.time, value: item.signal }))
        );

        macdHistogramRef.current.setData(
          data.macd.map((item, index) => {
            // Get previous histogram value for comparison
            const prevHistogram =
              index > 0 ? data.macd[index - 1].histogram : item.histogram;

            let color;
            if (item.histogram > 0) {
              // Positive histogram
              color = item.histogram >= prevHistogram ? "#26a69a" : "#b2dfdb"; // Dark green : Light green
            } else {
              // Negative histogram
              color = item.histogram <= prevHistogram ? "#ff5252" : "#ffcdd2"; // Dark red : Light red
            }

            return {
              time: item.time,
              value: item.histogram,
              color: color,
            };
          })
        );

        let markers: SeriesMarker<Time>[] = [];

        if (TTM) {
          // TTM Squeeze markers
          markers = data.ttm_squeeze_signals.flatMap((signal) => {
            const markers: SeriesMarker<Time>[] = [];
            if (signal.squeeze_signal_up) {
              markers.push({
                time: signal.time,
                position: "belowBar",
                color: "maroon",
                shape: "arrowUp",
                size: 2,
              });
            }
            if (signal.squeeze_signal_down) {
              markers.push({
                time: signal.time,
                position: "aboveBar",
                color: "maroon",
                shape: "arrowDown",
                size: 2,
              });
            }
            if (signal.ripster_signal_up) {
              markers.push({
                time: signal.time,
                position: "belowBar",
                color: "green",
                shape: "arrowUp",
                size: 2,
              });
            }
            if (signal.ripster_signal_down) {
              markers.push({
                time: signal.time,
                position: "aboveBar",
                color: "green",
                shape: "arrowDown",
                size: 2,
              });
            }
            // if(signal.signal_red_dot){
            //   markers.push({
            //     time: signal.time,
            //     position: "belowBar",
            //     color: "red",
            //     shape: "circle",
            //     size: 1,
            //   });
            // }

            if (signal.yellow_signal_up) {
              markers.push({
                time: signal.time,
                position: "belowBar",
                color: "yellow",
                shape: "arrowUp",
                size: 2,
              });
            }
            if (signal.yellow_signal_down) {
              markers.push({
                time: signal.time,
                position: "aboveBar",
                color: "yellow",
                shape: "arrowDown",
                size: 2,
              });
            }
            if (signal.rsi_exit_up) {
              markers.push({
                time: signal.time,
                position: "belowBar",
                color: "red",
                shape: "arrowUp",
                size: 2,
              });
            }
            if (signal.rsi_exit_down) {
              markers.push({
                time: signal.time,
                position: "aboveBar",
                color: "red",
                shape: "arrowDown",
                size: 2,
              });
            }
            return markers;
          });
        } else {
          // VWAP signals markers
          markers = data.vwap_signals.flatMap((signal) => {
            const markers: SeriesMarker<Time>[] = [];
            if (signal.signal_up) {
              markers.push({
                time: signal.time,
                position: "belowBar",
                color: "#FF00FF",
                shape: "arrowUp",
                size: 2,
              });
            }
            if (signal.signal_down) {
              markers.push({
                time: signal.time,
                position: "aboveBar",
                color: "#FF00FF",
                shape: "arrowDown",
                size: 2,
              });
            }
            if (signal.ripster_signal_up) {
              markers.push({
                time: signal.time,
                position: "belowBar",
                color: "#26a69a",
                shape: "arrowUp",
                size: 2,
              });
            }
            if (signal.ripster_signal_down) {
              markers.push({
                time: signal.time,
                position: "aboveBar",
                color: "#26a69a",
                shape: "arrowDown",
                size: 2,
              });
            }
            if (signal.yellow_signal_up) {
              markers.push({
                time: signal.time,
                position: "belowBar",
                color: "#FFFF00",
                shape: "arrowUp",
                size: 2,
              });
            }
            if (signal.yellow_signal_down) {
              markers.push({
                time: signal.time,
                position: "aboveBar",
                color: "#FFFF00",
                shape: "arrowDown",
                size: 2,
              });
            }
            if (signal.rsi_exit_up) {
              markers.push({
                time: signal.time,
                position: "belowBar",
                color: "red",
                shape: "arrowUp",
                size: 2,
              });
            }
            if (signal.rsi_exit_down) {
              markers.push({
                time: signal.time,
                position: "aboveBar",
                color: "red",
                shape: "arrowDown",
                size: 2,
              });
            }
            return markers;
          });
        }

        candlestickSeriesRef.current.setMarkers(markers);
      }
    } catch (e) {
      console.log(e);
    }
  }, [data, TTM, theme]);

  return (
    <div className="flex flex-col h-full ">
      <div ref={chartRef} className=" flex-grow" />
      <div ref={ttmWavesChartRef} className="h-48" />
      <div ref={macdChartRef} className=" h-48" />
      <Ripster
        candleSticks={data?.candlestick}
        chartInstance={chartInstance.current}
        theme={theme}
      />
    </div>
  );
}

function getChartOptions(theme: "light" | "dark"): DeepPartial<ChartOptions> {
  return {
    layout: {
      background: {
        type: ColorType.Solid,
        color: theme === "light" ? "white" : "black",
      },
      textColor: theme === "light" ? "black" : "white",
    },
    grid: {
      vertLines: { color: theme === "light" ? "#e1e1e1" : "#363c4e" },
      horzLines: { color: theme === "light" ? "#e1e1e1" : "#363c4e" },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    timeScale: {
      visible: false,
      timeVisible: true,
      secondsVisible: false,
    },
    localization: {
      timeFormatter: (time: Time) => {
        const timeNumber = Number(time); // Convert time to a number
        const date = new Date(timeNumber * 1000);

        return date.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      },
    },
  };
}

// function getRSIChartOptions(theme: 'light' | 'dark'): DeepPartial<ChartOptions> {
//   return {
//     ...getChartOptions(theme),
//     timeScale: {
//       visible: true,
//     },
//   };
// }

function getMACDChartOptions(
  theme: "light" | "dark"
): DeepPartial<ChartOptions> {
  return {
    ...getChartOptions(theme),
    timeScale: {
      visible: true,
      timeVisible: true,
      secondsVisible: false,
    },
  };
}
function getTTMWavesOptions(theme: string): DeepPartial<ChartOptions> {
  return {
    layout: {
      background: {
        type: ColorType.Solid,
        color: theme === "light" ? "white" : "black",
      },
      textColor: theme === "light" ? "black" : "white",
    },
    grid: {
      vertLines: { color: theme === "light" ? "#e1e1e1" : "#363c4e" },
      horzLines: { color: theme === "light" ? "#e1e1e1" : "#363c4e" },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    rightPriceScale: {
      visible: true,
      borderColor: "rgba(197, 203, 206, 0.8)",
    },
    leftPriceScale: {
      visible: false,
    },
    timeScale: {
      visible: false,
      borderColor: "rgba(197, 203, 206, 0.8)",
    },
  };
}

function syncCharts(
  chart: IChartApi,
  macdChart: IChartApi,
  ttmWavesChart: IChartApi,
  candlestickSeries: ISeriesApi<"Candlestick">,
  macdLine: ISeriesApi<"Line">
) {
  const charts = [chart, macdChart, ttmWavesChart];

  charts.forEach((sourceChart, index) => {
    sourceChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (range) {
        charts
          .filter((_, i) => i !== index)
          .forEach((targetChart) => {
            targetChart.timeScale().setVisibleLogicalRange(range);
          });
      }
    });
  });

  function syncCrosshair(
    sourceChart: IChartApi,
    targetChart: IChartApi,
    sourceSeries: ISeriesApi<"Candlestick"> | ISeriesApi<"Line">,
    targetSeries: ISeriesApi<"Candlestick"> | ISeriesApi<"Line">
  ) {
    sourceChart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const point = param.seriesData.get(sourceSeries) as
          | { time: Time; value: number }
          | undefined;
        if (point && point.time !== undefined && point.value !== undefined) {
          targetChart.setCrosshairPosition(
            point.value,
            point.time,
            targetSeries
          );
        } else {
          targetChart.clearCrosshairPosition();
        }
      } else {
        targetChart.clearCrosshairPosition();
      }
    });
  }

  syncCrosshair(chart, macdChart, candlestickSeries, macdLine);
  syncCrosshair(macdChart, chart, macdLine, candlestickSeries);
}
