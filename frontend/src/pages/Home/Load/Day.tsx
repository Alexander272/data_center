import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import type { IProductionLoad } from '@/types/productionLoad'

type Props = {
	data: IProductionLoad[]
}

export default function Day({ data }: Props) {
	return (
		<Stack direction={'row'}>
			<Box width={'50%'} ml={'auto'} mr={'auto'}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Участок</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Кол-во дней
							</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Кол-во ед продукции
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map(d => (
							<TableRow key={d.id}>
								<TableCell>{d.sector}</TableCell>
								<TableCell align='right'>{d.days}</TableCell>
								<TableCell align='right'>{d.quantity}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>
		</Stack>
	)
}
