import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import type { ISeriesData } from '@/types/sheet'
import type { ISafety } from '@/types/safety'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: ISafety[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<string[]>([])
	const [seriesViolations, setSeriesViolations] = useState<ISeriesData>()
	const [seriesInjuries, setSeriesInjuries] = useState<ISeriesData>()

	useEffect(() => {
		const axisLine = new Set<string>()
		const violations = new Map<string, number>()
		const injuries = new Map<string, number>()

		data.forEach(d => {
			const day = dayjs(+(d.date || 0) * 1000).format(FormatDate)
			axisLine.add(day)
			violations.set(day, +(d.violations || 0))
			injuries.set(day, +(d.injuries || 0))
		})

		setAxis(Array.from(axisLine))
		setSeriesViolations({
			name: 'Количество выявленных нарушений',
			data: Array.from(violations, entry => {
				return entry[1]
			}),
		})
		setSeriesInjuries({
			name: 'Количество травм',
			data: Array.from(injuries, entry => {
				return entry[1]
			}),
		})
	}, [data])

	return (
		<Stack spacing={1}>
			<Box height={500}>
				{seriesViolations && seriesInjuries ? (
					<Line data={{ series: [seriesViolations, seriesInjuries], axis }} />
				) : null}
			</Box>
		</Stack>
	)
}
