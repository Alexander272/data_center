import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import type { IAxisData, ISeriesData } from '@/types/sheet'
import type { ISafety } from '@/types/safety'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: ISafety[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<IAxisData[]>([])
	const [seriesViolations, setSeriesViolations] = useState<ISeriesData>()
	const [seriesInjuries, setSeriesInjuries] = useState<ISeriesData>()

	useEffect(() => {
		const axisLine = new Map<string, IAxisData>()
		const violations = new Map<string, number>()
		const injuries = new Map<string, number>()

		data.forEach(d => {
			const dateObj = dayjs(+(d.date || 0) * 1000)
			const date = dateObj.format(FormatDate) || ''

			if (dateObj.day() == 0 || dateObj.day() == 6) {
				axisLine.set(date, { value: date, textStyle: { color: '#b80505' } })
			} else {
				axisLine.set(date, date)
			}

			violations.set(date, +(d.violations || 0))
			injuries.set(date, +(d.injuries || 0))
		})

		setAxis(Array.from(axisLine, entry => entry[1]))
		setSeriesViolations({
			name: 'Количество выявленных нарушений',
			data: Array.from(violations, entry => entry[1]),
		})
		setSeriesInjuries({
			name: 'Количество травм',
			data: Array.from(injuries, entry => entry[1]),
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
