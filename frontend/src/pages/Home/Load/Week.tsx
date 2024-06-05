import { useEffect, useState } from 'react'
import { Box, Stack } from '@mui/material'
import dayjs from 'dayjs'

import type { IProductionLoad } from '@/types/productionLoad'
import type { ISeriesData } from '@/types/sheet'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: IProductionLoad[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<string[]>([])
	const [seriesDays, setSeriesDays] = useState<ISeriesData[]>()

	useEffect(() => {
		const axisLine = new Set<string>()
		const days = new Map<string, number[]>()

		data.forEach(d => {
			axisLine.add(dayjs(+(d.date || 0) * 1000).format(FormatDate) || '')

			const data = days.get(d.sector || '')
			if (!data) {
				days.set(d.sector || '', [d.days || 0])
			} else {
				data.push(d.days || 0)
				days.set(d.sector || '', data)
			}
		})

		setAxis(Array.from(axisLine))
		setSeriesDays(
			Array.from(days, entry => {
				return { name: entry[0], data: entry[1] }
			})
		)
	}, [data])

	return (
		<Stack spacing={1}>
			<Box height={500}>{seriesDays?.length ? <Line data={{ series: seriesDays, axis }} /> : null}</Box>
		</Stack>
	)
}
