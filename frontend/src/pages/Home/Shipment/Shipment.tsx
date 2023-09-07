import { Suspense, lazy } from 'react'
import {
	Box,
	CircularProgress,
	// Button,
	Stack,
	Typography,
} from '@mui/material'
// import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { useAppSelector } from '@/hooks/useStore'
import { useGetShipmentPlanByPeriodQuery } from '@/store/api/shipmentPlan'

// import Day from './Day'

const Day = lazy(() => import('@/pages/Home/Shipment/Day'))
const Week = lazy(() => import('@/pages/Home/Shipment/Week'))

export default function Shipment() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data } = useGetShipmentPlanByPeriodQuery(period, { skip: period.from == '' })

	// if (!data?.data) return null

	return (
		<Box padding={2} borderRadius={'16px'} sx={{ backgroundColor: '#fff' }} width={'100%'}>
			<Stack direction={'row'}>
				{/* <Button startIcon={<ArrowBackIcon />}></Button> */}

				<Typography fontWeight={'bold'} fontSize={'1.6rem'} mb={1} ml={'auto'} mr={'auto'}>
					Отгрузка ({period.from})
				</Typography>
			</Stack>

			{data?.data && (
				<Suspense fallback={<CircularProgress />}>
					{periodType == 'day' && <Day data={data.data || []} />}
					{periodType == 'week' && <Week data={data.data || []} />}
				</Suspense>
			)}
		</Box>
	)
}
