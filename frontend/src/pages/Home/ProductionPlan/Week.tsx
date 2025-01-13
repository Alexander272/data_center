import { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import type { BarSeriesOption } from 'echarts'
import dayjs from 'dayjs'

import type { ISeriesData } from '@/types/sheet'
import type { IPlan } from '@/types/productionPlan'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'
import { BarChart } from '../components/BarChart/Bar'
import { tooltip } from '../components/Tooltip/Tooltip'

type Props = {
	data: IPlan[]
}

// const colors = ['#3d6cff', '#65bd3b', '#f9b61e', '#f74c4c', '#41caff', '#25b773', '#f96c32']
// const colorsDarkest = ['#1b2c64', '#3e7423', '#a17718', '#a93333', '#277897', '#1a7048', '#b14113']

const defaultSeriesData = {
	stack: 'total',
	silent: true,
	itemStyle: { borderColor: 'transparent', color: '#f5f5f5' },
	emphasis: { itemStyle: { borderColor: 'transparent', color: '#f5f5f5' } },
}

export default function Week({ data }: Props) {
	const [seriesMoney, setSeriesMoney] = useState<ISeriesData[]>([])
	const [seriesCount, setSeriesCount] = useState<ISeriesData[]>([])
	const [seriesSumCount, setSeriesSumCount] = useState<ISeriesData>()
	const [seriesSumMoney, setSeriesSumMoney] = useState<ISeriesData>()
	const [axis, setAxis] = useState<string[]>([])
	// const [map, setMap] = useState<IVisualMap[]>([])

	const [seriesSavingMoney, setSeriesSavingMoney] = useState<BarSeriesOption[]>()
	const [seriesSavingCount, setSeriesSavingCount] = useState<BarSeriesOption[]>()
	const [seriesSavingSumCount, setSeriesSavingSumCount] = useState<BarSeriesOption>()
	const [seriesSavingSumMoney, setSeriesSavingSumMoney] = useState<BarSeriesOption>()

	const [minMoney, setMinMoney] = useState(Infinity)
	const [minCount, setMinCount] = useState(Infinity)
	// const minMoney = useRef(Infinity)
	// const minCount = useRef(Infinity)

	useEffect(() => {
		const axisLine = new Set<string>()
		// const lines = {}
		const moneyLines = new Map<string, number[]>()
		const countLines = new Map<string, number[]>()
		const plan = new Map<string, number>()

		const sumMoney = new Map<string, number>()
		const sumCount = new Map<string, number>()

		const savingMoney = new Map<number, number>([[0, 0]])
		const savingCount = new Map<number, number>([[0, 0]])

		data.forEach(d => {
			const date = dayjs(+(d.date || 0) * 1000).format(FormatDate) || ''
			axisLine.add(date)

			let line = moneyLines.get(d.product)
			if (!line) {
				moneyLines.set(d.product, [d.money])
			} else {
				line.push(d.money)
				moneyLines.set(d.product, line)
			}
			line = countLines.get(d.product)
			if (!line) {
				countLines.set(d.product, [d.count])
			} else {
				line.push(d.count)
				countLines.set(d.product, line)
			}

			let s = sumMoney.get(date)
			if (!s) sumMoney.set(date, +d.money)
			else sumMoney.set(date, s + +d.money)

			s = sumCount.get(date)
			if (!s) sumCount.set(date, +d.count)
			else sumCount.set(date, s + +d.count)

			plan.set(d.product, d.planMoney)

			// if (i == 0) {
			// 	savingMoney.set(i, 0)
			// 	savingCount.set(i, 0)
			// } else {
			// 	const lastDate = dayjs(+(data[i - 1].date || 0) * 1000).format(FormatDate) || ''
			// 	savingMoney.set(i, (savingMoney.get(i - 1) || 0) + (sumMoney.get(lastDate) || 0))
			// }
		})

		const sumMoneyArr: number[] = []
		const sumCountArr: number[] = []
		let i = 1
		let min = Infinity
		sumMoney.forEach(v => {
			savingMoney.set(i, (savingMoney.get(i - 1) || 0) + v)
			if (v < min) min = v
			sumMoneyArr.push(v)
			i++
		})
		setMinMoney(min)
		i = 1
		min = Infinity
		sumCount.forEach(v => {
			savingCount.set(i, (savingCount.get(i - 1) || 0) + v)
			if (v < min) min = v
			sumCountArr.push(v)
			i++
		})
		setMinCount(min)

		// const savingMoneyArr = sumMoneyArr.reduce((acc, v) => [...acc, acc[acc.length - 1] + v], [0])
		// savingMoneyArr.pop()

		setAxis(Array.from(axisLine))

		i = 0
		const seriesMoney = Array.from(moneyLines, entry => {
			const p = plan.get(entry[0])
			i++
			return { name: entry[0], stack: `total-${i}`, data: entry[1], mark: p }
		})
		setSeriesMoney(seriesMoney)

		i = 0
		const seriesCount = Array.from(countLines, entry => {
			i++
			return { name: entry[0], stack: `total-${i}`, data: entry[1] }
		})
		setSeriesCount(seriesCount)

		setSeriesSumMoney({ name: 'Деньги', stack: 'total', data: sumMoneyArr })
		setSeriesSumCount({ name: 'Кол-во', stack: 'total', data: sumCountArr })

		setSeriesSavingSumMoney({ data: Array.from(savingMoney, v => v[1]), ...defaultSeriesData })
		setSeriesSavingSumCount({ data: Array.from(savingCount, v => v[1]), ...defaultSeriesData })

		const savingMoneySeries = seriesMoney.map(series => ({
			// name: 'Всего ' + series.name,
			data: series.data.reduce((acc, v) => [...acc, acc[acc.length - 1] + +v], [0]).slice(0, series.data.length),
			...defaultSeriesData,
			stack: series.stack,
		}))

		const savingCountSeries = seriesCount.map(series => ({
			data: series.data.reduce((acc, v) => [...acc, acc[acc.length - 1] + +v], [0]).slice(0, series.data.length),
			...defaultSeriesData,
			stack: series.stack,
		}))

		setSeriesSavingMoney(savingMoneySeries)
		setSeriesSavingCount(savingCountSeries)
	}, [data])

	return (
		<Stack spacing={1}>
			<Typography align='center' fontWeight={'bold'}>
				Отгружено в руб
			</Typography>
			<Box height={600}>{seriesMoney.length ? <Line data={{ series: seriesMoney, axis }} /> : null}</Box>
			<Box height={500}>
				{seriesMoney.length ? (
					<BarChart
						data={{
							series: [...(seriesSavingMoney as BarSeriesOption[]), ...seriesMoney],
							axis,
							tooltip,
						}}
					/>
				) : null}
			</Box>

			<Typography align='center' fontWeight={'bold'}>
				Отгружено штук
			</Typography>
			<Box height={600}>{seriesCount.length ? <Line data={{ series: seriesCount, axis }} /> : null}</Box>
			<Box height={500}>
				{seriesCount.length ? (
					<BarChart
						data={{
							series: [...(seriesSavingCount as BarSeriesOption[]), ...seriesCount],
							axis,
							tooltip,
						}}
					/>
				) : null}
			</Box>

			<Typography align='center' fontWeight={'bold'}>
				Отгружено
			</Typography>

			<Stack direction={'row'} spacing={1} height={400}>
				<Box flexBasis={'50%'}>
					{seriesSumMoney ? (
						<Line
							data={{ series: [seriesSumMoney], axis }}
							// minYValue={Math.round(minMoney.current * 0.96)}
							minYValue={String(minMoney * 0.92)
								.slice(0, 1)
								.padEnd(String(minMoney).length, '0')}
						/>
					) : null}
				</Box>
				<Box flexBasis={'50%'}>
					{seriesSavingSumMoney && seriesSumMoney ? (
						<BarChart data={{ series: [seriesSavingSumMoney, seriesSumMoney], axis, tooltip }} />
					) : null}
				</Box>
			</Stack>

			<Stack direction={'row'} spacing={1} height={400}>
				<Box flexBasis={'50%'}>
					{seriesSumCount ? (
						<Line
							data={{ series: [seriesSumCount], axis }}
							// minYValue={Math.round(minCount.current * 0.096) * 10}
							minYValue={String(minCount * 0.92)
								.slice(0, 1)
								.padEnd(String(minCount).length, '0')}
						/>
					) : null}
				</Box>
				<Box flexBasis={'50%'}>
					{seriesSavingSumCount && seriesSumCount ? (
						<BarChart data={{ series: [seriesSavingSumCount, seriesSumCount], axis, tooltip }} />
					) : null}
				</Box>
			</Stack>
		</Stack>
	)
}
