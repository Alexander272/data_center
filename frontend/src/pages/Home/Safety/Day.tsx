import { Box, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'

import type { ISafety } from '@/types/safety'

type Props = {
	data: ISafety[]
}

export default function Day({ data }: Props) {
	return (
		<Stack direction={'row'}>
			<Box width={'40%'} ml={'auto'} mr={'auto'}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Количество выявленных нарушений</TableCell>
							<TableCell width={'30%'} align='right'>
								{new Intl.NumberFormat('ru-Ru').format(+(data[0].violations || 0))}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Количество травм</TableCell>
							<TableCell width={'30%'} align='right'>
								{new Intl.NumberFormat('ru-Ru').format(+(data[0].injuries || 0))}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Box>
		</Stack>
	)
}
