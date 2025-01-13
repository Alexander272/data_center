import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import type { ISemiFinished } from '@/types/semiFinished'
import type { IAxisData, ISeriesData } from '@/types/sheet'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: ISemiFinished[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<IAxisData[]>([])
	const [seriesDays, setSeriesDays] = useState<ISeriesData[]>()

	useEffect(() => {
		const axisLine = new Map<string, IAxisData>()
		const days = new Map<string, number[]>()

		data.forEach(d => {
			const dateObj = dayjs(+(d.date || 0) * 1000)
			const date = dateObj.format(FormatDate) || ''

			if (dateObj.day() == 0 || dateObj.day() == 6) {
				axisLine.set(date, { value: date, textStyle: { color: '#b80505' } })
			} else {
				axisLine.set(date, date)
			}

			const data = days.get(d.product || '')
			if (!data) {
				days.set(d.product || '', [d.count || 0])
			} else {
				data.push(d.count || 0)
				days.set(d.product || '', data)
			}
		})

		setAxis(Array.from(axisLine, entry => entry[1]))
		setSeriesDays(Array.from(days, entry => ({ name: entry[0], data: entry[1] })))
	}, [data])

	return (
		<Stack spacing={1}>
			<Box height={500}>{seriesDays?.length ? <Line data={{ series: seriesDays, axis }} /> : null}</Box>
		</Stack>
	)
}
