import { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'

import type { IShippingPlan } from '@/types/shippingPlan'
import type { ISeriesData } from '@/types/sheet'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: IShippingPlan[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<string[]>([])
	const [seriesNumber, setSeriesNumber] = useState<ISeriesData>()
	const [seriesMoney, setSeriesMoney] = useState<ISeriesData>()
	const [seriesQuantity, setSeriesQuantity] = useState<ISeriesData>()

	useEffect(() => {
		const axisLine = new Set<string>()
		const number: number[] = []
		const money: number[] = []
		const quantity: number[] = []

		data.forEach(d => {
			axisLine.add(dayjs(+(d.date || 0) * 1000).format(FormatDate) || '')
			number.push(+(d.numberOfOrders || 0))
			money.push(+(d.sumMoney || 0))
			quantity.push(+(d.quantity || 0))
		})

		setAxis(Array.from(axisLine))
		setSeriesNumber({ name: 'Количество заказов', data: number })
		setSeriesMoney({ name: 'Сумма заказов', data: money })
		setSeriesQuantity({ name: 'Суммарное количество ед. продукции в заказов', data: quantity })
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
