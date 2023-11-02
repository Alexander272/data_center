import { Suspense, lazy, useEffect, useState } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { useGetOutputVolumeByPeriodQuery } from '@/store/api/outputVolume'
import { useGetProductionPlanByPeriodQuery } from '@/store/api/productionPlan'
import type { IOutput } from '@/types/outputVolume'

const Day = lazy(() => import('@/pages/Home/Output/Day'))
const Week = lazy(() => import('@/pages/Home/Output/Week'))

export default function Output() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const [data, setData] = useState<IOutput[]>([])

	const {
		data: output,
		isLoading: isLoadingOutput,
		isError: isErrOutput,
	} = useGetOutputVolumeByPeriodQuery(period, { skip: period.from == '' })
	const {
		data: plan,
		isLoading: isLoadingPlan,
		isError: isErrPlan,
	} = useGetProductionPlanByPeriodQuery({ period, type: 'output' }, { skip: period.from == '' })

	useEffect(() => {
		if (output?.data || plan?.data) {
			const d = output?.data?.map(s => {
				const p = plan?.data?.find(p => p.product == s.product)
				return {
					id: s.id || '',
					day: s.day || '',
					forStock: s.forStock || false,
					product: s.product || '',
					count: s.count || 0,
					money: s.money || 0,
					planQuantity: p?.quantity || 0,
					planMoney: p?.money || 0,
				}
			})
			setData(d || [])
		}
	}, [output, plan])

	return (
		<>
			{output?.data || plan?.data ? (
				<Suspense fallback={<CircularProgress />}>
					{periodType == 'day' && <Day data={data} />}
					{periodType != 'day' && <Week data={data} />}
				</Suspense>
			) : null}

			{(!output?.data || !plan?.data) && (isLoadingPlan || isLoadingOutput) ? <CircularProgress /> : null}

			{!output?.data && !plan?.data && !isLoadingPlan && !isLoadingOutput ? (
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
