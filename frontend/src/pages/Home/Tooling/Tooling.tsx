import { Suspense, lazy } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import dayjs from 'dayjs'

import { useAppSelector } from '@/hooks/useStore'
import { useGetToolingByPeriodQuery } from '@/store/api/tooling'

const Day = lazy(() => import('@/pages/Home/Tooling/Day'))
const Week = lazy(() => import('@/pages/Home/Tooling/Week'))

export default function Tooling() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data, isLoading, isError } = useGetToolingByPeriodQuery(
		{
			from: dayjs(period.from, 'DD.MM.YYYY').unix().toString(),
			to: period.to ? dayjs(period.to, 'DD.MM.YYYY').unix().toString() : '',
		},
		{ skip: !period.from }
	)

	return (
		<>
			{data?.data.length ? (
				<Suspense fallback={<CircularProgress />}>
					{periodType == 'day' && <Day data={data.data} />}
					{periodType != 'day' && <Week data={data.data} />}
				</Suspense>
			) : null}

			{isLoading && <CircularProgress />}

			{!data?.data.length && !isLoading ? (
				!isError ? (
					<Typography fontSize={'1.2rem'} textAlign={'center'}>
						Для выбранного периода данные не найдены
					</Typography>
				) : (
					<Typography fontSize={'1.2rem'} textAlign={'center'}>
						Не удалось получить данные
					</Typography>
				)
			) : null}
		</>
	)
}
