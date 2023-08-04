import { Box, Typography } from '@mui/material'
import { Calendar } from '@/components/Calendar/Calendar'

export default function Secure() {
	return (
		<Box width={'400px'}>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Безопасность
			</Typography>

			<Calendar
				data={[
					{ day: '1', status: ['good', 'bad'] },
					{ day: '2', status: ['good', 'good'] },
					{ day: '3', status: ['bad', 'good'] },
					{ day: '4', status: ['good', 'good'] },
				]}
			/>
		</Box>
	)
}
