import {
	CustomSeriesPricePlotValues,
	ICustomSeriesPaneView,
	PaneRendererCustomData,
	WhitespaceData,
	Time,
} from 'lightweight-charts';
import { HLCAreaSeriesOptions, defaultOptions } from './options';
import { HLCAreaSeriesRenderer } from './renderer';
import { HLCAreaData } from './data';

export class HLCAreaSeries<TData extends HLCAreaData>
	implements ICustomSeriesPaneView<Time, TData, HLCAreaSeriesOptions>
{

	_renderer: HLCAreaSeriesRenderer<TData>;

	constructor() {
		this._renderer = new HLCAreaSeriesRenderer();
	}

	priceValueBuilder(plotRow: TData): CustomSeriesPricePlotValues {
		return [plotRow.low, plotRow.high];
	}

	isWhitespace(data: TData | WhitespaceData): data is WhitespaceData {
		// console.log("DATa",data)
		return (data as Partial<TData>).time === undefined;
	}

	renderer(): HLCAreaSeriesRenderer<TData> {
		return this._renderer;
	}

	update(
		data: PaneRendererCustomData<Time, TData>,
		options: HLCAreaSeriesOptions
	): void {
		this._renderer.update(data, options);
	}

	defaultOptions() {
		return defaultOptions;
	}
}