import { Box, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { IOutput } from '@/types/outputVolume'
import { Pie } from '../components/PieChart/Pie'

type Props = {
	data: IOutput[]
}

export default function Day({ data }: Props) {
	const stock = data.filter(d => d.forStock)
	const orders = data.filter(d => !d.forStock)

	return (
		<>
			<Stack direction={'row'} spacing={4} mb={2} divider={<Divider orientation='vertical' flexItem />}>
				<Box width={'22%'}>
					<Typography align='center' fontWeight={'bold'} fontSize={'1.2rem'}>
						На склад
					</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>Продукция</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Шт
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stock.map(d => (
								<TableRow key={d.id}>
									<TableCell>{d.product}</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(d.count || 0))}
									</TableCell>
								</TableRow>
							))}
						</TableBody>

						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Всего</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								{new Intl.NumberFormat('ru-Ru').format(
									stock.reduce((acc, c) => acc + +(c.count || 0), 0)
								)}
							</TableCell>
						</TableRow>
					</Table>
				</Box>

				<Box width={'78%'}>
					<Typography align='center' fontWeight={'bold'} fontSize={'1.2rem'}>
						В заказы
					</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>Продукция</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Факт, Шт
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									План, Шт
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Разница, Шт
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Факт, Руб
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									План, Руб
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Разница, Руб (План - Факт)
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders.map(d => (
								<TableRow key={d.id}>
									<TableCell>{d.product}</TableCell>
									<TableCell
										align='right'
										sx={{
											borderRadius: '12px',
											backgroundColor:
												+(d.count || 0) < +(d.planQuantity || 0) ? '#ff55557d' : 'transparent',
										}}
									>
										{new Intl.NumberFormat('ru-Ru').format(+(d.count || 0))}
									</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(d.planQuantity || 0))}
									</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(
											+(d.planQuantity || 0) - +(d.count || 0)
										)}
									</TableCell>

									<TableCell
										align='right'
										sx={{
											borderRadius: '12px',
											backgroundColor:
												+(d.money || 0) < +(d.planMoney || 0) ? '#ff55557d' : 'transparent',
										}}
									>
										{new Intl.NumberFormat('ru-Ru').format(+(d.money || 0))}
									</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(d.planMoney || 0))}
									</TableCell>
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(d.planMoney || 0) - +(d.money || 0))}
									</TableCell>
								</TableRow>
							))}

							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>Всего</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										orders.reduce((acc, c) => acc + +(c.count || 0), 0)
									)}
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										orders.reduce((acc, c) => acc + +(c.planQuantity || 0), 0)
									)}
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										orders.reduce((acc, c) => acc + +(c.planQuantity || 0), 0) -
											orders.reduce((acc, c) => acc + +(c.count || 0), 0)
									)}
								</TableCell>

								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										orders.reduce((acc, c) => acc + +(c.money || 0), 0)
									)}
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										orders.reduce((acc, c) => acc + +(c.planMoney || 0), 0)
									)}
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										orders.reduce((acc, c) => acc + +(c.planMoney || 0), 0) -
											orders.reduce((acc, c) => acc + +(c.money || 0), 0)
									)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Box>
			</Stack>

			<Typography fontWeight={'bold'} ml={2} fontSize={'1.2rem'}>
				Общий объем выпуска -{' '}
				{new Intl.NumberFormat('ru-Ru').format(data.reduce((acc, c) => acc + +(c.count || 0), 0))} Шт
			</Typography>

			<Stack direction={'row'} spacing={1}>
				<Stack width={'50%'}>
					<Typography align='center' fontWeight={'bold'}>
						На склад, штук
					</Typography>
					<Box width={'100%'} height={320}>
						<Pie
							data={(stock || []).map(d => ({ value: +(d.count || 0), name: d.product || '' }))}
							name='На склад, штук'
						/>
					</Box>
				</Stack>

				<Stack width={'50%'}>
					<Typography align='center' fontWeight={'bold'}>
						В заказы, штук
					</Typography>
					<Box width={'100%'} height={320}>
						<Pie
							data={(orders || []).map(d => ({ value: +(d.count || 0), name: d.product || '' }))}
							name='В заказы, штук'
						/>
					</Box>

					<Typography align='center' fontWeight={'bold'}>
						В заказы, руб
					</Typography>
					<Box width={'100%'} height={320}>
						<Pie
							data={(orders || []).map(d => ({ value: +(d.money || 0), name: d.product || '' }))}
							name='В заказы, руб'
						/>
					</Box>
				</Stack>
			</Stack>
		</>
	)
}
