import { Suspense, lazy, useEffect, useState } from 'react'
import { Typography } from '@mui/material'

import type { IPlan } from '@/types/productionPlan'
import { useAppSelector } from '@/hooks/useStore'
import { useGetShipmentByPeriodQuery } from '@/store/api/shipment'
import { useGetProductionPlanByPeriodQuery } from '@/store/api/productionPlan'
import { TableFallBack } from '../components/Fallback/FallBack'

const Day = lazy(() => import('@/pages/Home/ProductionPlan/Day'))
const Week = lazy(() => import('@/pages/Home/ProductionPlan/Week'))

export default function ProductionPlan() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const [data, setData] = useState<IPlan[]>([])

	const {
		data: shipment,
		isFetching: isFetchShipment,
		isError: isErrShipment,
	} = useGetShipmentByPeriodQuery(period, { skip: period.from == '' })
	const {
		data: plan,
		isFetching: isFetchPlan,
		isError: isErrPlan,
	} = useGetProductionPlanByPeriodQuery({ period, type: 'annual' }, { skip: period.from == '' })

	useEffect(() => {
		if (shipment?.data.length && plan?.data.length) {
			const d = shipment.data.map(s => {
				const p = plan.data.find(p => p.product == s.product)
				return {
					id: s.id || '',
					date: s.date || '',
					product: s.product || '',
					count: s.count || 0,
					money: s.money || 0,
					planMoney: p?.money || 0,
				}
			})
			setData(d)
		} else {
			setData([])
		}
	}, [shipment, plan])

	return (
		<>
			{shipment?.data.length && plan?.data.length ? (
				<Suspense fallback={<TableFallBack />}>
					{periodType == 'day' && <Day data={data} />}
					{periodType != 'day' && <Week data={data} />}
				</Suspense>
			) : null}

			{isFetchShipment || isFetchPlan ? <TableFallBack /> : null}

			{(!shipment?.data.length || !plan?.data.length) && !isFetchPlan && !isFetchShipment ? (
				!isErrShipment && !isErrPlan ? (
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
