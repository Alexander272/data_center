import { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'

import type { ISeriesData } from '@/types/sheet'
import type { IPlan } from '@/types/productionPlan'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: IPlan[]
}

// const colors = ['#3d6cff', '#65bd3b', '#f9b61e', '#f74c4c', '#41caff', '#25b773', '#f96c32']
// const colorsDarkest = ['#1b2c64', '#3e7423', '#a17718', '#a93333', '#277897', '#1a7048', '#b14113']

export default function Week({ data }: Props) {
	const [seriesMoney, setSeriesMoney] = useState<ISeriesData[]>([])
	const [seriesCount, setSeriesCount] = useState<ISeriesData[]>([])
	const [seriesSumCount, setSeriesSumCount] = useState<ISeriesData>()
	const [seriesSumMoney, setSeriesSumMoney] = useState<ISeriesData>()
	const [axis, setAxis] = useState<string[]>([])
	// const [map, setMap] = useState<IVisualMap[]>([])

	// const [minMoney, setMinMoney] = useState(Infinity)
	// const [minCount, setMinCount] = useState(Infinity)
	const minMoney = useRef(Infinity)
	const minCount = useRef(Infinity)

	useEffect(() => {
		const axisLine = new Set<string>()
		// const lines = {}
		const moneyLines = new Map<string, number[]>()
		const countLines = new Map<string, number[]>()
		const plan = new Map<string, number>()

		const sumMoney = new Map<string, number>()
		const sumCount = new Map<string, number>()

		data.forEach(d => {
			const date = dayjs(+(d.date || 0) * 1000).format(FormatDate) || ''
			axisLine.add(date)

			let data = moneyLines.get(d.product)
			if (!data) {
				moneyLines.set(d.product, [d.money])
			} else {
				data.push(d.money)
				moneyLines.set(d.product, data)
			}
			data = countLines.get(d.product)
			if (!data) {
				countLines.set(d.product, [d.count])
			} else {
				data.push(d.count)
				countLines.set(d.product, data)
			}

			let s = sumMoney.get(date)
			if (!s) sumMoney.set(date, +d.money)
			else sumMoney.set(date, s + +d.money)

			s = sumCount.get(date)
			if (!s) sumCount.set(date, +d.count)
			else sumCount.set(date, s + +d.count)

			plan.set(d.product, d.planMoney)
		})

		setAxis(Array.from(axisLine))

		setSeriesMoney(
			Array.from(moneyLines, entry => {
				const p = plan.get(entry[0])
				return { name: entry[0], data: entry[1], mark: p }
			})
		)

		setSeriesCount(
			Array.from(countLines, entry => {
				return { name: entry[0], data: entry[1] }
			})
		)

		setSeriesSumMoney({
			name: 'Деньги',
			data: Array.from(sumMoney, entry => {
				if (entry[1] < minMoney.current) minMoney.current = entry[1]
				return entry[1]
			}),
		})
		setSeriesSumCount({
			name: 'Кол-во',
			data: Array.from(sumCount, entry => {
				if (entry[1] < minCount.current) minCount.current = entry[1]
				return entry[1]
			}),
		})
	}, [data])

	return (
		<Stack spacing={1}>
			<Typography align='center' fontWeight={'bold'}>
				Отгружено в руб
			</Typography>
			<Box height={600}>{seriesMoney.length ? <Line data={{ series: seriesMoney, axis }} /> : null}</Box>

			<Typography align='center' fontWeight={'bold'}>
				Отгружено штук
			</Typography>
			<Box height={600}>{seriesCount.length ? <Line data={{ series: seriesCount, axis }} /> : null}</Box>

			<Typography align='center' fontWeight={'bold'}>
				Отгружено
			</Typography>
			<Box height={400}>
				<Stack direction={'row'} spacing={1} height={'100%'}>
					<Box flexBasis={'50%'}>
						{seriesSumMoney ? (
							<Line data={{ series: [seriesSumMoney], axis }} minYValue={minMoney.current * 0.96} />
						) : null}
					</Box>

					<Box flexBasis={'50%'}>
						{seriesSumCount ? (
							<Line data={{ series: [seriesSumCount], axis }} minYValue={minCount.current * 0.96} />
						) : null}
					</Box>
				</Stack>
			</Box>
		</Stack>
	)
}
