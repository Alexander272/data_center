import { Suspense, lazy } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { useGetOutputVolumeByPeriodQuery } from '@/store/api/outputVolume'

const Day = lazy(() => import('@/pages/Home/Output/Day'))
const Week = lazy(() => import('@/pages/Home/Output/Week'))

export default function Output() {
	const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data, isLoading, isError } = useGetOutputVolumeByPeriodQuery(period, { skip: period.from == '' })

	return (
		<>
			{/* <Box padding={2} borderRadius={'16px'} sx={{ backgroundColor: '#fff' }} width={'100%'}>
				<Stack direction={'row'} mb={3}>
					<Button disabled sx={{ borderRadius: '12px', minWidth: 48 }}>
						<ArrowBackIcon />
					</Button>

					<Typography textAlign={'center'} fontWeight={'bold'} fontSize={'1.6rem'} ml={'auto'} mr={'auto'}>
						Объем выпуска продукции ({period.from}
						{period.to ? '-' + period.to : ''})
					</Typography>

					<Button disabled sx={{ borderRadius: '12px', minWidth: 48 }}>
						<ArrowForwardIcon />
					</Button>
				</Stack> */}

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
			{/* </Box> */}
		</>
	)
}
