import { Suspense, lazy } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { useGetOrdersVolumeByPeriodQuery } from '@/store/api/ordersVolume'

const Day = lazy(() => import('@/pages/Home/Orders/Day'))
const Week = lazy(() => import('@/pages/Home/Orders/Week'))

export default function Orders() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data, isLoading, isError } = useGetOrdersVolumeByPeriodQuery(period, { skip: period.from == '' })

	return (
		<>
			{data?.data ? (
				<Suspense fallback={<CircularProgress />}>
					{periodType == 'day' && <Day data={data.data} />}
					{periodType == 'week' && <Week data={data.data} />}
				</Suspense>
			) : null}

			{!data?.data && isLoading ? <CircularProgress /> : null}

			{!data?.data && !isLoading ? (
				isError ? (
					<Typography mt={2} fontSize={'1.2rem'} textAlign={'center'}>
						Не удалось получить данные
					</Typography>
				) : (
					<Typography mt={2} fontSize={'1.2rem'} textAlign={'center'}>
						Для выбранного периода данные не найдены
					</Typography>
				)
			) : null}
		</>
	)
}
