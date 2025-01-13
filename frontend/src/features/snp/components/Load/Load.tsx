import { useEffect, useState } from 'react'
import { Box, Stack } from '@mui/material'
import dayjs from 'dayjs'

import type { ISeriesData } from '@/types/sheet'
import { FormatDate } from '@/constants/format'
import { useGetProductionLoadByPeriodQuery } from '@/store/api/productionLoad'
import { Line } from '@/pages/Home/components/LineChart/Line'
import { Fallback } from '@/components/Fallback/Fallback'

export const Load = () => {
	const [loadDays, setLoadDays] = useState<{ axis: string[]; series: ISeriesData[] }>()
	const [loadCosts, setLoadCosts] = useState<{ axis: string[]; series: ISeriesData[] }>()

	let date = dayjs().startOf('d').subtract(1, 'd')
	if (date.day() < 3) date = date.subtract(5, 'd')

	// const from = date.startOf('w').unix().toString()
	// const to = date.endOf('w').unix().toString()
	const from = (1729450800).toString()
	const to = (1730055599).toString()

	const { data, isFetching } = useGetProductionLoadByPeriodQuery({ from, to }, { skip: from == '' })

	useEffect(() => {
		const axisLine = new Set<string>()
		const days: number[] = []
		const costs: number[] = []

		data?.data.forEach(d => {
			axisLine.add(dayjs(+(d.date || 0) * 1000).format(FormatDate) || '')
			if (d.sector == 'СНП') {
				days.push(d.days || 0)
				costs.push(d.money || 0)
			}
		})

		setLoadDays({ axis: Array.from(axisLine), series: [{ name: 'Дней', data: days }] })
		setLoadCosts({ axis: Array.from(axisLine), series: [{ name: 'Стоимость без НДС', data: costs }] })
	}, [data])

	if (isFetching) return <Fallback />
	return (
		<Stack direction={'row'}>
			<Box width={'50%'} height={300}>
				<Line data={{ axis: loadCosts?.axis || [], series: loadCosts?.series || [] }} />
			</Box>
			<Box width={'50%'} height={300}>
				<Line data={{ axis: loadDays?.axis || [], series: loadDays?.series || [] }} />
			</Box>
		</Stack>
	)
}
