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
} from 'lightweight-charts';

interface TTMWavesProps {
  theme: 'light' | 'dark';
  data: {
    ttm_waves: { time: Time, momentum: number, ao: number, squeeze: string, atr1: number }[];
  } | null;
  mainChart?: IChartApi;
}

export function TTMWavesChart({ theme, data, mainChart }: TTMWavesProps) {
  const ttmWavesRef = useRef<HTMLDivElement>(null);
  const ttmWavesInstance = useRef<IChartApi | null>(null);
  const momentumSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
//   const aoSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const squeezeSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const atr1SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (ttmWavesRef.current) {
      ttmWavesInstance.current = createChart(ttmWavesRef.current, getTTMWavesOptions(theme));
      
      atr1SeriesRef.current = ttmWavesInstance.current.addLineSeries({
        color: 'rgba(255, 0, 0, 0.8)',
        lineWidth: 1,
        priceScaleId: 'right',
      });

      momentumSeriesRef.current = ttmWavesInstance.current.addHistogramSeries({
        color: '#2962FF',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'right',
      });

      squeezeSeriesRef.current = ttmWavesInstance.current.addLineSeries({
        priceScaleId: 'right',
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
        color: 'rgba(0, 0, 0, 0)',
      });

    //   aoSeriesRef.current = ttmWavesInstance.current.addHistogramSeries({
    //     color: '#26A69A',
    //     priceFormat: {
    //       type: 'volume',
    //     },
    //     priceScaleId: 'right',
    //   });

      const rightPriceScale = ttmWavesInstance.current.priceScale('right');
      rightPriceScale.applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        visible: true,
      });

      ttmWavesInstance.current.priceScale('left').applyOptions({
        visible: false,
      });

      if (mainChart) {
        mainChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
          if (range && ttmWavesInstance.current) {
            ttmWavesInstance.current.timeScale().setVisibleLogicalRange(range);
          }
        });
      }

      return () => {
        ttmWavesInstance.current?.remove();
      };
    }
  }, [theme, mainChart]);

  useEffect(() => {
    if (data && 
        momentumSeriesRef.current && 
        // aoSeriesRef.current && 
        squeezeSeriesRef.current &&
        atr1SeriesRef.current ) {

        atr1SeriesRef.current.setData(data.ttm_waves.map(item => ({
            time: item.time,
            value: item.atr1
          })));

        momentumSeriesRef.current.setData(data.ttm_waves.map(item => ({
            time: item.time,
            value: item.momentum,
            color: item.momentum >= 0 
            ? (item.momentum > (data.ttm_waves[data.ttm_waves.indexOf(item) - 1]?.momentum || 0) ? '#00bcd4' : '#2962ff') 
            : (item.momentum > (data.ttm_waves[data.ttm_waves.indexOf(item) - 1]?.momentum || 0) ? '#ffeb3b' : '#ff5252'),
        })));

      const squeezeData = data.ttm_waves.map(item => ({
        time: item.time,
        value: 0, 
      }));

      const squeezeMarkers = data.ttm_waves.map(item => ({
        time: item.time,
        position: 'inBar',  
        color: item.squeeze === 'high' ? '#ff9800' : 
               item.squeeze === 'mid' ? '#ff5252' : 
               item.squeeze === 'low' ? '#363a45' : '#4caf50',
        shape: 'circle',
        size: 1, 
      }));

      squeezeSeriesRef.current.setData(squeezeData);
      squeezeSeriesRef.current.setMarkers(squeezeMarkers);

      
    //   aoSeriesRef.current.setData(data.ttm_waves.map(item => ({
    //     time: item.time,
    //     value: item.ao,
    //     color: item.ao >= 0 
    //       ? (item.ao > (data.ttm_waves[data.ttm_waves.indexOf(item) - 1]?.ao || 0) ? '#26A69A' : '#B2DFDB') 
    //       : (item.ao > (data.ttm_waves[data.ttm_waves.indexOf(item) - 1]?.ao || 0) ? '#FFCDD2' : '#EF5350'),
    //   })));
    }
  }, [data]);

  return (
    <div ref={ttmWavesRef} className="h-48" />
  );
}

function getTTMWavesOptions(theme: string): DeepPartial<ChartOptions> {
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
    rightPriceScale: {
      visible: true,
      borderColor: 'rgba(197, 203, 206, 0.8)',
    },
    leftPriceScale: {
      visible: false,
    },
    timeScale: {
      visible: false,
      borderColor: 'rgba(197, 203, 206, 0.8)',
    },
  };
}