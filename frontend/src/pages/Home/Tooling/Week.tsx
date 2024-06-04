import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import type { ISeriesData } from '@/types/sheet'
import type { ITooling } from '@/types/tooling'
import { FormatDate } from '@/constants/format'
import { Line } from '../components/LineChart/Line'

type Props = {
	data: ITooling[]
}

export default function Week({ data }: Props) {
	const [axis, setAxis] = useState<string[]>([])
	const [series, setSeries] = useState<ISeriesData>()

	useEffect(() => {
		const axisLine = new Set<string>()
		const quantity = new Map<string, number>()

		data.forEach(d => {
			axisLine.add(dayjs(+(d.day || 0) * 1000).format(FormatDate) || '')
			quantity.set(d.day || '', +(d.progress || 0))
		})

		setAxis(Array.from(axisLine))
		setSeries({
			name: 'Количество заявок в работе',
			data: Array.from(quantity, entry => {
				return entry[1]
			}),
		})
	}, [data])

	return (
		<Stack spacing={1}>
			<Box height={500}>{series ? <Line data={{ series: [series], axis }} /> : null}</Box>
		</Stack>
	)
}
