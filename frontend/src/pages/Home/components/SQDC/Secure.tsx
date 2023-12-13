import { Box, Typography } from '@mui/material'
import type { ISQDC } from '@/types/sheet'
import { Calendar } from '@/components/SQDCCalendar/Calendar'

const data: ISQDC[] = [
	{
		date: '01.12.2023',
		data: [
			{ type: 'good' as const, values: [] },
			{
				type: 'bad' as const,
				values: [
					'Ivan Ivanovich Ivanov - injury',
					'Petr - injury' /*{ name: 'test', injury: 'ttttt', brigade: '1' }*/,
				],
			},
		],
	},
	{
		date: '02.12.2023',
		data: [
			{
				type: 'bad' as const,
				values: ['Ivan Ivanovich Ivanov - injury' /*{ name: 'test', injury: 'ttttttt', brigade: '2' }*/],
			},
			{ type: 'good' as const, values: [] },
		],
	},
	{
		date: '03.12.2023',
		data: [{ type: 'good' as const /*injuries: []*/ }, { type: 'good' as const /*injuries: []*/ }],
	},
]

export default function Secure() {
	return (
		<Box>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Безопасность
			</Typography>

			<Calendar data={data} />
		</Box>
	)
}
