import { FC } from 'react'
import ReactECharts from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
// import type { LegendComponentOption } from 'echarts'
import type { IBarData } from '@/types/sheet'

// type FormatterType = { percent: number } & IBarData

type Props = {
	data: IBarData[]
	// name: string
	// legend?: LegendComponentOption
	// formatter?: (param: FormatterType) => string
}

// const colors = ['#5470c6', '#91cc75', '#fac858', '#e66', '#73c0de', '#3ba272', '#fc8452']

export const SingleBar: FC<Props> = ({ data }) => {
	echarts.use([TooltipComponent, LegendComponent, GridComponent, BarChart, CanvasRenderer])

	const labelOptions = {
		show: true,
		rotate: 0,
		distance: 10,
		align: 'center',
		verticalAlign: 'middle',
		position: 'top',
		fontSize: 16,
		// formatter: `{c}\n{a}`,
		formatter: (param: { name: string; value: number }) =>
			new Intl.NumberFormat('ru', { notation: 'compact' }).format(param.value),
	}

	// const legendData = data.map(d => d.name)
	const series = data.map(d => ({
		name: d.name,
		type: 'bar',
		label: labelOptions,
		// data: [d.value],
		data: [
			{
				value: d.value,
				itemStyle: {
					borderRadius: [4, 4, 0, 0],
				},
			},
		],
	}))
	// console.log(legendData)
	// console.log(barData)

	const options = {
		xAxis: {
			type: 'category',
			show: false,
			// data: legendData,
		},
		yAxis: {
			type: 'value',
		},
		legend: {
			show: true,
			selectedMode: false,
			// data: legendData,
		},
		series: series,
		// series: [
		// 	{
		// 		type: 'bar',
		// 		label: {
		// 			show: true,
		// 			rotate: 0,
		// 			distance: 10,
		// 			align: 'center',
		// 			verticalAlign: 'middle',
		// 			position: 'top',
		// 			fontSize: 16,
		// 			formatter: (param: { name: string; value: number }) =>
		// 				new Intl.NumberFormat('ru', { notation: 'compact' }).format(param.value),
		// 		},
		// 		data: barData,
		// 	},
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
