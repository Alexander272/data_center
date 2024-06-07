import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { IPlan } from '@/types/productionPlan'
import { SingleBar } from '../components/BarChart/SingleBar'

type Props = {
	data: IPlan[]
}

export default function Day({ data }: Props) {
	return (
		<Stack spacing={4}>
			<Stack direction={'row'}>
				<Box width={'80%'} ml={'auto'} mr={'auto'}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>Продукция</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Факт, Шт
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Факт, Руб
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									План, Руб
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									Разница, Руб (Факт - План)
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
										{new Intl.NumberFormat('ru-Ru').format(+(d.money || 0) - +(d.planMoney || 0))}
									</TableCell>
								</TableRow>
							))}

							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>Всего</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										data.reduce((acc, c) => acc + +(c.count || 0), 0)
									)}
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										data.reduce((acc, c) => acc + +(c.money || 0), 0)
									)}
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										data.reduce((acc, c) => acc + +(c.planMoney || 0), 0)
									)}
								</TableCell>
								<TableCell align='right' sx={{ fontWeight: 'bold' }}>
									{new Intl.NumberFormat('ru-Ru').format(
										data.reduce((acc, c) => acc + +(c.money || 0), 0) -
											data.reduce((acc, c) => acc + +(c.planMoney || 0), 0)
									)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Box>
			</Stack>

			<Stack direction={'row'} spacing={1}>
				<Stack width={'50%'}>
					<Typography align='center' fontWeight={'bold'}>
						Отгружено штук
					</Typography>

					<Box width={'100%'} height={400}>
						<SingleBar data={data.map(d => ({ value: +(d.count || 0), name: d.product || '' }))} />
					</Box>
				</Stack>

				<Stack width={'50%'}>
					<Typography align='center' fontWeight={'bold'}>
						Отгружено в руб
					</Typography>

					<Box width={'100%'} height={400}>
						<SingleBar data={data.map(d => ({ value: +(d.money || 0), name: d.product || '' }))} />
					</Box>
				</Stack>
			</Stack>
		</Stack>
	)
}
