import { Box, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'
import type { IShippingPlan } from '@/types/shippingPlan'

type Props = {
	data: IShippingPlan[]
}

export default function Day({ data }: Props) {
	return (
		<Stack direction={'row'}>
			<Box width={'50%'} ml={'auto'} mr={'auto'}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Количество заказов</TableCell>
							<TableCell width={'30%'} align='right'>
								{data[0].numberOfOrders}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Сумма заказов</TableCell>
							<TableCell width={'30%'} align='right'>
								{new Intl.NumberFormat('ru-Ru').format(+(data[0].sumMoney || 0))}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>
								Суммарное количество ед. продукции в заказах
							</TableCell>
							<TableCell width={'30%'} align='right'>
								{new Intl.NumberFormat('ru-Ru').format(+(data[0].quantity || 0))}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Box>
		</Stack>
	)
}
