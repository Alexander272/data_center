import { Calendar } from '@/components/Calendar/Calendar'
import { Box, Typography } from '@mui/material'

export const Brigade = () => {
	return (
		<Box width={'400px'}>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Численность
			</Typography>

			<Calendar
				data={[
					{ day: '1', status: ['good', 'good'] },
					{ day: '2', status: ['good', 'good'] },
					{ day: '3', status: ['bad', 'good'] },
					// { day: '4', status: ['good', 'good'] },
				]}
			/>
		</Box>
	)
}
