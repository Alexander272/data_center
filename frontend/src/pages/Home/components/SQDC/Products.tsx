import { Calendar } from '@/components/Calendar/Calendar'
import { Box, Typography } from '@mui/material'

export const Products = () => {
	return (
		<Box width={'400px'}>
			<Typography variant='h5' textAlign={'center'} mb={1}>
				Объем выпуска продукции
			</Typography>

			<Calendar
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
			/>
		</Box>
	)
}
