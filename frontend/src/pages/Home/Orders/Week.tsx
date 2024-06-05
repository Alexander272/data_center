import { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'

import type { IOrdersVolume } from '@/types/orderVolume'
import type { ISeriesData } from '@/types/sheet'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: IOrdersVolume[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<string[]>([])
	const [seriesNumber, setSeriesNumber] = useState<ISeriesData>()
	const [seriesMoney, setSeriesMoney] = useState<ISeriesData>()
	const [seriesQuantity, setSeriesQuantity] = useState<ISeriesData>()

	useEffect(() => {
		const axisLine = new Set<string>()
		const number = new Map<string, number>()
		const money = new Map<string, number>()
		const quantity = new Map<string, number>()

		data.forEach(d => {
			const date = dayjs(+(d.date || 0) * 1000).format(FormatDate) || ''
			axisLine.add(date)

			number.set(date, +(d.numberOfOrders || 0))
			money.set(date, +(d.sumMoney || 0))
			quantity.set(date, +(d.quantity || 0))
		})

		setAxis(Array.from(axisLine))
		setSeriesNumber({
			name: 'Количество заказов',
			data: Array.from(number, entry => {
				return entry[1]
			}),
		})
		setSeriesMoney({
			name: 'Сумма заказов',
			data: Array.from(money, entry => {
				return entry[1]
			}),
		})
		setSeriesQuantity({
			name: 'Суммарное количество ед. продукции в заказах',
			data: Array.from(quantity, entry => {
				return entry[1]
			}),
		})
	}, [data])

	return (
		<Stack spacing={1}>
			<Typography align='center' fontWeight={'bold'}>
				Количество заказов, шт
			</Typography>
			<Box height={500}>{seriesNumber ? <Line data={{ series: [seriesNumber], axis }} /> : null}</Box>

			<Typography align='center' fontWeight={'bold'}>
				Сумма заказов, руб
			</Typography>
			<Box height={500}>{seriesMoney ? <Line data={{ series: [seriesMoney], axis }} /> : null}</Box>

			<Typography align='center' fontWeight={'bold'}>
				Суммарное количество ед. продукции в заказах, шт
			</Typography>
			<Box height={500}>{seriesQuantity ? <Line data={{ series: [seriesQuantity], axis }} /> : null}</Box>
		</Stack>
	)
}
