import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

import type { ISemiFinished } from '@/types/semiFinished'

type Props = {
	data: ISemiFinished[]
}

export default function Day({ data }: Props) {
	return (
		<Stack direction={'row'}>
			<Box width={'30%'} ml={'auto'} mr={'auto'}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Продукция</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Объем выпуска
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map(d => (
							<TableRow key={d.id}>
								<TableCell>{d.product}</TableCell>
								<TableCell align='right'>
									{new Intl.NumberFormat('ru-Ru').format(+(data[0].count || 0))}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>
		</Stack>
	)
}
