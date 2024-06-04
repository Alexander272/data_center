import { Box, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'

import type { ITooling } from '@/types/tooling'

type Props = {
	data: ITooling[]
}

export default function Day({ data }: Props) {
	return (
		<Stack direction={'row'}>
			<Box width={'40%'} ml={'auto'} mr={'auto'}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Поступило заявок</TableCell>
							<TableCell>{new Intl.NumberFormat('ru-Ru').format(+(data[0].request || 0))}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Выполнено</TableCell>
							<TableCell>{new Intl.NumberFormat('ru-Ru').format(+(data[0].done || 0))}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>В работе</TableCell>
							<TableCell>{new Intl.NumberFormat('ru-Ru').format(+(data[0].progress || 0))}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Box>
		</Stack>
	)
}
