import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  IChartApi, 
  CrosshairMode, 
  ISeriesApi, 
  Time,
  DeepPartial,
  ChartOptions,
  ColorType,
  SeriesMarker
} from 'lightweight-charts';
import Ripster from '../indicators/risper';

interface ChartProps {
  theme: 'light' | 'dark';
  data: {
    candlestick: { time: Time, open: number, high: number, low: number, close: number }[],
    ema: { time: Time, value: number }[],
    macd: { time: Time, macd: number, signal: number, histogram: number }[],
    vwap: { time: Time, vwap: number, upper: number, lower: number }[],
    vwap_signals: { time: Time, signal_up: boolean, signal_down: boolean, ripster_signal_up: boolean, ripster_signal_down: boolean, yellow_signal_up: boolean,
    yellow_signal_down: boolean }[]
  } | null;
}

export default function Chart({ theme, data }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const macdChartInstance = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const vwapLineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const vwapUpperBandRef = useRef<ISeriesApi<"Line"> | null>(null);
  const vwapLowerBandRef = useRef<ISeriesApi<"Line"> | null>(null);
  const vwapAreaRef = useRef<ISeriesApi<"Area"> | null>(null);
  const emaLineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdLineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSignalRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdHistogramRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const signalMarkersRef = useRef<ISeriesApi<"Line"> | null>(null);
  
  useEffect(() => {
    if (chartRef.current && macdChartRef.current) {
      chartInstance.current = createChart(chartRef.current, getChartOptions(theme));
      macdChartInstance.current = createChart(macdChartRef.current, getMACDChartOptions(theme));

      candlestickSeriesRef.current = chartInstance.current.addCandlestickSeries();
      emaLineRef.current = chartInstance.current.addLineSeries({
        color: 'blue',
        lineWidth: 2
      });
      vwapLineRef.current = chartInstance.current.addLineSeries({
        color: 'purple',
        lineWidth: 2
      });
      vwapUpperBandRef.current = chartInstance.current.addLineSeries({
        color: 'rgba(255, 0, 0, 0.5)',
        lineWidth: 2
      });
      vwapLowerBandRef.current = chartInstance.current.addLineSeries({
        color: 'rgba(0, 255, 0, 0.5)',
        lineWidth: 2
      });
      vwapAreaRef.current = chartInstance.current.addAreaSeries({
        topColor: 'rgba(76, 175, 80, 0.2)',
        bottomColor: 'rgba(76, 175, 80, 0.02)',
        lineColor: 'rgba(76, 175, 80, 0)',
      });

      signalMarkersRef.current = chartInstance.current.addLineSeries({
        lastValueVisible: false,
        priceLineVisible: false,
      });

      macdLineRef.current = macdChartInstance.current.addLineSeries({
        color: 'blue',
        lineWidth: 2
      });

      macdSignalRef.current = macdChartInstance.current.addLineSeries({
        color: 'red',
        lineWidth: 2
      });

      macdHistogramRef.current = macdChartInstance.current.addHistogramSeries({
        color: 'green'
      });

      syncCharts(chartInstance.current, macdChartInstance.current, candlestickSeriesRef.current, macdLineRef.current);

      return () => {
        chartInstance.current?.remove();
        macdChartInstance.current?.remove();
      };
    }
  }, [theme]);

  useEffect(() => {
    if (data && 
      candlestickSeriesRef.current && 
      emaLineRef.current && 
      vwapLineRef.current && 
      vwapUpperBandRef.current && 
      vwapLowerBandRef.current && 
      vwapAreaRef.current &&
      macdLineRef.current && 
      macdSignalRef.current && 
      macdHistogramRef.current) {

      candlestickSeriesRef.current.setData(data.candlestick);
      emaLineRef.current.setData(data.ema);
      vwapLineRef.current.setData(data.vwap.map(item => ({ time: item.time, value: item.vwap })));
      vwapUpperBandRef.current.setData(data.vwap.map(item => ({ time: item.time, value: item.upper })));
      vwapLowerBandRef.current.setData(data.vwap.map(item => ({ time: item.time, value: item.lower })));
      vwapAreaRef.current.setData(data.vwap.map(item => ({ 
        time: item.time, 
        value: item.upper,
        bottomValue: item.lower
      })));
      macdLineRef.current.setData(data.macd.map(item => ({ time: item.time, value: item.macd })));
      macdSignalRef.current.setData(data.macd.map(item => ({ time: item.time, value: item.signal })));
      macdHistogramRef.current.setData(data.macd.map(item => ({ time: item.time, value: item.histogram })));
      const markers: SeriesMarker<Time>[] = data.vwap_signals.flatMap(signal => {
        const markers: SeriesMarker<Time>[] = [];
        if (signal.signal_up) {
          markers.push({
            time: signal.time,
            position: 'belowBar',
            color: '#FF00FF',
            shape: 'arrowUp',
            size: 2
          });
        }
        if (signal.signal_down) {
          markers.push({
            time: signal.time,
            position: 'aboveBar',
            color: '#FF00FF',
            shape: 'arrowDown',
            size: 2
          });
        }
        if (signal.ripster_signal_up) {
          markers.push({
            time: signal.time,
            position: 'belowBar',
            color: '#26a69a',
            shape: 'arrowUp',
            size: 2
          });
        }
        if (signal.ripster_signal_down) {
          markers.push({
            time: signal.time,
            position: 'aboveBar',
            color: '#26a69a',
            shape: 'arrowDown',
            size: 2
          });
        }
        if (signal.yellow_signal_up) {
          markers.push({
            time: signal.time,
            position: 'belowBar',
            color: '#FFFF00',
            shape: 'arrowUp',
            size: 2
          });
        }
        if (signal.yellow_signal_down) {
          markers.push({
            time: signal.time,
            position: 'aboveBar',
            color: '#FFFF00',
            shape: 'arrowDown',
            size: 2
          });
        }
        return markers;
      });
      
      candlestickSeriesRef.current.setMarkers(markers);
    }
  }, [data]);
  
  return (
    <>
      <div ref={chartRef} className="w-full h-2/3" />
      <div ref={macdChartRef} className="w-full h-1/3" />
      {/* <Ripster candleSticks={data?.candlestick} chartInstance={chartInstance.current} /> */}
    </>
  );
}

