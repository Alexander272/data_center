import { Suspense, lazy } from 'react'
import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/useStore'
import { useGetToolingByPeriodQuery } from '@/store/api/tooling'
import { TableFallBack } from '../components/Fallback/FallBack'

const Day = lazy(() => import('@/pages/Home/Tooling/Day'))
const Week = lazy(() => import('@/pages/Home/Tooling/Week'))

export default function Tooling() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data, isFetching, isError } = useGetToolingByPeriodQuery(period, { skip: !period.from })

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
