import { Suspense, lazy, useEffect, useState } from 'react'
import { Typography } from '@mui/material'

import type { IOutput } from '@/types/outputVolume'
import { useAppSelector } from '@/hooks/useStore'
import { useGetOutputVolumeByPeriodQuery } from '@/store/api/outputVolume'
import { useGetProductionPlanByPeriodQuery } from '@/store/api/productionPlan'
import { TableFallBack } from '../components/Fallback/FallBack'

const Day = lazy(() => import('@/pages/Home/Output/Day'))
const Week = lazy(() => import('@/pages/Home/Output/Week'))

export default function Output() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const [data, setData] = useState<IOutput[]>([])

	const {
		data: output,
		isFetching: isFetchOutput,
		isError: isErrOutput,
	} = useGetOutputVolumeByPeriodQuery(period, { skip: period.from == '' })
	const {
		data: plan,
		isFetching: isFetchPlan,
		isError: isErrPlan,
	} = useGetProductionPlanByPeriodQuery({ period, type: 'output' }, { skip: period.from == '' })

	useEffect(() => {
		if (output?.data.length || plan?.data.length) {
			const d = output?.data?.map(s => {
				const p = plan?.data?.find(p => p.product == s.product)
				return {
					id: s.id || '',
					date: s.date || '',
					forStock: s.forStock || false,
					product: s.product || '',
					count: s.count || 0,
					money: s.money || 0,
					planQuantity: p?.quantity || 0,
					planMoney: p?.money || 0,
				}
			})
			setData(d || [])
		} else setData([])
	}, [output, plan])

	return (
		<>
			{output?.data.length || plan?.data.length ? (
				<Suspense fallback={<TableFallBack />}>
					{periodType == 'day' && <Day data={data} />}
					{periodType != 'day' && <Week data={data} />}
				</Suspense>
			) : null}

			{isFetchOutput || isFetchPlan ? <TableFallBack /> : null}

			{!output?.data.length && !plan?.data.length && !isFetchPlan && !isFetchOutput ? (
				!isErrOutput && !isErrPlan ? (
					<Typography mt={2} fontSize={'1.2rem'} textAlign={'center'}>
						Для выбранного периода данные не найдены
					</Typography>
				) : (
					<Typography mt={2} fontSize={'1.2rem'} textAlign={'center'}>
						Не удалось получить данные
					</Typography>
				)
			) : null}
		</>
	)
}
