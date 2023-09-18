import { FC } from 'react'
import ReactECharts from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ILineData } from '@/types/sheet'

type Props = {
	// name: string
	// legend: string[]
	data: ILineData
	minYValue?: number
}

export const Line: FC<Props> = ({ data, minYValue }) => {
	echarts.use([TooltipComponent, LegendComponent, GridComponent, MarkLineComponent, LineChart, CanvasRenderer])

	const legend: string[] = data.series.map(d => d.name)

	const series = data.series.map(d => {
		let markLine = {}
		if (d.mark) {
			markLine = {
				silent: true,
				lineStyle: {
					color: '#333',
				},
				data: [
					{
						yAxis: d.mark,
						name: d.name,
						label: {
							formatter: (param: { name: string; value: number }) =>
								`${param.name} (${new Intl.NumberFormat('ru', { notation: 'compact' }).format(
									param.value
								)})`,
						},
					},
				],
			}
		}
		return {
			name: d.name,
			type: 'line',
			smooth: true,
			// color: d.color,
			data: d.data,
			emphasis: { focus: 'series' },
			// label: { show: true },
			markLine: markLine,
			label: {
				show: true,
				position: 'top',
				backgroundColor: 'inherit',
				padding: 6,
				borderRadius: 8,
				color: '#fff',
				fontSize: 14,
				textBorderColor: '#282a36',
				textBorderWidth: 2,
				formatter: (param: { value: number }) =>
					new Intl.NumberFormat('ru', { notation: 'compact' }).format(param.value),
			},
		}
	})

	// const maps = data.visualMaps?.map((m, idx) => ({
	// 	show: false,
	// 	seriesIndex: idx,
	// 	pieces: [
	// 		{ gt: 0, lte: m.mark, color: m.color1 },
	// 		{ gt: m.mark, lte: Infinity, color: m.color2 },
	// 	],
	// }))

	const options = {
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: legend,
		},
		// grid: {
		// 	left: '3%',
		// 	right: '4%',
		// 	bottom: '3%',
		// 	containLabel: true,
		// },
		// toolbox: {
		// 	feature: {
		// 		saveAsImage: {},
		// 	},
		// },
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: data.axis,
		},
		yAxis: {
			type: 'value',
			min: minYValue || 0,
			// boundaryGap: false,
		},
		// visualMap: undefined,
		// visualMap: [
		// 	{
		// 		show: false,
		// 		seriesIndex: 0,
		// 		pieces: [
		// 			{ gt: 0, lte: 250000, color: '#23045f' },
		// 			{ gt: 250000, color: '#1609ce' },
		// 		],
		// 	},
		// ],
		series: series,
		// [
		// {
		// 	name: 'Email',
		// 	type: 'line',
		// 	smooth: true,
		// 	color: '#AA069F',
		// 	data: [120, 162, 101, 174, 90, 230, 210],
		// 	emphasis: { focus: 'series' },
		// },
		// ],
	}

	return (
		<ReactECharts
			echarts={echarts}
			option={options}
			style={{
				height: '100%',
				width: '100%',
			}}
		/>
	)
}
