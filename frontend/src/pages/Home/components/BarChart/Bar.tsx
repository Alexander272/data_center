import { FC } from 'react'
import type { BarSeriesOption } from 'echarts'
import ReactECharts from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart as Bar } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { BarSeriesLabelOption } from 'echarts/types/src/chart/bar/BarSeries.js'
import type { TooltipOption } from 'echarts/types/dist/shared.js'

import type { IAxisData } from '@/types/sheet'

type Props = {
	data: {
		series: BarSeriesOption[]
		axis: IAxisData[]
		tooltip?: TooltipOption
	}
}

export const BarChart: FC<Props> = ({ data }) => {
	echarts.use([TooltipComponent, LegendComponent, GridComponent, MarkLineComponent, Bar, CanvasRenderer])

	const legend = data.series.map(d => d.name).filter(d => Boolean(d))

	const label: BarSeriesLabelOption = {
		show: true,
		position: 'top',
		backgroundColor: 'inherit',
		padding: 6,
		borderRadius: 8,
		color: '#fff',
		fontSize: 14,
		textBorderColor: '#282a36',
		textBorderWidth: 2,
		formatter: param => new Intl.NumberFormat('ru', { notation: 'compact' }).format(+(param?.value || 0)),
	}

	const series: BarSeriesOption[] = data.series.map(d => {
		return {
			name: d.name,
			type: 'bar',
			stack: d.stack,
			silent: d.silent,
			data: d.data,
			itemStyle: d.itemStyle,
			emphasis: d.emphasis ? d.emphasis : { focus: 'series' },
			label: d.silent ? undefined : label,
		}
	})

	const options = {
		tooltip: data.tooltip,
		legend: {
			data: legend,
		},
		xAxis: {
			type: 'category',
			data: data.axis,
		},
		yAxis: {
			type: 'value',
		},
		series: series,
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
