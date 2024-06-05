import { Suspense, lazy } from 'react'
import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/useStore'
import { useGetOrdersVolumeByPeriodQuery } from '@/store/api/ordersVolume'
import { TableFallBack } from '../components/Fallback/FallBack'

const Day = lazy(() => import('@/pages/Home/Orders/Day'))
const Week = lazy(() => import('@/pages/Home/Orders/Week'))

export default function Orders() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data, isFetching, isError } = useGetOrdersVolumeByPeriodQuery(period, { skip: period.from == '' })

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
