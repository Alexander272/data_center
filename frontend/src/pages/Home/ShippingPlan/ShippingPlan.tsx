import { Suspense } from 'react'
import { Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { useGetShippingPlanByPeriodQuery } from '@/store/api/shippingPlan'
import { Fallback } from '@/components/Fallback/Fallback'
import Day from './Day'
import Week from './Week'

export default function ShippingPlan() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data, isFetching, isError } = useGetShippingPlanByPeriodQuery(period, { skip: !period.from })

	return (
		<>
			{data?.data && (
				<Suspense fallback={<Fallback />}>
					{periodType == 'day' && <Day data={data.data} />}
					{periodType != 'day' && <Week data={data.data} />}
				</Suspense>
			)}

			{isFetching && <Fallback />}

			{!data?.data && !isFetching ? (
				isError ? (
					<Typography mt={2} fontSize={'1.2rem'} textAlign='center'>
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
