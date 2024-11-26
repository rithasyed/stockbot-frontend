import {
  BitmapCoordinatesRenderingScope,
  CanvasRenderingTarget2D,
} from "fancy-canvas";
import {
  ICustomSeriesPaneRenderer,
  PaneRendererCustomData,
  PriceToCoordinateConverter,
  Time,
} from "lightweight-charts";
import { HLCAreaData } from "./data";
import { HLCAreaSeriesOptions } from "./options";

interface HLCAreaBarItem {
  x: number;
  high: number;
  low: number;
  // close: number;
}

export class HLCAreaSeriesRenderer<TData extends HLCAreaData>
  implements ICustomSeriesPaneRenderer
{
  _data: PaneRendererCustomData<Time, TData> | null = null;
  _options: HLCAreaSeriesOptions | null = null;

  draw(
    target: CanvasRenderingTarget2D,
    priceConverter: PriceToCoordinateConverter
  ): void {
    target.useBitmapCoordinateSpace((scope) =>
      this._drawImpl(scope, priceConverter)
    );
  }

  update(
    data: PaneRendererCustomData<Time, TData>,
    options: HLCAreaSeriesOptions
  ): void {
    this._data = data;
    this._options = options;
  }

  _drawImpl(
    renderingScope: BitmapCoordinatesRenderingScope,
    priceToCoordinate: PriceToCoordinateConverter
  ): void {
    if (
      this._data === null ||
      this._data.bars.length === 0 ||
      this._data.visibleRange === null ||
      this._options === null
    ) {
      return;
    }
    const options = this._options;
    const bars: HLCAreaBarItem[] = this._data.bars.map((bar) => {
      return {
        x: bar.x * renderingScope.horizontalPixelRatio,
        high:
          priceToCoordinate(bar.originalData.high)! *
          renderingScope.verticalPixelRatio,
        low:
          priceToCoordinate(bar.originalData.low)! *
          renderingScope.verticalPixelRatio,
        // close: priceToCoordinate(bar.originalData.close)! * renderingScope.verticalPixelRatio,
      };
    });

    const ctx = renderingScope.context;
    ctx.globalAlpha = 0.5;
    ctx.save();
    // const lowLine = new Path2D();
    // const highLine = new Path2D();
    const firstBar = bars[this._data.visibleRange.from];
    // lowLine.moveTo(firstBar.x, firstBar.low);
    // highLine.moveTo(firstBar.x, firstBar.high);

    for (
      let i = this._data.visibleRange.from;
      i < this._data.visibleRange.to;
      i++
    ) {
      const bar = bars[i];
      const nextBar = bars[i + 1] || bar;

      // Draw the current segment
    //   lowLine.lineTo(bar.x, bar.low);
    //   highLine.lineTo(bar.x, bar.high);

      // Fill the area between high and low lines
      ctx.beginPath();
      ctx.moveTo(bar.x, bar.high);
      ctx.lineTo(bar.x, bar.low);
      ctx.lineTo(nextBar.x, nextBar.low);
      ctx.lineTo(nextBar.x, nextBar.high);
      
      ctx.closePath();
      

      // Determine fill color
      if (bar.low > bar.high || nextBar.low > nextBar.high) {
        ctx.fillStyle = options.negativeColor;
      } else {
        ctx.fillStyle = options.positiveColor;
      }

      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  
    // Stroke the lines after filling to ensure they're visible
    // ctx.stroke(lowLine);
    // ctx.stroke(highLine);
    // ctx.lineWidth = 2;
    // We draw the close line in reverse so that it is
    // to reuse the Path2D to create the filled areas.
    const lastBar = bars[this._data.visibleRange.to - 1];
    // closeLine.moveTo(lastBar.x, lastBar.high);
    // for (
    // 	let i = this._data.visibleRange.to - 2;
    // 	i >= this._data.visibleRange.from;
    // 	i--
    // ) {
    // 	const bar = bars[i];
    // 	closeLine.lineTo(bar.x, bar.close);
    // }

    // const topArea = new Path2D(highLine);
    // topArea.lineTo(lastBar.x, lastBar.low);
    // topArea.addPath(lowLine);
    // topArea.lineTo(firstBar.x, firstBar.high);
    // topArea.closePath();
    // ctx.fillStyle = options.areaTopColor;
    // ctx.fill(topArea);

    // const bottomArea = new Path2D(lowLine);
    // bottomArea.lineTo(lastBar.x, lastBar.high);
    // bottomArea.addPath(highLine);
    // bottomArea.lineTo(firstBar.x, firstBar.low);
    // bottomArea.closePath();
    // ctx.fillStyle = options.areaBottomColor;
    // ctx.fill(bottomArea);

    // ctx.lineJoin = 'round';
    // ctx.strokeStyle = options.lowLineColor;
    // ctx.lineWidth = options.lowLineWidth * renderingScope.verticalPixelRatio;
    // ctx.stroke(lowLine);
    // ctx.strokeStyle = options.highLineColor;
    // ctx.lineWidth = options.highLineWidth * renderingScope.verticalPixelRatio;
    // ctx.stroke(highLine);
    // ctx.strokeStyle = options.closeLineColor;
    // ctx.lineWidth = options.closeLineWidth * renderingScope.verticalPixelRatio;
    // ctx.stroke(closeLine);
  }
}
