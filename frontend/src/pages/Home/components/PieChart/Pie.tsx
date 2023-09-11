import { FC } from 'react'
// import ReactECharts from 'echarts-for-react'
import ReactECharts from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { LegendComponentOption } from 'echarts'
import type { IPieData } from '@/types/sheet'

type FormatterType = { percent: number } & IPieData

type Props = {
	data: IPieData[]
	name: string
	legend?: LegendComponentOption
	formatter?: (param: FormatterType) => string
}

export const Pie: FC<Props> = ({ data, name, formatter, legend }) => {
	echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

	let formatterFunc
	if (formatter) formatterFunc = formatter
	else {
		formatterFunc = (param: { name: string; value: number; percent: number }) => {
			return `${param.name} (${new Intl.NumberFormat('ru', { notation: 'compact' }).format(param.value)}, ${
				param.percent
			}%)`
		}
	}

	const defLegend: LegendComponentOption = {
		top: '5%',
		left: 'center',
		selectedMode: false,
		// type: 'scroll',
		// orient: 'vertical',
		// right: 10,
		// top: 20,
		// bottom: 20,
	}

	const options = {
		tooltip: {
			trigger: 'item',
		},
		legend: legend || defLegend,
		series: [
			{
				name: name,
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['50%', '60%'],
				// adjust the start angle
				//startAngle: 180,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2,
				},
				label: {
					show: true,
					fontSize: '0.9rem',
					formatter: formatterFunc,
				},
				data: data,
			},
		],
	}

	return <ReactECharts echarts={echarts} option={options} />
}
