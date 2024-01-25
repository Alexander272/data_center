// import { Calendar } from '@/components/SQDCCalendar/Calendar'
import { Calendar } from '@/components/SQDCCalendar/Calendar'
import { Box, Typography } from '@mui/material'

export const Brigade = () => {
	return (
		<Box width={'400px'}>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Численность
			</Typography>

			<Calendar data={[]} />

			{/* <Calendar
				data={[
					{ day: '1', status: ['good', 'good'] },
					{ day: '2', status: ['good', 'good'] },
					{ day: '3', status: ['bad', 'good'] },
					{ day: '4', status: ['good', 'good'] },
					{ day: '5', status: ['good', 'good'] },
					{ day: '6', status: ['good', 'good'] },
					{ day: '7', status: ['good', 'bad'] },
					{ day: '8', status: ['good', 'good'] },
					{ day: '9', status: ['good', 'good'] },
					{ day: '10', status: ['bad', 'good'] },
					{ day: '11', status: ['good', 'good'] },
					{ day: '12', status: ['good', 'good'] },
					{ day: '13', status: ['good', 'good'] },
					{ day: '14', status: ['good', 'good'] },
					{ day: '15', status: ['good', 'good'] },
				]}
			/> */}
		</Box>
	)
}
