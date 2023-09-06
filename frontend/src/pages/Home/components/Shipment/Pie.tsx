import { FC } from 'react'
import ReactECharts from 'echarts-for-react'
import type { IPieData } from '@/types/sheet'
import type { LegendComponentOption } from 'echarts'

type FormatterType = { percent: number } & IPieData

type Props = {
	data: IPieData[]
	legend?: LegendComponentOption
	formatter?: (param: FormatterType) => string
}

export const Pie: FC<Props> = ({ data, formatter, legend }) => {
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
		// selectedMode: true,
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
				name: 'Отгружено',
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

	return <ReactECharts option={options} />
}
