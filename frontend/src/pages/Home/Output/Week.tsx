import { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import type { IOutput } from '@/types/outputVolume'
import type { ISeriesData } from '@/types/sheet'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: IOutput[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<string[]>([])
	const [seriesCountStock, setSeriesCountStock] = useState<ISeriesData[]>([])
	const [seriesMoneyOrder, setSeriesMoneyOrder] = useState<ISeriesData[]>([])
	const [seriesCountOrder, setSeriesCountOrder] = useState<ISeriesData[]>([])

	const [seriesSumCountStock, setSeriesSumCountStock] = useState<ISeriesData>()
	const [seriesSumCountOrder, setSeriesSumCountOrder] = useState<ISeriesData>()
	const [seriesSumMoneyOrder, setSeriesSumMoneyOrder] = useState<ISeriesData>()

	const minMoney = useRef(Infinity)
	const minCount = useRef(Infinity)

	useEffect(() => {
		const stock = data.filter(d => d.forStock)
		const orders = data.filter(d => !d.forStock)

		const axisLine = new Set<string>()
		const countStockLines = new Map<string, number[]>()
		const moneyOrderLines = new Map<string, number[]>()
		const countOrderLines = new Map<string, number[]>()

		const sumCountStock = new Map<string, number>()
		const sumMoneyOrder = new Map<string, number>()
		const sumCountOrder = new Map<string, number>()

		const planMoney = new Map<string, number>()
		const planQuantity = new Map<string, number>()

		stock.forEach(d => {
			axisLine.add(d.day || '')

			const data = countStockLines.get(d.product || '')
			if (!data) {
				countStockLines.set(d.product || '', [d.count || 0])
			} else {
				data.push(d.count || 0)
				countStockLines.set(d.product || '', data)
			}

			const s = sumCountStock.get(d.day || '')
			if (!s) sumCountStock.set(d.day || '', +(d.count || 0))
			else sumCountStock.set(d.day || '', s + +(d.count || 0))
		})

		orders.forEach(d => {
			let data = moneyOrderLines.get(d.product || '')
			if (!data) {
				moneyOrderLines.set(d.product || '', [d.money || 0])
			} else {
				data.push(d.money || 0)
				moneyOrderLines.set(d.product || '', data)
			}
			data = countOrderLines.get(d.product || '')
			if (!data) {
				countOrderLines.set(d.product || '', [d.count || 0])
			} else {
				data.push(d.count || 0)
				countOrderLines.set(d.product || '', data)
			}

			let s = sumMoneyOrder.get(d.day || '')
			if (!s) sumMoneyOrder.set(d.day || '', +(d.money || 0))
			else sumMoneyOrder.set(d.day || '', s + +(d.money || 0))

			s = sumCountOrder.get(d.day || '')
			if (!s) sumCountOrder.set(d.day || '', +(d.count || 0))
			else sumCountOrder.set(d.day || '', s + +(d.count || 0))

			planMoney.set(d.product, d.planMoney)
			planQuantity.set(d.product, d.planQuantity)
		})

		setAxis(Array.from(axisLine))
		setSeriesCountStock(
			Array.from(countStockLines, entry => {
				return { name: entry[0], data: entry[1] }
			})
		)
		setSeriesMoneyOrder(
			Array.from(moneyOrderLines, entry => {
				const p = planMoney.get(entry[0])
				return { name: entry[0], data: entry[1], mark: p }
			})
		)
		setSeriesCountOrder(
			Array.from(countOrderLines, entry => {
				const p = planQuantity.get(entry[0])
				return { name: entry[0], data: entry[1], mark: p }
			})
		)

		setSeriesSumCountStock({
			name: 'на склад, шт',
			data: Array.from(sumCountStock, entry => {
				if (entry[1] < minCount.current) minCount.current = entry[1]
				return entry[1]
			}),
		})
		setSeriesSumMoneyOrder({
			name: 'в заказы, руб',
			data: Array.from(sumMoneyOrder, entry => {
				if (entry[1] < minMoney.current) minMoney.current = entry[1]
				return entry[1]
			}),
		})
		setSeriesSumCountOrder({
			name: 'в заказы, шт',
			data: Array.from(sumCountOrder, entry => {
				if (entry[1] < minCount.current) minCount.current = entry[1]
				return entry[1]
			}),
		})
	}, [data])

	return (
		<Stack spacing={1}>
			<Typography align='center' fontWeight={'bold'}>
				Выпуск в заказы, руб
			</Typography>
			<Box height={600}>
				{seriesMoneyOrder.length ? <Line data={{ series: seriesMoneyOrder, axis }} /> : null}
			</Box>

			<Typography align='center' fontWeight={'bold'}>
				Выпуск в заказы, штук
			</Typography>
			<Box height={600}>
				{seriesCountOrder.length ? <Line data={{ series: seriesCountOrder, axis }} /> : null}
			</Box>

			<Typography align='center' fontWeight={'bold'}>
				Выпуск на склад, штук
			</Typography>
			<Box height={600}>
				{seriesCountStock.length ? <Line data={{ series: seriesCountStock, axis }} /> : null}
			</Box>

			<Typography align='center' fontWeight={'bold'}>
				Выпуск
			</Typography>
			<Box height={400}>
				<Stack direction={'row'} spacing={1} height={'100%'}>
					<Box flexBasis={'50%'}>
						{seriesSumMoneyOrder ? (
							<Line data={{ series: [seriesSumMoneyOrder], axis }} minYValue={minMoney.current * 0.96} />
						) : null}
					</Box>

					<Box flexBasis={'50%'}>
						{seriesSumCountStock && seriesSumCountOrder ? (
							<Line
								data={{ series: [seriesSumCountStock, seriesSumCountOrder], axis }}
								minYValue={minCount.current * 0.96}
							/>
						) : null}
					</Box>
				</Stack>
			</Box>
		</Stack>
	)
}
