import { Box, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { useGetOutputVolumeByPeriodQuery } from '@/store/api/outputVolume'
import { Pie } from '../components/Pie/Pie'

export default function Output() {
	const period = useAppSelector(state => state.dashboard.period)

	const { data } = useGetOutputVolumeByPeriodQuery(period, { skip: period.from == '' })

	if (!data?.data) return null

	const stock = data.data.filter(d => d.forStock)
	const orders = data.data.filter(d => !d.forStock)

	return (
		<Box padding={2} borderRadius={'16px'} sx={{ backgroundColor: '#fff' }} width={'100%'}>
			<Typography textAlign={'center'} fontWeight={'bold'} fontSize={'1.6rem'} mb={1}>
				Выпуск ({period.from})
			</Typography>

			<Stack direction={'row'} spacing={4} mb={2}>
				<Box width={'50%'}>
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
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Руб
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
									<TableCell align='right'>
										{new Intl.NumberFormat('ru-Ru').format(+(d.money || 0))}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell>Всего</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(
										stock.reduce((acc, c) => acc + +(c.count || 0), 0)
									)}
								</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(
										stock.reduce((acc, c) => acc + +(c.money || 0), 0)
									)}
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</Box>

				<Box width={'50%'}>
					<Typography align='center' fontWeight={'bold'} fontSize={'1.2rem'}>
						В заказы
					</Typography>
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
							{orders.map(d => (
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
						<TableFooter>
							<TableRow>
								<TableCell>Всего</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(
										orders.reduce((acc, c) => acc + +(c.count || 0), 0)
									)}
								</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(
										orders.reduce((acc, c) => acc + +(c.money || 0), 0)
									)}
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</Box>
			</Stack>

			<Stack direction={'row'} spacing={1}>
				<Stack width={'50%'}>
					<Typography align='center' fontWeight={'bold'}>
						Отгружено штук
					</Typography>
					<Box width={'100%'} height={350}>
						<Pie
							data={(stock || []).map(d => ({ value: +(d.count || 0), name: d.product || '' }))}
							name='Отгружено штук'
						/>
					</Box>

					<Typography align='center' fontWeight={'bold'}>
						Отгружено в руб
					</Typography>
					<Box width={'100%'} height={350}>
						<Pie
							data={(stock || []).map(d => ({ value: +(d.money || 0), name: d.product || '' }))}
							name='Отгружено в руб'
						/>
					</Box>
				</Stack>

				<Stack width={'50%'}>
					<Typography align='center' fontWeight={'bold'}>
						Отгружено штук
					</Typography>
					<Box width={'100%'} height={350}>
						<Pie
							data={(orders || []).map(d => ({ value: +(d.count || 0), name: d.product || '' }))}
							name='Отгружено штук'
						/>
					</Box>

					<Typography align='center' fontWeight={'bold'}>
						Отгружено в руб
					</Typography>
					<Box width={'100%'} height={350}>
						<Pie
							data={(orders || []).map(d => ({ value: +(d.money || 0), name: d.product || '' }))}
							name='Отгружено в руб'
						/>
					</Box>
				</Stack>
			</Stack>
		</Box>
	)
}
