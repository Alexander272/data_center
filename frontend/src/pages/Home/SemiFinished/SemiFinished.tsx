import { Suspense, lazy } from 'react'
import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/useStore'
import { useGetSemiFinishedByPeriodQuery } from '@/store/api/semiFinished'
import { TableFallBack } from '../components/Fallback/FallBack'

const Day = lazy(() => import('@/pages/Home/SemiFinished/Day'))
const Week = lazy(() => import('@/pages/Home/SemiFinished/Week'))

export const SemiFinished = () => {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data: semiFinished, isFetching, isError } = useGetSemiFinishedByPeriodQuery(period, { skip: !period.from })

	return (
		<>
			{semiFinished?.data.length ? (
				<Suspense fallback={<TableFallBack />}>
					{periodType == 'day' && <Day data={semiFinished.data} />}
					{periodType != 'day' && <Week data={semiFinished.data} />}
				</Suspense>
			) : null}

			{isFetching ? <TableFallBack /> : null}

			{!semiFinished?.data.length && !isFetching ? (
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
export default SemiFinished
