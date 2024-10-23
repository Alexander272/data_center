import { Suspense, lazy } from 'react'
import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/useStore'
import { useGetSafetyByPeriodQuery } from '@/store/api/safety'
import { TableFallBack } from '../components/Fallback/FallBack'

const Day = lazy(() => import('@/pages/Home/Safety/Day'))
const Week = lazy(() => import('@/pages/Home/Safety/Week'))

export default function Safety() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data, isFetching, isError } = useGetSafetyByPeriodQuery(period, { skip: !period.from })

	return (
		<>
			{data?.data.length ? (
				<Suspense fallback={<TableFallBack />}>
					{periodType == 'day' && <Day data={data.data} />}
					{periodType != 'day' && <Week data={data.data} />}
				</Suspense>
			) : null}

			{isFetching ? <TableFallBack /> : null}

			{!data?.data.length && !isFetching ? (
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
