import type { BarSeriesOption } from 'echarts'
import { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'

import type { IShippingPlan } from '@/types/shippingPlan'
import type { ISeriesData } from '@/types/sheet'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'
import { BarChart } from '../components/BarChart/Bar'
import { tooltip } from '../components/Tooltip/Tooltip'

type Props = {
	data: IShippingPlan[]
}

const defaultSeriesData = {
	stack: 'Total',
	silent: true,
	itemStyle: { borderColor: 'transparent', color: '#f5f5f5' },
	emphasis: { itemStyle: { borderColor: 'transparent', color: '#f5f5f5' } },
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<string[]>([])
	const [seriesNumber, setSeriesNumber] = useState<ISeriesData>()
	const [seriesMoney, setSeriesMoney] = useState<ISeriesData>()
	const [seriesQuantity, setSeriesQuantity] = useState<ISeriesData>()

	const [seriesSumNumber, setSeriesSumNumber] = useState<BarSeriesOption>()
	const [seriesSumMoney, setSeriesSumMoney] = useState<BarSeriesOption>()
	const [seriesSumQuantity, setSeriesSumQuantity] = useState<BarSeriesOption>()

	useEffect(() => {
		const axisLine = new Set<string>()
		const number: number[] = []
		const money: number[] = []
		const quantity: number[] = []

		const sumNumber: number[] = []
		const sumMoney: number[] = []
		const sumQuantity: number[] = []

		data.forEach((d, i) => {
			axisLine.add(dayjs(+(d.date || 0) * 1000).format(FormatDate) || '')
			number.push(+(d.numberOfOrders || 0))
			money.push(+(d.sumMoney || 0))
			quantity.push(+(d.quantity || 0))

			if (i == 0) {
				sumNumber.push(0)
				sumMoney.push(0)
				sumQuantity.push(0)
			} else {
				sumNumber.push(sumNumber[i - 1] + number[i - 1])
				sumMoney.push(sumMoney[i - 1] + money[i - 1])
				sumQuantity.push(sumQuantity[i - 1] + quantity[i - 1])
			}
		})

		setAxis(Array.from(axisLine))
		setSeriesNumber({ name: 'Количество заказов', data: number, stack: 'Total' })
		setSeriesMoney({ name: 'Сумма заказов', data: money, stack: 'Total' })
		setSeriesQuantity({ name: 'Суммарное количество ед. продукции в заказов', data: quantity, stack: 'Total' })

		setSeriesSumNumber({ data: sumNumber, ...defaultSeriesData })
		setSeriesSumMoney({ data: sumMoney, ...defaultSeriesData })
		setSeriesSumQuantity({ data: sumQuantity, ...defaultSeriesData })
	}, [data])

	return (
		<Stack spacing={1}>
			<Typography align='center' fontWeight={'bold'}>
				Количество заказов, шт
			</Typography>
			<Stack direction={'row'} spacing={1} height={400}>
				<Box flexBasis={'50%'}>{seriesNumber ? <Line data={{ series: [seriesNumber], axis }} /> : null}</Box>
				<Box flexBasis={'50%'}>
					{seriesSumNumber && seriesNumber ? (
						<BarChart data={{ series: [seriesSumNumber, seriesNumber], axis, tooltip }} />
					) : null}
				</Box>
			</Stack>

			<Typography align='center' fontWeight={'bold'}>
				Сумма заказов, руб
			</Typography>
			<Stack direction={'row'} spacing={1} height={400}>
				<Box flexBasis={'50%'}>{seriesMoney ? <Line data={{ series: [seriesMoney], axis }} /> : null}</Box>
				<Box flexBasis={'50%'}>
					{seriesSumMoney && seriesMoney ? (
						<BarChart data={{ series: [seriesSumMoney, seriesMoney], axis, tooltip }} />
					) : null}
				</Box>
			</Stack>

			<Typography align='center' fontWeight={'bold'}>
				Суммарное количество ед. продукции в заказах, шт
			</Typography>
			<Stack direction={'row'} spacing={1} height={400}>
				<Box flexBasis={'50%'}>
					{seriesQuantity ? <Line data={{ series: [seriesQuantity], axis }} /> : null}
				</Box>
				<Box flexBasis={'50%'}>
					{seriesSumQuantity && seriesQuantity ? (
						<BarChart data={{ series: [seriesSumQuantity, seriesQuantity], axis, tooltip }} />
					) : null}
				</Box>
			</Stack>
		</Stack>
	)
}
