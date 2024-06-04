import { Suspense, lazy } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import dayjs from 'dayjs'

import { useAppSelector } from '@/hooks/useStore'
import { useGetSemiFinishedByPeriodQuery } from '@/store/api/semiFinished'

const Day = lazy(() => import('@/pages/Home/SemiFinished/Day'))
const Week = lazy(() => import('@/pages/Home/SemiFinished/Week'))

export const SemiFinished = () => {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const {
		data: semiFinished,
		isLoading,
		isError,
	} = useGetSemiFinishedByPeriodQuery(
		{
			from: dayjs(period.from, 'DD.MM.YYYY').unix().toString(),
			to: period.to ? dayjs(period.to, 'DD.MM.YYYY').unix().toString() : '',
		},
		{ skip: !period.from }
	)

	return (
		<>
			{semiFinished?.data.length ? (
				<Suspense fallback={<CircularProgress />}>
					{periodType == 'day' && <Day data={semiFinished.data} />}
					{periodType != 'day' && <Week data={semiFinished.data} />}
				</Suspense>
			) : null}

			{isLoading && <CircularProgress />}

			{!semiFinished?.data.length && !isLoading ? (
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
