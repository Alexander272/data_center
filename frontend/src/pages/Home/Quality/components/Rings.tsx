import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

import type { IQuality } from '@/types/quality'
// import { Pie } from '../../components/PieChart/Pie'

// type Props = {
// 	data: IQuality[]
// }

// export default function Rings({ data }: Props) {
export default function Rings() {
	const table = new Map<string, IQuality>()
	// data.forEach(d => {
	// 	if (table.has(d.title)) {
	// 		const item: IQuality = table.get(d.title)!
	// 		table.set(d.title, {
	// 			...item,
	// 			amount: item.amount + d.amount,
	// 			percent: item.percent + d.percent,
	// 			cost: item.cost + d.cost,
	// 		})
	// 	} else {
	// 		table.set(d.title, d)
	// 	}
	// })

	return (
		<Stack mt={2}>
			<Box width={'80%'} ml={'auto'} mr={'auto'}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Вид брака</TableCell>
							<TableCell align='right'>Количество брака, шт.</TableCell>
							<TableCell align='right'>
								% брака по видам дефектов от общего кол-ва бракованных колец
							</TableCell>
							<TableCell align='right'>Затраты, руб.</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Array.from(table.keys()).map(key => (
							<TableRow key={table.get(key)?.id}>
								<TableCell>{table.get(key)?.title}</TableCell>
								{/* <TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(+(table.get(key)?.amount || 0))}
								</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(
										+(table.get(key)?.percent || 0) / (data.length / table.size)
									)}
								</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(+(table.get(key)?.cost || 0))}
								</TableCell> */}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>

			{/* <Box>
				<Pie
					data={Array.from(table.keys()).map(key => ({
						name: table.get(key)?.title || '',
						value: table.get(key)?.amount || 0,
					}))}
					name={'Количество брака, шт.'}
				/>
			</Box> */}
		</Stack>
	)
}
