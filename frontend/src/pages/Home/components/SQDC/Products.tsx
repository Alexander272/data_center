import { Calendar } from '@/components/SQDCCalendar/Calendar'
import { Box, Typography } from '@mui/material'

const data = [
	{
		date: '01.09.2023',
		data: [
			{ type: 'good' as const, injuries: [] },
			{ type: 'bad' as const, injuries: [{ name: 'test', injury: 'ttttt', brigade: '1' }] },
		],
	},
	{
		date: '02.09.2023',
		data: [
			{ type: 'bad' as const, injuries: [{ name: 'test', injury: 'ttttttt', brigade: '2' }] },
			{ type: 'good' as const, injuries: [] },
		],
	},
	{
		date: '03.09.2023',
		data: [
			{ type: 'good' as const, injuries: [] },
			{ type: 'good' as const, injuries: [] },
		],
	},
]

export const Products = () => {
	return (
		<Box width={'400px'}>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Объем выпуска продукции
			</Typography>

			<Calendar data={data} />
			{/* <Calendar
				data={[
					{ day: '1', status: ['good'] },
					{ day: '2', status: ['good'] },
					{ day: '3', status: ['bad'] },
					{ day: '4', status: ['good'] },
					{ day: '5', status: ['good'] },
					{ day: '6', status: ['good'] },
					{ day: '7', status: ['bad'] },
					{ day: '8', status: ['good'] },
					{ day: '9', status: ['bad'] },
					{ day: '10', status: ['good'] },
					{ day: '11', status: ['good'] },
					{ day: '12', status: ['good'] },
					{ day: '13', status: ['good'] },
					{ day: '14', status: ['bad'] },
					{ day: '15', status: ['good'] },
				]}
			/> */}
		</Box>
	)
}
