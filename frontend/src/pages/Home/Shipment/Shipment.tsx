import { Suspense, lazy, useEffect, useState } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { useGetShipmentPlanByPeriodQuery } from '@/store/api/shipmentPlan'
import { useGetProductionPlanByPeriodQuery } from '@/store/api/productionPlan'
import type { IShipment } from '@/types/shipment'

const Day = lazy(() => import('@/pages/Home/Shipment/Day'))
const Week = lazy(() => import('@/pages/Home/Shipment/Week'))

export default function Shipment() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const [data, setData] = useState<IShipment[]>([])

	const {
		data: shipment,
		isLoading: isLoadingShipment,
		isError: isErrShipment,
	} = useGetShipmentPlanByPeriodQuery(period, { skip: period.from == '' })
	const {
		data: plan,
		isLoading: isLoadingPlan,
		isError: isErrPlan,
	} = useGetProductionPlanByPeriodQuery({ period, type: 'shipment' }, { skip: period.from == '' })

	useEffect(() => {
		if (shipment?.data || plan?.data) {
			const d = shipment?.data?.map(s => {
				const p = plan?.data?.find(p => p.product == s.product)
				return {
					id: s.id || '',
					date: s.day || '',
					product: s.product || '',
					count: s.count || 0,
					money: s.money || 0,
					planQuantity: p?.quantity || 0,
					planMoney: p?.money || 0,
				}
			})
			setData(d || [])
		}
	}, [shipment, plan])

	return (
		<>
			{/* <Box padding={2} borderRadius={'16px'} sx={{ backgroundColor: '#fff' }} width={'100%'}> */}
			{/* <Stack direction={'row'} mb={3}>
					<Button disabled sx={{ borderRadius: '12px', minWidth: 48 }}>
						<ArrowBackIcon />
					</Button>

					<Typography fontWeight={'bold'} fontSize={'1.6rem'} ml={'auto'} mr={'auto'}>
						Выполнение плана отгрузок ({period.from}
						{period.to ? '-' + period.to : ''})
					</Typography>

					<Button disabled sx={{ borderRadius: '12px', minWidth: 48 }}>
						<ArrowForwardIcon />
					</Button>
				</Stack> */}

			{/* {shipment?.data && plan?.data ? (
				<Suspense fallback={<CircularProgress />}>
					{periodType == 'day' && <Day data={data} />}
					{periodType != 'day' && <Week data={data} />}
				</Suspense>
			) : (
				<Box mt={2}>
					{!isErrShipment && !isErrPlan ? (
						<Typography fontSize={'1.2rem'} textAlign={'center'}>
							Для выбранного периода данные не найдены
						</Typography>
					) : (
						<Typography fontSize={'1.2rem'} textAlign={'center'}>
							Не удалось получить данные
						</Typography>
					)}
				</Box>
			)} */}

			{shipment?.data || plan?.data ? (
				<Suspense fallback={<CircularProgress />}>
					{periodType == 'day' && <Day data={data} />}
					{periodType != 'day' && <Week data={data} />}
				</Suspense>
			) : null}

			{(!shipment?.data || !plan?.data) && (isLoadingPlan || isLoadingShipment) ? <CircularProgress /> : null}

			{(!shipment?.data || !plan?.data) && !isLoadingPlan && !isLoadingShipment ? (
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
			{/* </Box> */}
		</>
	)
}
