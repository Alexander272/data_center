import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { useGetShipmentPlanByPeriodQuery } from '@/store/api/shipmentPlan'
import { Pie } from './Pie'

export default function Shipment() {
	// const periodType = useAppSelector(state => state.dashboard.periodType)
	const period = useAppSelector(state => state.dashboard.period)

	const { data } = useGetShipmentPlanByPeriodQuery(period, { skip: period.from == '' })

	if (!data?.data) return null

	return (
		<Box padding={2} borderRadius={'16px'} sx={{ backgroundColor: '#fff' }}>
			<Typography textAlign={'center'} fontWeight={'bold'}>
				Отгрузка
			</Typography>

			<Stack direction={'row'} spacing={1}>
				<Box width={'55%'}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>Продукция</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Шт
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Руб
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.data.map(d => (
								<TableRow key={d.id}>
									<TableCell>{d.product}</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(d.count || 0))}
									</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(d.money || 0))}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>

				<Stack width={'45%'}>
					<Box width={'100%'} height={350}>
						<Pie data={(data?.data || []).map(d => ({ value: +(d.count || 0), name: d.product || '' }))} />
					</Box>

					<Box width={'100%'} height={350}>
						<Pie data={(data?.data || []).map(d => ({ value: +(d.money || 0), name: d.product || '' }))} />
					</Box>
				</Stack>
			</Stack>
		</Box>
	)
}
