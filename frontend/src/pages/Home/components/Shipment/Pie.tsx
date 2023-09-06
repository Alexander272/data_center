import { FC } from 'react'
import ReactECharts from 'echarts-for-react'
import type { IPieData } from '@/types/sheet'

type FormatterType = { percent: number } & IPieData

type Props = {
	data: IPieData[]
	formatter?: (param: FormatterType) => string
}

export const Pie: FC<Props> = ({ data, formatter }) => {
	let formatterFunc
	if (formatter) formatterFunc = formatter
	else {
		formatterFunc = (param: { name: string; value: number; percent: number }) => {
			return `${param.name} (${new Intl.NumberFormat('ru', { notation: 'compact' }).format(param.value)}, ${
				param.percent
			}%)`
		}
	}

	const options = {
		tooltip: {
			trigger: 'item',
		},
		legend: {
			top: '5%',
			left: 'center',
			selectedMode: true,
		},
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
