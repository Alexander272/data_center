import { Box, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material'
import type { IShipmentPlan } from '@/types/shipment'
import { Pie } from '../components/Pie/Pie'

type Props = {
	data: IShipmentPlan[]
}

export default function Day({ data }: Props) {
	return (
		<Stack direction={'row'} spacing={1}>
			<Box width={'53%'}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Продукция</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Шт
							</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Факт. Руб
							</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								План. Руб
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map(d => (
							<TableRow key={d.id}>
								<TableCell>{d.product}</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(+(d.count || 0))}
								</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(+(d.money || 0))}
								</TableCell>
								<TableCell align='right'></TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell>Всего</TableCell>
							<TableCell align='right'>
								{new Intl.NumberFormat('ru-Ru').format(
									data.reduce((acc, c) => acc + +(c.count || 0), 0)
								)}
							</TableCell>
							<TableCell align='right'>
								{new Intl.NumberFormat('ru-Ru').format(
									data.reduce((acc, c) => acc + +(c.money || 0), 0)
								)}
							</TableCell>
							<TableCell align='right'></TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</Box>

			<Stack width={'47%'}>
				<Typography align='center' fontWeight={'bold'}>
					Отгружено штук
				</Typography>
				<Box width={'100%'} height={350}>
					<Pie
						data={data.map(d => ({ value: +(d.count || 0), name: d.product || '' }))}
						name='Отгружено штук'
					/>
				</Box>

				<Typography align='center' fontWeight={'bold'}>
					Отгружено в руб
				</Typography>
				<Box width={'100%'} height={350}>
					<Pie
						data={data.map(d => ({ value: +(d.money || 0), name: d.product || '' }))}
						name='Отгружено в руб'
					/>
				</Box>
			</Stack>
		</Stack>
	)
}
