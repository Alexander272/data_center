import { IOrdersVolume } from '@/types/orderVolume'
import { Box, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'

type Props = {
	data: IOrdersVolume[]
}

export default function Day({ data }: Props) {
	return (
		<Stack direction={'row'}>
			<Box width={'50%'} ml={'auto'} mr={'auto'}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Количество заказов</TableCell>
							<TableCell>{data[0].numberOfOrders}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Сумма заказов</TableCell>
							<TableCell>{data[0].sumMoney}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>
								Суммарное количество ед. продукции в заказах
							</TableCell>
							<TableCell>{data[0].quantity}</TableCell>
						</TableRow>
					</TableBody>
					{/* <TableHead>
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
				<TableBody> */}
					{/* {stock.map(d => (
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
				</TableBody> */}
					{/* <TableFooter>
					<TableRow>
						<TableCell>Всего</TableCell>
						<TableCell align='right'>
							{new Intl.NumberFormat('ru-Ru').format(stock.reduce((acc, c) => acc + +(c.count || 0), 0))}
						</TableCell>
						<TableCell align='right'>
							{new Intl.NumberFormat('ru-Ru').format(stock.reduce((acc, c) => acc + +(c.money || 0), 0))}
						</TableCell>
					</TableRow>
				</TableFooter> */}
				</Table>
			</Box>
		</Stack>
	)
}