function getChartOptions(theme: 'light' | 'dark'): DeepPartial<ChartOptions> {
  return {
    layout: {
      background: { 
        type: ColorType.Solid, 
        color: theme === 'light' ? 'white' : 'black' 
      },
      textColor: theme === 'light' ? 'black' : 'white',
    },
    grid: {
      vertLines: { color: theme === 'light' ? '#e1e1e1' : '#363c4e' },
      horzLines: { color: theme === 'light' ? '#e1e1e1' : '#363c4e' },
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
        const date = new Date(Number(time) * 1000);
        return date.toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
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

function getMACDChartOptions(theme: 'light' | 'dark'): DeepPartial<ChartOptions> {
  return {
    ...getChartOptions(theme),
    timeScale: {
      visible: true,
      timeVisible: true,
      secondsVisible: false,
    },
  };
}

function syncCharts(
  chart: IChartApi,
  macdChart: IChartApi,
  candlestickSeries: ISeriesApi<"Candlestick">,
  macdLine: ISeriesApi<"Line">
) {
  chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
    if (range) {
      macdChart.timeScale().setVisibleLogicalRange(range);
    }
  });

  macdChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
    if (range) {
      chart.timeScale().setVisibleLogicalRange(range);
    }
  });

  function syncCrosshair(
    sourceChart: IChartApi,
    targetChart: IChartApi,
    sourceSeries: ISeriesApi<"Candlestick"> | ISeriesApi<"Line">,
    targetSeries: ISeriesApi<"Candlestick"> | ISeriesApi<"Line">
  ) {
    sourceChart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const point = param.seriesData.get(sourceSeries) as { time: Time; value: number } | undefined;
        if (point && point.time !== undefined && point.value !== undefined) {
          targetChart.setCrosshairPosition(point.value, point.time, targetSeries);
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