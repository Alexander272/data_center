import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import type { IAxisData, ISeriesData } from '@/types/sheet'
import type { ITooling } from '@/types/tooling'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: ITooling[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<IAxisData[]>([])
	const [series, setSeries] = useState<ISeriesData>()

	useEffect(() => {
		const axisLine = new Map<string, IAxisData>()
		const quantity = new Map<string, number>()

		data.forEach(d => {
			const dateObj = dayjs(+(d.date || 0) * 1000)
			const date = dateObj.format(FormatDate) || ''

			if (dateObj.day() == 0 || dateObj.day() == 6) {
				axisLine.set(date, { value: date, textStyle: { color: '#b80505' } })
			} else {
				axisLine.set(date, date)
			}

			quantity.set(d.date || '', +(d.progress || 0))
		})

		setAxis(Array.from(axisLine, entry => entry[1]))
		setSeries({
			name: 'Количество заявок в работе',
			data: Array.from(quantity, entry => entry[1]),
		})
	}, [data])

	return (
		<Stack spacing={1}>
			<Box height={500}>{series ? <Line data={{ series: [series], axis }} /> : null}</Box>
		</Stack>
	)
}
