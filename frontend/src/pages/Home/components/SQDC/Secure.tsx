import { Box, Typography } from '@mui/material'
import { Calendar } from '@/components/SQDCCalendar/Calendar'

const data = [
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
		data: [
			{ type: 'good' as const, injuries: [] },
			{ type: 'good' as const, injuries: [] },
		],
	},
]

export default function Secure() {
	return (
		<Box>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Безопасность
			</Typography>

			<Calendar
				data={data}
				// data={[
				// 	{ day: '1', status: ['good', 'bad'] },
				// 	{ day: '2', status: ['good', 'good'] },
				// 	{ day: '3', status: ['bad', 'good'] },
				// 	{ day: '4', status: ['good', 'good'] },
				// 	{ day: '5', status: ['good', 'good'] },
				// 	{ day: '6', status: ['good', 'good'] },
				// 	{ day: '7', status: ['bad', 'good'] },
				// 	{ day: '8', status: ['good', 'good'] },
				// 	{ day: '9', status: ['good', 'good'] },
				// 	{ day: '10', status: ['good', 'good'] },
				// 	{ day: '11', status: ['good', 'good'] },
				// 	{ day: '12', status: ['good', 'bad'] },
				// 	{ day: '13', status: ['good', 'good'] },
				// 	{ day: '14', status: ['good', 'good'] },
				// 	{ day: '15', status: ['good', 'good'] },
				// ]}
			/>
		</Box>
	)
}
